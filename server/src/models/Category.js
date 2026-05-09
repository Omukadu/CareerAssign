const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name:  { type: String, required: true, unique: true, trim: true },
  slug:  { type: String, required: true, unique: true, lowercase: true, index: true },
  icon:  { type: String, default: 'briefcase' },
  color: { type: String, default: '#7c3aed' },
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
