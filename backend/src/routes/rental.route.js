import express from "express";
import RentalController from "../controllers/rental.controller.js";
import {authAdminMiddleware, authUserMiddleware} from "../middleware/auth.middleware.js";

const rental = express.Router();
const rentalController = new RentalController();

rental.post('', authUserMiddleware, rentalController.addNewRent);
rental.get('/all', authAdminMiddleware, rentalController.getRents);
rental.get('/me', authUserMiddleware, rentalController.getRentDetailByUserId);
rental.get('/detail/:id', authUserMiddleware, rentalController.getRentDetail);
rental.put('/:id', authUserMiddleware, rentalController.updateRent);
rental.patch('/:id', authAdminMiddleware, rentalController.updateRentStatus);
rental.get('/:id/booked-dates', rentalController.getRentsDates);

export default rental;

