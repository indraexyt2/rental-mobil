import {ResponseError} from "../error/response.error.js";
import multer from "multer";

const errorMiddleware = async (err, req, res, next) => {
    if (!err) {
        next();
        return;
    }

    if (err instanceof ResponseError) {
        return res.status(err.status).json({
            "errors": err.message
        });
    } else if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                "errors": "Maksimal ukuran 5 mb!"
            });
        } else {
            return res.status(400).json({
                "errors": err.message
            });
        }
    } else {
        return res.status(500).json({
            errors: err.message
        }).end();
    }
}

export {
    errorMiddleware
}