import {logger} from "../utils/logger.js";
import UserService from "../service/user.service.js";

class UserController {
    constructor() {
        this.userService = new UserService();
    }
    registerNewUser = async (req, res, next) => {
        try {
           const result = await this.userService.registerNewUser(req.body);
            return res.status(200).json({
               "message": "Pendaftaran berhasil!",
               "data": result
           });
        } catch (e) {
            logger.error("Gagal mendaftarkan user:", e);
            next(e);
        }
    }

    verifyUserEmail = async (req, res, next) => {
        try {
            const token = await this.userService.verifyUserEmail(req.body);

            res.cookie("token", token, {
                httpOnly: true,
                path: "/",
                expires: new Date(Date.now() + 60 * 60 * 1000),
                sameSite: true
            });

            return res.status(200).json({
                "message": "Berhasil!"
            });
        } catch (e) {
            logger.error("Gagal memverifikasi user:", err);
            next(e);
        }
    }

}

export default UserController;