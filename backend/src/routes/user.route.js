import express from "express";
import UserController from "../controllers/user.controller.js";
import {refreshTokenMiddleware} from "../middleware/refresh.token.middleware.js";
import {authAdminMiddleware, authUserMiddleware} from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

const user = express.Router();
const userController = new UserController();

user.post('/register', userController.registerNewUser);
user.post('/email-verification', userController.verifyUserEmail);
user.post('/login', userController.login);
user.post('/resend-token', userController.getNewTokenVerify);
user.get('/refresh-token', refreshTokenMiddleware, userController.refreshToken);
user.delete('/logout', authUserMiddleware, userController.logout);
user.get('/me', authUserMiddleware, userController.getUser);
user.get('', authAdminMiddleware, userController.getUsers);
user.put('/update', authUserMiddleware, upload, userController.updateUser);

export default user;