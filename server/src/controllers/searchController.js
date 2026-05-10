const Career = require("../models/Career");
const Skill = require("../models/Skill");
const Category = require("../models/Category");

exports.global = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.json({ careers: [], skills: [], categories: [] });
    }

    const searchPattern = new RegExp(q, "i");
    const [careers, skills, categories] = await Promise.all([
      Career.find({
        $or: [{ title: searchPattern }, { description: searchPattern }],
      })
        .populate("category", "name icon color")
        .populate("skills", "name")
        .limit(5),
      Skill.find({
        $or: [{ name: searchPattern }, { description: searchPattern }],
      }).limit(5),
      Category.find({
        name: searchPattern,
      }).limit(5),
    ]);

    res.json({ careers, skills, categories });
  } catch (e) {
    next(e);
  }
};
