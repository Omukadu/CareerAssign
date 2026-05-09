const mongoose = require('mongoose');

const SavedCareerSchema = new mongoose.Schema({
  user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  career: { type: mongoose.Schema.Types.ObjectId, ref: 'Career', required: true },
}, { timestamps: true });

SavedCareerSchema.index({ user: 1, career: 1 }, { unique: true });

module.exports = mongoose.model('SavedCareer', SavedCareerSchema);
