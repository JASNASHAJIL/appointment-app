const Specialist = require("../models/Specialist");

// GET all
exports.getAllSpecialists = async (req, res) => {
  try {
    const list = await Specialist.find().sort({ name: 1 });
    res.json({ status: true, specialists: list });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// ✅ CREATE specialist
exports.createSpecialist = async (req, res) => {
  try {
    const { name, icon } = req.body || {};

    if (!name) {
      return res.status(400).json({
        status: false,
        message: "name is required"
      });
    }

    const sp = await Specialist.create({
      name,
      icon: icon || ""
    });

    res.json({
      status: true,
      message: "Specialist created",
      specialist: sp
    });

  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
