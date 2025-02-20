import {userSchema} from "../utils/validator.js";
import {ResponseError} from "../error/response.error.js";
import bcrypt from "bcrypt";
import UserRepository from "../repositories/user.repository.js";
import {generateToken} from "../utils/jwt.js";
import {redisClient} from "../config/redis.config.js";

class UserService {
    constructor() {
        this.userRepo = new UserRepository();
        this.rdb = redisClient;
    }

    registerNewUser = async (request) => {
        const {value, error} = userSchema.validate(request, {abortEarly: false});
        if (error) {
            throw new ResponseError(400, error.details.map(err => err.message.replace(/"/g, '')))
        }

        value.password = await bcrypt.hash(value.password, 10);
        value.token = Math.floor(100000 + Math.random() * 900000);
        return await this.userRepo.addUser(value);
    }

    verifyUserEmail = async (request) => {
        const {token} = request;
        if (token === "") {
            throw new ResponseError(400, "Token tidak boleh kosong!")
        }

        const user = await this.userRepo.getUserByTokenVerify(parseInt(token));
        if (!user) {
            throw new ResponseError(400, "Token tidak valid!")
        }

        const userData = await this.userRepo.updateIsVerifiedUser(user.id)
        const jwtToken = generateToken(userData, "token");
        const jwtRefreshToken = generateToken(userData, "refreshToken");

        const userSession = {
            token: jwtToken,
            refreshToken: jwtRefreshToken
        }

        await this.rdb.set(`user:session:${userData.id}`, JSON.stringify(userSession))
        return token;
    }
}

export default UserService;