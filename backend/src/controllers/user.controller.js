import UserRepository from "../repositories/user.repository.js";
import {logger} from "../utils/logger.js";
import {userSchema} from "../utils/validator.js";
import bcrypt from 'bcrypt';

class UserController {
    constructor() {
        this.userRepo = new UserRepository();
    }

    registerNewUser = async (req, res) => {
        try {
            const userData = req.body;
            const {value, error} = userSchema.validate(userData, {abortEarly: false});
            if (error) {
                logger.error("Gagal mendaftarkan user: ", error);
                return res.status(400).json({
                    "message": "Pendaftaran tidak berhasil!",
                    "data": error.details.map(err => err.message.replace(/"/g, ''))
                });
            }

            value.password = await bcrypt.hash(value.password, 10);
            const newUser = await this.userRepo.addUser(value);
            return res.status(200).json({
                "message": "Pendaftan berhasil!",
                "data": newUser
            });
        } catch (err) {
            logger.error("Gagal mendaftarkan user:", err);

            if (err.code === "P2002") {
                return res.status(500).json({
                    "message": "Pendaftaran tidak berhasil!",
                    "data": "Alamat email sudah digunakan!",
                });
            };

            return res.status(500).json({
                "message": "Pendaftaran tidak berhasil!",
                "data": "Terjadi kesalahan pada server"
            });
        }
    }

}

export default UserController;