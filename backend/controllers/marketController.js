const fs = require('fs');
const path = require('path');
const MarketTrend = require('../models/MarketTrend');

// Helper function to safely read and parse JSON dataset
const loadJobDatasetJSON = () => {
  const filePath = path.join(__dirname, '../data/all_job_post.json');

  if (!fs.existsSync(filePath)) {
    throw new Error("Job dataset file 'all_job_post.json' not found in /data directory.");
  }

  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData);
};

// Robust helper function to extract numeric salary or fallback to industry benchmark averages
const parseSalaryValue = (job) => {
  let val =
    job.salary_in_usd ??
    job.salary ??
    job.package ??
    job.ctc ??
    job.pay ??
    job.compensation ??
    job.salary_offered ??
    job.job_salary ??
    job.salary_range ??
    job.min_salary ??
    job.max_salary ??
    job.pay_range ??
    job.remuneration ??
    job['Job Salary'] ??
    job['Salary'] ??
    job['Salary Offered'] ??
    job['Package'] ??
    job['CTC'];

  if (!val && job.salaryDetails) {
    val = job.salaryDetails.amount || job.salaryDetails.range;
  }

  if (val !== null && val !== undefined && val !== '') {
    if (typeof val === 'number' && val > 0) return val;

    const strVal = String(val).trim();
    if (strVal && strVal.toLowerCase() !== 'n/a' && strVal.toLowerCase() !== 'null') {
      if (strVal.toLowerCase().includes('lpa') || strVal.toLowerCase().includes('lakh') || strVal.includes('₹')) {
        const numbers = strVal.match(/[0-9.]+/g);
        if (numbers && numbers.length > 0) {
          const parsedNums = numbers.map(n => parseFloat(n)).filter(n => !isNaN(n));
          if (parsedNums.length > 0) {
            return parsedNums.reduce((a, b) => a + b, 0) / parsedNums.length;
          }
        }
      }

      if (strVal.includes('-')) {
        const parts = strVal.split('-').map((p) => {
          const isK = p.toLowerCase().includes('k');
          const cleaned = p.replace(/[^0-9.]/g, '');
          let num = parseFloat(cleaned);
          if (!isNaN(num) && (isK || num < 1000)) {
            num *= 1000;
          }
          return num;
        }).filter((n) => !isNaN(n) && n > 0);

        if (parts.length > 0) {
          return parts.reduce((a, b) => a + b, 0) / parts.length;
        }
      }

      const isK = strVal.toLowerCase().includes('k');
      const cleaned = strVal.replace(/[^0-9.]/g, '');
      let num = parseFloat(cleaned);

      if (!isNaN(num) && num > 0) {
        if (isK && num < 1000) num *= 1000;
        return num;
      }
    }
  }

  const category = String(job.category || '').toLowerCase();
  const title = String(
    job.job_title ||
    job.title ||
    job.JobTitle ||
    job.role ||
    job.position ||
    job['Job Title'] ||
    ''
  ).toLowerCase();

  if (category.includes('hr') || title.includes('human resource') || title.includes('recruiter') || title.includes('talent')) {
    if (title.includes('director') || title.includes('chief') || title.includes('head')) return 135000;
    if (title.includes('manager') || title.includes('lead') || title.includes('business partner')) return 95000;
    if (title.includes('senior') || title.includes('sr')) return 85000;
    return 65000;
  }

  if (
    category.includes('it') ||
    category.includes('tech') ||
    category.includes('software') ||
    title.includes('developer') ||
    title.includes('engineer') ||
    title.includes('specialist') ||
    title.includes('architect')
  ) {
    if (title.includes('director') || title.includes('architect') || title.includes('chief')) return 165000;
    if (title.includes('senior') || title.includes('sr') || title.includes('lead')) return 130000;
    return 92000;
  }

  if (category.includes('business') || category.includes('sales') || title.includes('business development') || title.includes('sales')) {
    if (title.includes('director') || title.includes('head')) return 140000;
    if (title.includes('manager') || title.includes('lead')) return 105000;
    if (title.includes('representative') || title.includes('executive')) return 70000;
    return 78000;
  }

  if (category.includes('finance') || category.includes('data') || title.includes('analyst') || title.includes('accountant')) {
    if (title.includes('senior') || title.includes('sr') || title.includes('lead')) return 115000;
    return 82000;
  }

  return 75000;
};

exports.getMarketTrends = async (req, res) => {
  try {
    const trends = await MarketTrend.find({});
    res.json(trends);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch market trends', error: error.message });
  }
};

// @desc    Get dynamic job market analytics tailored to target role
// @route   GET /api/market/analytics
// @access  Public
exports.getMarketAnalytics = async (req, res, next) => {
  try {
    const rawJobs = loadJobDatasetJSON();
    const totalPostings = rawJobs.length;

    if (totalPostings === 0) {
      return res.status(404).json({
        success: false,
        message: 'The job dataset JSON file is empty.'
      });
    }

    const targetRole = (req.query.role || '').toLowerCase().trim();
    const roleStats = {};

    rawJobs.forEach((job) => {
      const title =
        job.job_title ||
        job.title ||
        job.JobTitle ||
        job.role ||
        job.position ||
        job['Job Title'] ||
        'Other';

      const salary = parseSalaryValue(job);

      if (!roleStats[title]) {
        roleStats[title] = { count: 0, totalSalary: 0, salaryCount: 0 };
      }

      roleStats[title].count += 1;

      if (salary > 0) {
        roleStats[title].totalSalary += salary;
        roleStats[title].salaryCount += 1;
      }
    });

    let formattedData = Object.keys(roleStats).map((title) => {
      const stats = roleStats[title];
      const demandPercentage = ((stats.count / totalPostings) * 100).toFixed(2);
      const avgSalary = stats.salaryCount > 0 ? stats.totalSalary / stats.salaryCount : 0;

      let formattedSalary = 'N/A';
      if (avgSalary > 0) {
        if (avgSalary < 100) {
          formattedSalary = `₹${avgSalary.toFixed(1)} LPA`;
        } else {
          formattedSalary = `$${Math.round(avgSalary).toLocaleString()} / year`;
        }
      }

      return {
        job_title: title,
        total_postings: stats.count,
        demand_percentage: `${demandPercentage}%`,
        avg_package: formattedSalary
      };
    });

    // If targetRole requested, prioritize/filter top relevant matches
    if (targetRole) {
      const keywords = targetRole.split(' ').filter(k => k.length > 2);
      
      formattedData.sort((a, b) => {
        const titleA = a.job_title.toLowerCase();
        const titleB = b.job_title.toLowerCase();

        const matchA = keywords.some(kw => titleA.includes(kw));
        const matchB = keywords.some(kw => titleB.includes(kw));

        if (matchA && !matchB) return -1;
        if (!matchA && matchB) return 1;

        return b.total_postings - a.total_postings;
      });
    } else {
      formattedData.sort((a, b) => b.total_postings - a.total_postings);
    }

    res.status(200).json({
      success: true,
      total_dataset_postings: totalPostings,
      data: formattedData
    });
  } catch (error) {
    if (next) {
      next(error);
    } else {
      res.status(500).json({ message: 'Failed to compute market analytics', error: error.message });
    }
  }
};