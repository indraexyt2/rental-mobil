import {ResponseError} from "../error/response.error.js";

const errorMiddleware = async (err, req, res, next) => {
    if (!err) {
        next();
        return;
    }

    if (err instanceof ResponseError) {
        return res.status(err.status).json({
            "errors": err.message
        });
    } else {
        return res.status(500).json({
            errors: err.message
        }).end();
    }
}

export {
    errorMiddleware
}