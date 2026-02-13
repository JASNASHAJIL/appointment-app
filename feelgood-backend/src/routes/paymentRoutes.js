const router = require("express").Router();
const auth = require("../middleware/auth");
const { initiatePayment } = require("../controllers/payment.controller");

router.post("/initiate", auth, initiatePayment);

module.exports = router;
