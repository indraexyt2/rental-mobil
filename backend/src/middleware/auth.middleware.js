import {validateToken} from "../utils/jwt.js";
import {ResponseError} from "../error/response.error.js";

export const authUserMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return next(new ResponseError(401, "Unauthorized"));
        }

        req.claimsToken = await validateToken(token);
        next();
    } catch (err) {
        next(err);
    }
}

export const authAdminMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return next(new ResponseError(401, "Unauthorized"));
        }

        const claimsToken = await validateToken(token);
        if (claimsToken.role !== "ADMIN") {
            return next(new ResponseError(401, "Unauthorized"));
        }

        console.log(claimsToken)

        req.claimsToken = claimsToken;
        next();
    } catch (err) {
        next(err);
    }
}
