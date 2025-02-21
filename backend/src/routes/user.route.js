import express from "express";
import UserController from "../controllers/user.controller.js";
import {refreshTokenMiddleware} from "../middleware/refresh.token.middleware.js";
import {authAdminMiddleware, authUserMiddleware} from "../middleware/auth.middleware.js";

const user = express.Router();
const userController = new UserController();

user.post('/register', userController.registerNewUser);
user.post('/email-verification', userController.verifyUserEmail);
user.post('/login', userController.login);
user.get('/refresh-token', refreshTokenMiddleware, userController.refreshToken);
user.delete('/logout', authUserMiddleware, userController.logout);
user.get('/:id', authUserMiddleware, userController.getUser);
user.get('', authAdminMiddleware, userController.getUsers);

export default user;