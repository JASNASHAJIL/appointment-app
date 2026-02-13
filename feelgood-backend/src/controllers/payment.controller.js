const Appointment = require("../models/Appointment");

exports.initiatePayment = async (req, res) => {
  const { appointment_id, payment_method } = req.body || {};

  if (!appointment_id || !payment_method) {
    return res.status(400).json({ status: false, message: "appointment_id and payment_method required" });
  }

  const appt = await Appointment.findById(appointment_id);
  if (!appt) return res.status(404).json({ status: false, message: "Appointment not found" });

  // Dummy success
  appt.status = "CONFIRMED";
  await appt.save();

  res.json({ status: true, message: "Payment success", appointment_id, booking_status: "CONFIRMED" });
};
