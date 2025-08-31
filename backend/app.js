import express from "express";
import {config} from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload"
import { connectDB } from "./database/dbConnect.js";
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
config({path: ".env"})

const app = express();
app.use(
    cors({
        origin : [process.env.FRONTEND_URL,process.env.DASHBOARD_URL],
        methods : ["GET","POST","PUT","DELETE"],
        credentials : true
    })
);
//to use cookies 
app.use(cookieParser());

//to use json data 
app.use(express.json());

app.use(express.urlencoded({extended : true}));

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : "/tmp"
})
)

app.use("/api/v1/message",messageRouter);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/appointment",appointmentRouter);
connectDB();

app.use(errorMiddleware);
export default app;
