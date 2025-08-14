import mongoose from "mongoose";

export const connectDB =  async ()=>{
    await mongoose.connect(process.env.MONGO_URI,{
        dbName : "MERN_HMS"
    }).then(()=>{
        console.log("Connected to database successfully!!");
    }).catch((err)=>{
        console.log("Failed to connect to database ",err);
    })
}