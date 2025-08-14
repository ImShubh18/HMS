import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
    firstName: {
        type : String,
        required : true,
        minLength : [3,"FirstName must have at 3 characters"]
    },
    lastName: {
        type : String,
        required : true,
        minLength : [3,"Last Name must have atleast 3 characters"]
    },
    email : {
        type : String,
        required : true,
        validate : [validator.isEmail,"Please enter a valid email address"]
    },
    phoneNumber: {
        type : String,
        required : true,
        minLength : [10,"Phone number must have atleast  10 digits"],
        maxLength : [10,"Phone number must have atleast  10 digits"]
    },
    message : {
        type : String,
        required : true,
        minLength : [10,"Message must contain atleast 10 characters"]
    }
},{timestamps : true}) // <-- timestamps is a key, value is true

export const Message = mongoose.model("Message",messageSchema);