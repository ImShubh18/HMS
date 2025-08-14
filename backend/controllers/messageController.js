import { Message } from "../models/messageSchema.js";

export const sendMessage = async (req, res, next) => {
    console.log(req.body);
    try {
        const { firstName, lastName, email, phoneNumber, message } = req.body;

        if (!firstName || !lastName || !email || !phoneNumber || !message) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the details!",
            });
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
};
