const Career = require("../models/Career");
const Category = require("../models/Category");
const Skill = require("../models/Skill");
const Progress = require("../models/Progress");
const SavedCareer = require("../models/SavedCareer");

exports.summary = async (req, res, next) => {
  try {
    const [popular, rawCategories, topSkills, progress, savedCount] =
      await Promise.all([
        Career.find()
          .sort("-views")
          .limit(4)
          .populate("category", "name color"),
        Category.find().sort("name").limit(8).lean(),
        Skill.find().sort("-demandScore").limit(5),
        Progress.find({ user: req.user._id })
          .populate("skill", "name")
          .sort("-updatedAt")
          .limit(5),
        SavedCareer.countDocuments({ user: req.user._id }),
      ]);

    // ✅ Add career count per category
    const counts = await Career.aggregate([
      { $group: { _id: "$category", n: { $sum: 1 } } },
    ]);
    const countMap = Object.fromEntries(
      counts.map((c) => [String(c._id), c.n]),
    );
    const categories = rawCategories.map((c) => ({
      ...c,
      careerCount: countMap[String(c._id)] || 0,
    }));

    const recommended = await Career.find()
      .sort("-createdAt")
      .limit(6)
      .populate("category", "name color");
    res.json({
      popular,
      categories,
      topSkills,
      progress,
      savedCount,
      recommended,
    });
  } catch (e) {
    next(e);
  }
};
