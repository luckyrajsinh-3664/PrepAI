const { generateWithFallback } = require('../config/gemini');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const Resume = require('../models/Resume');
const MarketTrend = require('../models/MarketTrend');

// Helper to safely load local job postings dataset
const loadJobDataset = () => {
  try {
    const filePath = path.join(__dirname, '../data/all_job_post.json');
    if (fs.existsSync(filePath)) {
      const rawData = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(rawData);
    }
  } catch (err) {
    console.error('Failed to load local dataset for matching:', err);
  }
  return [];
};

// Fallback algorithm to compute role recommendations directly from local dataset
const computeLocalRoleMatches = (extractedSkills, rawJobs) => {
  if (!extractedSkills || extractedSkills.length === 0 || !rawJobs || rawJobs.length === 0) {
    return [
      { title: 'Software Engineer', matchScore: 85, avgSalary: '$95,000 / year' },
      { title: 'Full Stack Developer', matchScore: 78, avgSalary: '$90,000 / year' }
    ];
  }

  const normalizedSkills = extractedSkills.map((s) => String(s).toLowerCase().trim());
  const roleStats = {};

  rawJobs.forEach((job) => {
    const title =
      job.job_title ||
      job.title ||
      job.JobTitle ||
      job.role ||
      job.position ||
      'Software Engineer';

    if (!roleStats[title]) {
      roleStats[title] = { count: 0, titleLower: title.toLowerCase(), sampleSalary: job.avg_package || job.salary || '$88,000 / year' };
    }
    roleStats[title].count += 1;
  });

  const scored = Object.keys(roleStats).map((title) => {
    const item = roleStats[title];
    let matchHits = 0;

    normalizedSkills.forEach((skill) => {
      if (item.titleLower.includes(skill) || skill.includes(item.titleLower)) {
        matchHits += 2;
      } else {
        const parts = skill.split(' ');
        parts.forEach((p) => {
          if (p.length > 2 && item.titleLower.includes(p)) matchHits += 1;
        });
      }
    });

    const baseScore = Math.min(60 + matchHits * 12, 96);
    return {
      title,
      matchScore: baseScore,
      avgSalary: typeof item.sampleSalary === 'number' ? `$${item.sampleSalary.toLocaleString()} / year` : String(item.sampleSalary),
      postings: item.count
    };
  });

  return scored
    .sort((a, b) => b.matchScore - a.matchScore || b.postings - a.postings)
    .slice(0, 3)
    .map(({ title, matchScore, avgSalary }) => ({ title, matchScore, avgSalary }));
};

// @route   POST /api/resume/analyze
exports.analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF resume' });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    // Fetch Kaggle Market Trends DB records & load local job postings
    const marketData = await MarketTrend.find({});
    const localJobs = loadJobDataset();

    const prompt = `Analyze the following resume and cross-reference extracted skills against our Kaggle Job Market Dataset.

KAGGLE MARKET DATASET CONTEXT:
${JSON.stringify(marketData.slice(0, 20))}

RESUME TEXT:
"""${resumeText}"""

Analyze the resume thoroughly and return a JSON response with exactly this structure:
{
  "overallScore": 85,
  "atsScore": 78,
  "extractedSkills": ["React", "Node.js", "MongoDB"],
  "missingSkills": ["Docker", "Kubernetes"],
  "strengths": ["Clear structure", "Good technical skills"],
  "weaknesses": ["Lack of quantifiable achievements"],
  "improvementSuggestions": ["Add more metrics"],
  "keywordTips": ["Include more industry keywords"],
  "recommendedRoles": [
    {
      "title": "Full Stack Engineer",
      "matchScore": 88,
      "avgSalary": "$95,000 / year"
    },
    {
      "title": "Backend Developer",
      "matchScore": 82,
      "avgSalary": "$90,000 / year"
    },
    {
      "title": "Frontend Developer",
      "matchScore": 75,
      "avgSalary": "$85,000 / year"
    }
  ],
  "summary": "Overall, this is a strong technical resume."
}

Ensure "recommendedRoles" returns 3 specific, distinct job titles matched directly against the resume's skills along with calculated match percentage scores and average market packages.
Return only JSON. No extra text.`;

    const aiResult = await generateWithFallback(prompt);
    const textResponse = aiResult.response.text().trim();
    const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    let parsedAnalysis = JSON.parse(cleanJson);

    // Fallback normalization for recommendedRoles if AI returns simple array of strings
    if (
      !parsedAnalysis.recommendedRoles ||
      !Array.isArray(parsedAnalysis.recommendedRoles) ||
      parsedAnalysis.recommendedRoles.length === 0 ||
      typeof parsedAnalysis.recommendedRoles[0] === 'string'
    ) {
      const skills = parsedAnalysis.extractedSkills || [];
      parsedAnalysis.recommendedRoles = computeLocalRoleMatches(skills, localJobs);
    }

    // Clean up file after parsing
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    const newResume = await Resume.create({
      userId: req.user.id,
      fileName: req.file.originalname,
      ...parsedAnalysis
    });

    res.status(201).json(newResume);
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Resume Analysis Error:', error);
    res.status(500).json({ message: 'AI Resume Analysis Failed', error: error.message });
  }
};

// @route   GET /api/resume/history
exports.getResumeHistory = async (req, res) => {
  try {
    const history = await Resume.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resume history', error: error.message });
  }
};