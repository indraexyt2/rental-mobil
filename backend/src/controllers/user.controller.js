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
            const result = await this.userService.verifyUserEmail(req.body);

            res.cookie("token", result.token, {
                httpOnly: true,
                path: "/",
                expires: new Date(Date.now() + 60 * 60 * 1000),
                sameSite: "strict"
            });

            return res.status(200).json({
                "message": "Berhasil!",
                "data": result
            });
        } catch (e) {
            logger.error("Gagal memverifikasi user:", e);
            next(e);
        }
    }


    login = async (req, res, next) => {
        try {
            const result = await this.userService.login(req.body);

            res.cookie("token", result.token, {
                httpOnly: true,
                path: "/",
                expires: new Date(Date.now() + 60 * 60 * 1000),
                sameSite: "strict"
            });

            if (result.refreshToken) {
                res.cookie("refresh_token", result.refreshToken, {
                    httpOnly: true,
                    path: "/",
                    sameSite: "strict"
                });
            }

            return res.status(200).json({
                "message": "Berhasil!",
                "data": result
            });
        } catch (e) {
            logger.error("Gagal memverifikasi user:", e);
            next(e);
        }
    }

    getNewTokenVerify = async (req, res, next) => {
        try {
            await this.userService.resendTokenVerify(req);
            return res.status(200).json({
                "message": "Berhasil!"
            })
        } catch (e) {
            logger.error("Gagal mendapatkan token baru!")
            next(e);
        }
    }

    refreshToken = async (req, res, next) => {
       try {
           const token = await this.userService.refreshToken(req);
           res.cookie("token", token, {
               httpOnly: true,
               path: "/",
               expires: new Date(Date.now() + 60 * 60 * 1000),
               sameSite: "strict"
           });

           return res.status(200).json({
               "message": "Berhasil!",
               "data": {
                   "token": token
               }
           });
       } catch (e) {
           logger.error("Refresh token gagal:", e)
           next(e);
       }
    }

    logout = async (req, res, next) => {
        try {
            await this.userService.logout(req);
            res.clearCookie("token");
            res.clearCookie("refresh_token");
            return res.status(200).json({
                "message": "Logout berhasil!"
            })
        } catch (e) {
            logger.error("Gagal logout:", err);
            next(e);
        }
    }

    getUser = async (req, res, next) => {
        try {
            const result = await this.userService.getUser(req);
            return res.status(200).json({
                "message": "Berhasil!",
                "data": result
            });
        } catch (e) {
            logger.error("Gagal mendapatkan user info:", e);
            next(e);
        }
    }

    getUsers = async (req, res, next) => {
        try {
            const result = await this.userService.getUsers(req);
            return res.status(200).json({
                "message": "Berhasil!",
                "data": result
            });
        } catch (e) {
            logger.error("Gagal mendapatkan user info:", e);
            next(e);
        }
    }

    updateUser = async (req, res, next) => {
        try {
            const result = await this.userService.updateUser(req);
            return res.status(200).json({
                "message": "Berhasil!"
            });
        } catch (e) {
            logger.error("Gagal update data user:", e)
            next(e);
        }
    }
}

export default UserController;