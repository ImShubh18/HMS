import app from './app.js';
import {log} from "console";
import cloudinary from "cloudinary";
import processMultipart from 'express-fileupload/lib/processMultipart.js';

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
});

const port = 4000;
app.listen(port,()=>{
log(`App is listening on ${port}`);
})