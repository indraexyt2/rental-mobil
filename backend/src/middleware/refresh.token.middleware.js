import {ResponseError} from "../error/response.error.js";
import jwt from "jsonwebtoken";

export const refreshTokenMiddleware = (req, res, next) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
        throw new ResponseError(401, "Unauthorized")
    }

    const claimsToken = jwt.decode(refreshToken);
    if (!claimsToken) {
        throw new ResponseError(401, "Unauthorized")
    }

    req.claimsToken = claimsToken;

    next()
}