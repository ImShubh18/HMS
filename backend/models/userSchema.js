import bcrypt from "bcrypt";
import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
    firstName :{
        type : String,
        required : true,
        minLength : [3,"First Name must atleast 3 characters"]
    },
    lastName : {
        type: String,
        required : true,
        minLength : [3,"Last Name must have atleast 3 characters"]
    },
    email : {
        type : String,
        required : true,
        validate : [validator.isEmail,"Please enter a valid email"]
    },
    phoneNumber : {
        type : String,
        required : true,
        minLength : [10, "Phone Number must have atleast 10 digits!!"],
        maxLength : [11, "Phone Number must not be greater than 11 digits!!"]
    },
    nic : {
        type : String,
        required : true,
        minLength : [10,"NIC must contains 10 digits!!"],
        maxLength : [10, "NIC should not be greater than 10 exact 10!!"]
    },
    dob : {
        type : Date,
        required : [true,"DOB is required"]
    },
    gender : {
        type : String,
        required : true,
        enum : ["Male","Female","Other"]
    },
    password : {
        type : String,
        required : true,
        select : false,
        minLength : [8,"Password must contain 8 alphanumberic characters"]
    },
    role : {
        type : String,
        required: true,
        enum : ["Patient", "Doctor", "Admin"]
    },
    doctorDepartment : {
        type : String
    },
    docAvatar : {
        public_id : String,
        url : String
    }
})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

//to check the enter password is correct or not

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
} 

userSchema.methods.generateJWT = function(){
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    });
}

export const User = mongoose.model("User",userSchema);