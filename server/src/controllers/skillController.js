const Skill = require('../models/Skill');

exports.list = async (req, res, next) => {
  try {
    const { q } = req.query;
    const filter = q ? { name: new RegExp(q, 'i') } : {};
    const skills = await Skill.find(filter).sort('-demandScore name');
    res.json(skills);
  } catch (e) { next(e); }
};

exports.get = async (req, res, next) => {
  try {
    const s = await Skill.findById(req.params.id);
    if (!s) return res.status(404).json({ message: 'Not found' });
    res.json(s);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try { res.status(201).json(await Skill.create(req.body)); } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const s = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!s) return res.status(404).json({ message: 'Not found' });
    res.json(s);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const s = await Skill.findByIdAndDelete(req.params.id);
    if (!s) return res.status(404).json({ message: 'Not found' });
    res.json({ ok: true });
  } catch (e) { next(e); }
};
