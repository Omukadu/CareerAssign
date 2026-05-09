const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  skill:   { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true },
  percent: { type: Number, min: 0, max: 100, default: 0 },
  label:   { type: String, default: '' },
}, { timestamps: true });

ProgressSchema.index({ user: 1, skill: 1 }, { unique: true });

module.exports = mongoose.model('Progress', ProgressSchema);
