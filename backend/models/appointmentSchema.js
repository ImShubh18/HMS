import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: [3, "First Name must atleast 3 characters"],
  },
  lastName: {
    type: String,
    required: true,
    minLength: [3, "Last Name must have atleast 3 characters"],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  phoneNumber: {
    type: String,
    required: true,
    minLength: [10, "Phone Number must have atleast 10 digits!!"],
    maxLength: [11, "Phone Number must not be greater than 11 digits!!"],
  },
  nic: {
    type: String,
    required: true,
    minLength: [10, "NIC must contains 10 digits!!"],
    maxLength: [10, "NIC should not be greater than 10 exact 10!!"],
  },
  dob: {
    type: Date,
    required: [true, "DOB is required"],
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },
  appointment_date: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  doctor: {
    firstName: {
      type: String,
      required: true,
      minLength: [3, "First Name must atleast 3 characters"],
    },
    lastName: {
      type: String,
      required: true,
      minLength: [3, "Last Name must have atleast 3 characters"],
    },
  },
  hasVisited: {
    type: Boolean,
    default : false
  },
  doctorId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  patientId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
  },
});

export const Appointment = mongoose.model("Appointment", appointmentSchema);
