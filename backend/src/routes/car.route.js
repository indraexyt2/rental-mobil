import express from "express";
import CarController from "../controllers/car.controller.js";
import {authAdminMiddleware} from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

const car = express.Router();
const carController = new CarController();

car.post('', authAdminMiddleware, upload, carController.addNewCar);
car.get('', carController.getCars);
car.get('/:id', carController.getCar);
car.put('/:id', authAdminMiddleware, upload, carController.updateCar);
car.delete('/:id', authAdminMiddleware, carController.deleteCar);

car.post('/category', authAdminMiddleware, carController.addCategory);
car.put('/category/:id', authAdminMiddleware, carController.updateCategory);
car.delete('/category/:id', authAdminMiddleware, carController.delCategory);
car.get('/category/all', carController.getCategories);
car.get('/category/:id', carController.getCategory);

car.post('/feature', authAdminMiddleware, carController.addFeature);
car.put('/feature/:id', authAdminMiddleware, carController.updateFeature);
car.delete('/feature/:id', authAdminMiddleware, carController.delFeature);
car.get('/feature/all', carController.getFeatures);
car.get('/feature/:id', carController.getFeature);

export default car;