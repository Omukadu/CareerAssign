const mongoose = require('mongoose');

const CareerSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category:    { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  skills:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  avgSalary:   { type: Number, default: 0 },
  demand:      { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium', index: true },
  image:       { type: String, default: '' },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  views:       { type: Number, default: 0 },
}, { timestamps: true });

CareerSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Career', CareerSchema);
