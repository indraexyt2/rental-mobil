import jwt from 'jsonwebtoken';
import 'dotenv/config';
import {logger} from "./logger.js";
import {ResponseError} from "../error/response.error.js";

const JwtMappingType = {
    token: { expiresIn: '1h'},
    refreshToken: { expiresIn: '7h'}
}

const secretKey = process.env.JWT_SECRET

export const generateToken = (payload, type) => {
    return jwt.sign(payload, secretKey, JwtMappingType[type]);
}

export const validateToken = async (token) => {
    try {
        return jwt.verify(token, secretKey)
    } catch (err) {
        logger.error("Validasi token gagal:", err)
        throw new ResponseError(401, "Unauthorized")
    }
}