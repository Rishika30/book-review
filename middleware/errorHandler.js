import CustomErrorHandler from "../utils/customErrorHandler.js";

const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let errData = {
        message: "Internal Server Error",
    }

    if(err instanceof CustomErrorHandler) {
        statusCode = err.status;
        errData = {
            message: err.message
        }
    }

    return res.status(statusCode).json(errData);
}

export default errorHandler;