import app from './app.js';
import {log} from "console";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
// import processMultipart from 'express-fileupload/lib/processMultipart.js';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
});

const port = 4000;
app.listen(port,()=>{
log(`App is listening on ${port}`);
})