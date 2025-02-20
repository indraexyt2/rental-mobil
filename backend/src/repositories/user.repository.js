import {prismaClient} from "../config/database.config.js";
import {logger} from "../utils/logger.js";
import {ResponseError} from "../error/response.error.js";

class UserRepository {
    constructor(dbClient = prismaClient) {
        this.db = dbClient;
    };

    async addUser(userData) {
        try {
            return await this.db.user.create({
                data: userData,
                select: {
                    id: true,
                    full_name: true,
                    email: true,
                    password: false,
                    phone: true,
                    address: true,
                    avatar: true,
                    role: true,
                    token: true
                }
            });
        } catch (err) {
            if (err.code === "P2002") {
                throw new ResponseError(400, "Alamat email sudah digunakan!");
            }
            throw err;
        }
    };
}

export default UserRepository;