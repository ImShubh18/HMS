import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  console.log(req.body); // should print all fields

  // Destructure all required fields from req.body
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    nic,
    dob,
    gender,
    password,
    role,
  } = req.body;

  // Check for missing fields
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phoneNumber ||
    !nic ||
    !dob ||
    !gender ||
    !password ||
    !role
  ) {
    return next(new ErrorHandler("Please Enter Entire Details", 400));
  }

  // Check if user already exists
  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("User Already Registered", 400));
  }

  // Create new user
  user = await User.create({
    firstName,
    lastName,
    email,
    phoneNumber,
    nic,
    dob,
    gender,
    password,
    role,
  });

  res.status(201).json({
    success: true,
    message: "User Registered Successfully!!",
  });
});
