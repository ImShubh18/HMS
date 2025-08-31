import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

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
  generateToken(user, "User Registered Successfully!!", 201, res);
  // res.status(201).json({
  //   success: true,
  //   message: "User Registered Successfully!!",
  // });
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, confirmPassword, role } = req.body;
  if (!email || !password || !confirmPassword || !role) {
    return next(new ErrorHandler("Please provide all details", 400));
  }
  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Confirm Password and Password should be same!!", 400)
    );
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password!!", 400));
  }
  const passwordMatched = await user.comparePassword(password);
  if (!passwordMatched) {
    return next(new ErrorHandler("Password doesn't matched!!", 400));
  }
  if (role !== user.role) {
    return next(new ErrorHandler("User with role not found!!", 400));
  }
  // res.status(200).json({
  //   success : true,
  //   message : "User Logged In Successfully!!"
  // })
  generateToken(user, "User Login Successfully!!", 200, res);
});

// adding new admin
export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
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
    !password
  ) {
    return next(new ErrorHandler("Please Enter Entire Details", 400));
  }

  const userAlreadyRegistered = await User.findOne({ email });
  if (userAlreadyRegistered) {
    return next(
      new ErrorHandler("User with this email already registered!!", 400)
    );
  }
  const admin = await User.create({
    firstName,
    lastName,
    email,
    phoneNumber,
    nic,
    dob,
    gender,
    password,
    role: "Admin",
  });
  // Generate JWT and set cookie
  generateToken(admin, "Admin Registered Successfully!!", 201, res);
});

export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  try {
    const doctors = await User.find({ role: "Doctor" }).select("-password");
    res.status(200).json({
      success: true,
      doctors,
    });
  } catch (error) {
    next(error);
  }
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = req.user;
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
});

export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Admin Logged Out Successfully!!",
    });
});

export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("patientToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Patient Logged Out Successfully!!",
    });
});

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Doctor Avatar required!", 400));
  }

  const { docAvatar } = req.files;

  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler("File format not supported!", 400));
  }

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    nic,
    dob,
    gender,
    password,
    doctorDepartment,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phoneNumber ||
    !nic ||
    !dob ||
    !gender ||
    !password ||
    !doctorDepartment
  ) {
    return next(new ErrorHandler("Please enter entire details!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler(
        `${isRegistered.role} already registered with this email!`,
        400
      )
    );
  }

  // Upload to Cloudinary
  const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath);
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error("Cloudinary Error:", cloudinaryResponse?.error || "Unknown");
    return next(new ErrorHandler("Image upload failed!", 500));
  }

  // Save doctor
  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phoneNumber,
    nic,
    dob,
    gender,
    password,
    doctorDepartment,
    role: "Doctor",
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  res.status(201).json({
    success: true,
    message: "New Doctor Registered!!",
    doctor,
  });
});
