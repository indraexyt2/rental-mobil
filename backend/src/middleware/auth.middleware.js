import {validateToken} from "../utils/jwt.js";
import {ResponseError} from "../error/response.error.js";

const authUserMiddleware = async (req, res, next) => {
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

export default authUserMiddleware;
