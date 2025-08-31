import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Message } from "../models/messageSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
export const sendMessage = catchAsyncErrors(async (req, res, next) => {
  console.log(req.body);
  try {
    const { firstName, lastName, email, phoneNumber, message } = req.body;

    if (!firstName || !lastName || !email || !phoneNumber || !message) {
      // return res.status(400).json({
      //     success: false,
      //     message: "Please enter all the details!",
      // });
      return next(new ErrorHandler("Please Fill Complete Details", 400));
    }

    await Message.create({ firstName, lastName, email, phoneNumber, message });

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Error sending message:", error.message);
    next(error);
  }
});

export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
  const message = await Message.find();
  res.status(200).json({
    success: true,
    message,
  });
});
