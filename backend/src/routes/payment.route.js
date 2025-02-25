import express from "express";
import PaymentController from "../controllers/payment.controller.js";
import {authAdminMiddleware, authUserMiddleware} from "../middleware/auth.middleware.js";

const payment = express.Router();
const paymentController = new PaymentController();

payment.get('/all', authAdminMiddleware, paymentController.getPaymentsAdmin);
payment.get('/:id', authUserMiddleware, paymentController.getPaymentByPaymentId);
payment.get('', authUserMiddleware, paymentController.getPayments);

payment.post('/notification/midtrans', paymentController.handleMidtransNotification);

export default payment;