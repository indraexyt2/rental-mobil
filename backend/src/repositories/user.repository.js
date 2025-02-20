import {prismaClient} from "../config/database.config.js";
import {logger} from "../utils/logger.js";



class UserRepository {
    constructor(dbClient = prismaClient) {
        this.db = dbClient;
    }

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
            logger.error("failed to insert new user: ", err);
            throw err;
        }
    }
}

export default UserRepository;