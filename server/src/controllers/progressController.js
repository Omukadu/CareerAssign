const Progress = require('../models/Progress');

exports.list = async (req, res, next) => {
  try {
    const items = await Progress.find({ user: req.user._id }).populate('skill');
    res.json(items);
  } catch (e) { next(e); }
};

exports.upsert = async (req, res, next) => {
  try {
    const { percent, label } = req.body;
    const doc = await Progress.findOneAndUpdate(
      { user: req.user._id, skill: req.params.skillId },
      { user: req.user._id, skill: req.params.skillId, percent, label },
      { upsert: true, new: true }
    ).populate('skill');
    res.json(doc);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    await Progress.deleteOne({ user: req.user._id, skill: req.params.skillId });
    res.json({ ok: true });
  } catch (e) { next(e); }
};
