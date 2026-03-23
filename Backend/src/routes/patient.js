const express = require("express");
const {
  handlePatientRegister,
  handleUpdatePatientProfile,
  bookAppointment,
  handleGetProfile,
  rescheduleAppointment,
  handlePatientLogout,
  getPatientAppointments,
  cancelAppointment
} = require("../controllers/patient");

const { getPatientMedicalHistory } = require("../controllers/medicalHistorycontroller");

const { restrictToLoggedInUserOnly, restrictToRoles } = require("../middlewares/auth");

const router = express.Router();


router.post("/register", handlePatientRegister);

router.use(restrictToLoggedInUserOnly);
router.use(restrictToRoles(["PATIENT"]));

// PROTECTED PATIENT ROUTES
router.patch("/update/:email", handleUpdatePatientProfile);
router.post("/book-appointment", bookAppointment);
router.patch("/appointment/:appointmentID", rescheduleAppointment);
router.get("/profile", handleGetProfile);
router.post("/logout", handlePatientLogout);
router.get("/:patientID/appointments", getPatientAppointments);
router.get("/:patientID/medical-history", getPatientMedicalHistory);
router.patch("/appointment/:appointmentID/cancel", cancelAppointment);

module.exports = router;