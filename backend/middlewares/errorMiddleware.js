class ErrorHandler  extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode;
    }
}

 export const errorMiddleware = (err,req,res,next)=>{
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    if(err.code === 11000){
        const message = `Message ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message,400);
    }
    // 11000 this code is generated when we try to add the email or data that already exists in the database
    if(err.name ===  "JsonWebTokenErr"){
        const message = "Json Web Token is invalid, Try Again!!";
        err = new ErrorHandler(message,400);
    }

    if(err.name ===  "TokenExpiredError"){
        const message = "Json Web Token is expired, Try Again!!";
        err = new ErrorHandler(message,400);
    }

    if(err.name ===  "CastError"){
        const message = `Invalid ${err.path}`;
        err = new ErrorHandler(message,400);
    }

    const errorMessage = err.errors
    ? Object.values(err.errors).map((error) => error.message).join(" ")
    : err.message;

    return res.status(err.statusCode).json({
        success : false,
        message : errorMessage, 
    }); 
 }

export default ErrorHandler;