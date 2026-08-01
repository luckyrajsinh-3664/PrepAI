const mongoose = require('mongoose');

const marketTrendSchema = new mongoose.Schema({
  role: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  inDemandSkills: [{ type: String }],
  trendingTools: [{ type: String }],
  hiringGrowthRate: { type: String },
  averageSalaryRange: { type: String },
  topCompaniesHiring: [{ type: String }],
  dataSource: { type: String, default: 'Kaggle Tech Job Postings & LinkedIn Industry Insights Dataset' },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MarketTrend', marketTrendSchema);