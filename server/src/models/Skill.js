const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name:        { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: '' },
  demandScore: { type: Number, default: 50, min: 0, max: 100 },
}, { timestamps: true });

SkillSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Skill', SkillSchema);
