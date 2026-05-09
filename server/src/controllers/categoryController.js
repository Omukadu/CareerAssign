const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const Category = require('../models/Category');
const Career = require('../models/Career');

exports.list = async (_req, res, next) => {
  try {
    const cats = await Category.find().sort('name').lean();
    const counts = await Career.aggregate([{ $group: { _id: '$category', n: { $sum: 1 } } }]);
    const map = Object.fromEntries(counts.map(c => [String(c._id), c.n]));
    res.json(cats.map(c => ({ ...c, careerCount: map[String(c._id)] || 0 })));
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const { name, icon, color } = req.body;
    const cat = await Category.create({ name, slug: slugify(name), icon, color });
    res.status(201).json(cat);
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const update = { ...req.body };
    if (update.name) update.slug = slugify(update.name);
    const cat = await Category.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!cat) return res.status(404).json({ message: 'Not found' });
    res.json(cat);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Not found' });
    res.json({ ok: true });
  } catch (e) { next(e); }
};
