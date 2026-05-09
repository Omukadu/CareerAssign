const SavedCareer = require('../models/SavedCareer');

exports.list = async (req, res, next) => {
  try {
    const items = await SavedCareer.find({ user: req.user._id })
      .populate({ path: 'career', populate: [{ path: 'category', select: 'name color' }] })
      .sort('-createdAt');
    res.json(items.filter(i => i.career));
  } catch (e) { next(e); }
};

exports.save = async (req, res, next) => {
  try {
    const doc = await SavedCareer.findOneAndUpdate(
      { user: req.user._id, career: req.params.careerId },
      { user: req.user._id, career: req.params.careerId },
      { upsert: true, new: true }
    );
    res.status(201).json(doc);
  } catch (e) { next(e); }
};

exports.unsave = async (req, res, next) => {
  try {
    await SavedCareer.deleteOne({ user: req.user._id, career: req.params.careerId });
    res.json({ ok: true });
  } catch (e) { next(e); }
};
