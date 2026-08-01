const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  overallScore: { type: Number, required: true },
  atsScore: { type: Number, required: true },
  extractedSkills: [{ type: String }],
  missingSkills: [{ type: String }],
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  improvementSuggestions: [{ type: String }],
  keywordTips: [{ type: String }],
  
  // Updated schema to match object structure returned by AI & dataset matcher
  recommendedRoles: [
    {
      title: { type: String },
      matchScore: { type: Number },
      avgSalary: { type: String }
    }
  ],

  marketAlignmentScore: { type: Number, default: 0 },
  summary: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', resumeSchema);