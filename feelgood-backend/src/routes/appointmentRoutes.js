const router = require("express").Router();
const auth = require("../middleware/auth");
const { createAppointment, getAppointment } = require("../controllers/appointment.controller");
const { getAppointmentPDF } = require("../controllers/pdf.controller");

router.post("/create", auth, createAppointment);
router.get("/:id", auth, getAppointment);
router.get("/:id/pdf", auth, getAppointmentPDF);

module.exports = router;
