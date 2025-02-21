import {prismaClient} from "../config/database.config.js";
import {ResponseError} from "../error/response.error.js";
import {redisClient} from "../config/redis.config.js";
import {logger} from "../utils/logger.js";

class UserRepository {
    constructor(dbClient = prismaClient) {
        this.db = dbClient;
        this.rdb = redisClient;
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
                    token: true,
                    token_expired: true
                }
            });
        } catch (err) {
            if (err.code === "P2002") {
                throw new ResponseError(400, "Alamat email sudah digunakan!");
            }
            throw err;
        }
    };

    async getUserByTokenVerify(token) {
       try {
           return await this.db.user.findFirst({
               where: {
                   token: token
               },
               select: {
                   id: true,
                   token_expired: true,
               }
           });
       } catch (err) {
           throw err;
       }
    };

    async updateIsVerifiedUser(userId) {
        try {
            return await this.db.user.update({
                where: {
                    id: userId
                },
                data: {
                    is_verified: true,
                    token: null,
                    token_expired: null
                },
                select: {
                    id: true,
                    email: true,
                    full_name: true
                }
            });
        } catch (err) {
            throw err;
        }
    };

    async getUserByEmail(userEmail) {
        try {
            return await this.db.user.findUnique({
                where: {
                    email: userEmail
                },
                select: {
                    id: true,
                    password: true
                }
            })
        } catch (err) {
            throw err;
        }
    }

    async getUserById(userId) {
        try {
            let user = await this.rdb.get(`user:info:${userId}`);
            if (user) {
                logger.info("Berhasil mendapatkan data user dari redis!")
                user = JSON.parse(user);
                return user;
            }

            user = await this.db.user.findUnique({
                where: {
                    id: parseInt(userId)
                },
                select: {
                    id: true,
                    email: true,
                    full_name: true,
                    address: true,
                    phone: true,
                    avatar: true,
                    role: true,
                    rentals: true
                },
            })

            const ok = await this.rdb.set(`user:info:${userId}`, JSON.stringify(user), {EX: 60 * 60 * 24});
            if (ok !== "OK") {
                logger.warn("Gagal menyimpan data user ke redis!")
            }
            logger.info("Berhasil menyimpan data user ke redis!")

            return user;
        } catch (err) {
            throw err;
        }
    }

    async getUsers() {
        try {
            return await this.db.user.findMany({
                select: {
                    id: true,
                    email: true,
                    full_name: true,
                    address: true,
                    phone: true,
                    avatar: true,
                    role: true
                }
            })
        } catch (err) {
            throw err;
        }
    }
}

export default UserRepository;