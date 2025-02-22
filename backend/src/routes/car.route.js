import express from "express";
import CarController from "../controllers/car.controller.js";
import {authAdminMiddleware} from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

const car = express.Router();
const carController = new CarController();

car.post('', authAdminMiddleware, upload, carController.addNewCar);
car.get('', carController.getCars);
car.get('/:id', carController.getCar);

export default car;