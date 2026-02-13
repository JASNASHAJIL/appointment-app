const router = require("express").Router();
const auth = require("../middleware/auth");

const { createDoctor, getDoctors, getDoctorById } = require("../controllers/doctor.controller");
const { createSlotsForDoctor, getSlotsByDoctorAndDate } = require("../controllers/slot.controller");

// Doctors
router.post("/", auth, createDoctor);
router.get("/", auth, getDoctors);
router.get("/:id", auth, getDoctorById);

// Slots for a doctor
router.post("/:id/slots", auth, createSlotsForDoctor);
router.get("/:id/slots", auth, getSlotsByDoctorAndDate);

module.exports = router;
