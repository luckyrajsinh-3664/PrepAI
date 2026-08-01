const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  questionText: { type: String, required: true },
  expectedKeywords: [{ type: String }],
  userAnswer: { type: String, default: '' },      // Removed required: true
  score: { type: Number, default: 0 },             // Removed required: true
  aiFeedback: { type: String, default: '' },      // Removed required: true
  keyMissingConcepts: [{ type: String }]
});

const attemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  totalQuestions: { type: Number, required: true },
  answers: [answerSchema],
  overallScore: { type: Number, default: 0 },
  status: { type: String, enum: ['In Progress', 'Completed'], default: 'In Progress' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attempt', attemptSchema);