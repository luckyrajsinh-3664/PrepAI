const { generateWithFallback } = require('../config/gemini');
const Attempt = require('../models/Attempt');

// @route   POST /api/interview/start (PURE AI)
exports.startInterview = async (req, res) => {
  try {
    const { role, difficulty, count } = req.body;
    const numQuestions = count || 5;

    const prompt = `Generate ${numQuestions} ${difficulty} interview questions for a ${role} position. Each question should have:
1. The question text
2. Expected keywords that should be in a good answer

Return as a JSON array with this exact format:
[
  {
    "question": "question text here",
    "expectedKeywords": ["keyword1", "keyword2", "keyword3"]
  }
]
Only return the JSON array, no other text.`;

    const aiResult = await generateWithFallback(prompt);
    const textResponse = aiResult.response.text().trim();
    
    // Clean JSON response
    const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const questionsArray = JSON.parse(cleanJson);

    const attempt = await Attempt.create({
      userId: req.user.id,
      role,
      difficulty,
      totalQuestions: questionsArray.length,
      answers: questionsArray.map((q, idx) => ({
        questionId: `q_${idx + 1}`,
        questionText: q.question,
        expectedKeywords: q.expectedKeywords,
        userAnswer: '',
        score: 0,
        aiFeedback: ''
      })),
      status: 'In Progress'
    });

    res.status(201).json({ attemptId: attempt._id, role, difficulty, questions: attempt.answers });
  } catch (error) {
    console.error('Gemini Interview Start Error:', error);
    res.status(500).json({ message: 'AI Question Generation failed. Ensure Gemini Key is valid.', error: error.message });
  }
};

// @route   POST /api/interview/submit (PURE AI)
exports.submitAnswer = async (req, res) => {
  try {
    const { attemptId, questionId, userAnswer } = req.body;
    const attempt = await Attempt.findById(attemptId);

    if (!attempt) return res.status(404).json({ message: 'Interview attempt not found' });

    const questionItem = attempt.answers.find(a => a.questionId === questionId);
    if (!questionItem) return res.status(404).json({ message: 'Question not found in attempt' });

    // --- UPDATED EVALUATION PROMPT FOR CONCISE INTERVIEW SCORING ---
    const prompt = `You are an expert interviewer evaluating a candidate's SPOKEN interview response.
In spoken interviews, time is limited, so concise, clear, and direct answers are strongly preferred over long, verbose essays.

Role: ${attempt.role}
Question: "${questionItem.questionText}"
Expected Keywords: ${JSON.stringify(questionItem.expectedKeywords)}
Candidate's Answer: "${userAnswer}"

Evaluation Rules & Criteria:
1. Conciseness & Clarity (Crucial): Award high scores (8-10) for short, punchy, clear answers that cover core concepts efficiently without fluff (ideally 1 to 3 concise sentences or ~30 to 75 words).
2. Key Concept Coverage: Ensure expected keywords or their semantic equivalents are addressed naturally.
3. Penalty for Fluff: Slightly deduct points if the answer is unnecessarily long, overly essay-like, rambling, or full of filler text.
4. Scale: Score strictly on a 0 to 10 scale.

Return JSON strictly in this structure:
{
  "score": 8,
  "aiFeedback": "Short feedback commending conciseness or pointing out missing core ideas.",
  "keyMissingConcepts": ["concept1", "concept2"]
}
Return only JSON.`;

    const aiResult = await generateWithFallback(prompt);
    const textResponse = aiResult.response.text().trim();
    const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const evaluation = JSON.parse(cleanJson);

    questionItem.userAnswer = userAnswer;
    questionItem.score = evaluation.score;
    questionItem.aiFeedback = evaluation.aiFeedback;
    questionItem.keyMissingConcepts = evaluation.keyMissingConcepts || [];

    // Calculate dynamic overall score
    const totalAnswered = attempt.answers.filter(a => a.userAnswer.length > 0).length;
    const totalScoreSum = attempt.answers.reduce((acc, curr) => acc + curr.score, 0);
    attempt.overallScore = Math.round((totalScoreSum / (attempt.answers.length * 10)) * 100);

    if (totalAnswered === attempt.answers.length) {
      attempt.status = 'Completed';
    }

    await attempt.save();
    res.json({ message: 'Answer evaluated successfully', evaluation, attempt });
  } catch (error) {
    console.error('Gemini Submit Error:', error);
    res.status(500).json({ message: 'AI Evaluation failed', error: error.message });
  }
};

// @route   GET /api/interview/results/:attemptId
exports.getResults = async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.attemptId);
    if (!attempt) return res.status(404).json({ message: 'Attempt not found' });
    res.json(attempt);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching results', error: error.message });
  }
};

// @route   GET /api/interview/history
exports.getHistory = async (req, res) => {
  try {
    const attempts = await Attempt.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history', error: error.message });
  }
};

// @route   GET /api/interview/current
exports.getCurrentInterview = async (req, res) => {
  try {
    const current = await Attempt.findOne({ userId: req.user.id, status: 'In Progress' }).sort({ createdAt: -1 });
    res.json(current);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active interview', error: error.message });
  }
};