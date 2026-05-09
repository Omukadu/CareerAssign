const Career = require('../models/Career');
const SavedCareer = require('../models/SavedCareer');

exports.list = async (req, res, next) => {
  try {
    const { q, category, demand } = req.query;
    const page = Math.max(parseInt(req.query.page || '1'), 1);
    const limit = Math.min(parseInt(req.query.limit || '12'), 50);
    const filter = {};
    if (category) filter.category = category;
    if (demand) filter.demand = demand;
    if (q) filter.$or = [{ title: new RegExp(q, 'i') }, { description: new RegExp(q, 'i') }];

    const [items, total] = await Promise.all([
      Career.find(filter)
        .populate('category', 'name slug color icon')
        .populate('skills', 'name')
        .sort('-views -createdAt')
        .skip((page - 1) * limit).limit(limit),
      Career.countDocuments(filter),
    ]);
    res.json({ items, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (e) { next(e); }
};

exports.get = async (req, res, next) => {
  try {
    const c = await Career.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true })
      .populate('category').populate('skills');
    if (!c) return res.status(404).json({ message: 'Not found' });
    res.json(c);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const career = await Career.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(career);
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const c = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!c) return res.status(404).json({ message: 'Not found' });
    res.json(c);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const c = await Career.findByIdAndDelete(req.params.id);
    if (!c) return res.status(404).json({ message: 'Not found' });
    await SavedCareer.deleteMany({ career: req.params.id });
    res.json({ ok: true });
  } catch (e) { next(e); }
};
