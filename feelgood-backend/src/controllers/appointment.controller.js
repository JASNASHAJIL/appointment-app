const Appointment = require("../models/Appointment");
const Slot = require("../models/Slot");
const Doctor = require("../models/Doctor");

exports.createAppointment = async (req, res) => {
  try {
    const { doctor_id, slot_id, patient_name, age, gender, problem } = req.body || {};

    if (!doctor_id || !slot_id || !patient_name || !age || !gender) {
      return res.status(400).json({ status: false, message: "Missing fields" });
    }

    // 1) Book slot atomically (no transaction)
    const bookedSlot = await Slot.findOneAndUpdate(
      { _id: slot_id, doctorId: doctor_id, isBooked: false },
      { $set: { isBooked: true } },
      { new: true }
    );

    if (!bookedSlot) {
      return res.status(400).json({ status: false, message: "Slot already booked / invalid slot" });
    }

    // 2) Get doctor fee
    const doctor = await Doctor.findById(doctor_id);
    if (!doctor) {
      // rollback slot booking if doctor missing
      await Slot.updateOne({ _id: slot_id }, { $set: { isBooked: false } });
      return res.status(404).json({ status: false, message: "Doctor not found" });
    }

    // 3) Create appointment
    const appt = await Appointment.create({
      userId: req.user.id,
      doctorId: doctor_id,
      slotId: slot_id,
      patientName: patient_name,
      age,
      gender,
      problem: problem || "",
      amount: doctor.consultationFee,
      status: "PENDING_PAYMENT"
    });

    return res.json({
      status: true,
      appointment_id: appt._id,
      amount: doctor.consultationFee
    });
  } catch (err) {
    // best-effort rollback if appointment create failed after slot booked
    if (req.body?.slot_id) {
      await Slot.updateOne({ _id: req.body.slot_id }, { $set: { isBooked: false } }).catch(() => {});
    }
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id)
      .populate("doctorId", "name consultationFee about")
      .populate("slotId", "date time");

    if (!appt) {
      return res.status(404).json({ status: false, message: "Appointment not found" });
    }

    res.json({ status: true, appointment: appt });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
