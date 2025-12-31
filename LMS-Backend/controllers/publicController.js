const Course = require("../models/Course");
const User = require("../models/User");

exports.getHomeStats = async (req, res) => {
  try {
    const students = await User.countDocuments({ role: "student" });
    const courses = await Course.countDocuments({ published: true });
    const instructors = await User.countDocuments({ role: "instructor" });

    res.json({
      students,
      courses,
      instructors,
    });
  } catch (err) {
    console.error("Error fetching home stats:", err);
    res.status(500).json({ message: "Server error fetching stats." });
  }
};
