import {userSchema} from "../utils/validator.js";
import {ResponseError} from "../error/response.error.js";
import bcrypt from "bcrypt";
import UserRepository from "../repositories/user.repository.js";

class UserService {
    constructor() {
        this.userRepo = new UserRepository();
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
}

export default UserService;