import {ResponseError} from "../error/response.error.js";
import jwt from "jsonwebtoken";

export const refreshTokenMiddleware = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        throw new ResponseError(401, "Unauthorized")
    }

    const claimsToken = jwt.decode(token);
    if (!claimsToken) {
        throw new ResponseError(401, "Unauthorized")
    }

    req.claimsToken = claimsToken;

    next()
}