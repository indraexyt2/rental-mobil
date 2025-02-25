import {userSchema, userUpdateSchema} from "../utils/validator.js";
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
        value.token_expired = new Date(Date.now() + 60 * 10 * 1000);
        const user = await this.userRepo.addUser(value);

        // await sendEmailVerification(value.email, value.token);
        return user;
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

        if (user.token_expired.getTime() < Date.now()) {
            throw new ResponseError(400, "Token kadaluarsa!")
        }

        const userData = await this.userRepo.updateIsVerifiedUser(user.id)
        const jwtToken = generateToken(userData, "token");
        const jwtRefreshToken = generateToken(userData, "refreshToken");

        const userSession = {
            token: jwtToken,
            refreshToken: jwtRefreshToken
        }

        await this.userRepo.rdb.set(`user:session:${userData.id}`, JSON.stringify(userSession), {EX: 7 * 60 * 60 * 24})

        // await sendWelcomeEmail(userData.email, userData.full_name);
        return {
            id: userData.id,
            token: jwtToken
        };
    }

    login = async (request) => {
        const {email, password} = request;
        if (email === "" || password === "") {
            throw new ResponseError(400, "Semua kolom wajib diisi!")
        }

        const user = await this.userRepo.getUserByEmail(email);
        if (!user) {
            throw new ResponseError(400, "Alamat email tidak ditemukan!")
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch === false) {
            throw new ResponseError(400, "Kata sandi salah!")
        }

        const userData = await this.userRepo.getUserByIdForJwt(user.id)
        const jwtToken = generateToken(userData, "token");
        const jwtRefreshToken = generateToken(userData, "refreshToken");

        const userSession = {
            token: jwtToken,
            refreshToken: jwtRefreshToken
        }

        await this.userRepo.rdb.set(`user:session:${userData.id}`, JSON.stringify(userSession), {EX: 7 * 60 * 60 * 24})

        return {
            id: userData.id,
            token: jwtToken
        };
    }

    refreshToken = async (request) => {
        const claimsToken = request.claimsToken;
        const userSessionJson = await this.rdb.get(`user:session:${claimsToken.id}`);
        if (!userSessionJson) {
            throw new ResponseError(401, "Unauthorized");
        }

        const userData = await this.userRepo.getUserByIdForJwt(claimsToken.id)
        return generateToken(userData, "token");
    }

    logout = async (request) => {
        const claimsToken = request.claimsToken;
        await this.userRepo.rdb.del(`user:session:${claimsToken.id}`);
    }

    getUser = async (request) => {
        const userId = request.claimsToken.id;
        if (!userId) {
            throw new ResponseError(400, "User id dibutuhkan");
        }

        return await this.userRepo.getUserById(userId);
    }

    getUsers = async () => {
        return await this.userRepo.getUsers();
    }

    updateUser = async (request) => {
        const userData = request.body;
        const {value, error} = userUpdateSchema.validate(userData, {abortEarly: false});
        if (error) {
            throw new ResponseError(400, error.details.map(err => err.message.replace(/"/g, '')));
        }

        const claimsToken = request.claimsToken;
        value.id = claimsToken.id;

        const files = request.files;
        if (files.avatar) {
            value.avatar = files.avatar[0].path;
        }

        if (files.sim_image) {
            value.sim_image = files.sim_image[0].path;
        }

        console.log(value);
        console.log(value.sim_image)
        return await this.userRepo.updateUser(value);
    }
}

export default UserService;