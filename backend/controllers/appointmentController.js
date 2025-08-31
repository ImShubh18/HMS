import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctorFirstName,
    doctorLastName,
    hasVisited,
    address,
  } = req.body;

  // Validate required fields
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phoneNumber ||
    !nic ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    !doctorFirstName ||
    !doctorLastName ||
    hasVisited === undefined || // ✅ handle boolean properly
    !address
  ) {
    return next(new ErrorHandler("Please provide complete details", 400));
  }

  // Find matching doctor
  const doctors = await User.find({
    firstName: doctorFirstName,
    lastName: doctorLastName,
    role: "Doctor",
    doctorDepartment: department,
  });

  if (doctors.length === 0) {
    return next(new ErrorHandler("Doctor not found", 404));
  }
  if (doctors.length > 1) {
    return next(
      new ErrorHandler(
        "Doctor Conflict! Please contact through Email or Phone",
        409 // conflict
      )
    );
  }

  const doctorId = doctors[0]._id;
  const patientId = req.user._id; // make sure req.user is set from auth middleware

  await Appointment.create({
    firstName,
    lastName,
    email,
    phoneNumber,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      firstName: doctorFirstName,
      lastName: doctorLastName,
    },
    hasVisited,
    address,
    doctorId,
    patientId,
  });

  return res.status(201).json({
    success: true,
    message: "Appointment Created Successfully!!",
  });
});

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  const appointment = await Appointment.find();
  res.status(200).json({
    success: true,
    appointment,
  });
});

export const updateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    let appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(new ErrorHandler("Appointment not found", 404));
    }
    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      // useFindandModify: false,
    });
    res.status(200).json({
      success: true,
      message: "Appointment updated successfully!!",
      appointment,
    });
  }
);

export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment not found", 404));
  }
  await appointment.deleteOne();
  res.status(200).json({
    success: true,
    message: "Appointment deleted",
  });
});
