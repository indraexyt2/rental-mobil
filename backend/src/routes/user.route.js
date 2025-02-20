import express from "express";
import UserController from "../controllers/user.controller.js";

const user = express.Router();
const userController = new UserController();

user.post('/api/auth/register', userController.registerNewUser);

export default user;