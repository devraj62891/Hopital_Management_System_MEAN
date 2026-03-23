const mongoose = require("mongoose");

/*  Doctor Schema  */
const doctorSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true, 
    },
    name: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
    type: String,
    default: 'DOCTOR'
  },
    availability: {
  type: Object,
  default: {}
}

  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
