const router = require("express").Router();
const auth = require("../middleware/auth");

const {
  getAllSpecialists,
  createSpecialist
} = require("../controllers/specialist.controller");

// GET list
router.get("/", auth, getAllSpecialists);

// ✅ POST create
router.post("/", auth, createSpecialist);

module.exports = router;
