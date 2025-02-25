import PaymentService from "../service/payment.service.js";
import { logger } from "../utils/logger.js";

class PaymentController {
    constructor() {
        this.paymentService = new PaymentService();
    }

    getPaymentByPaymentId = async (req, res, next) => {
        try {
            const rentalId = req.params.id;
            const result = await this.paymentService.getPaymentByPaymentId(rentalId);
            return res.status(200).json({
                "message": "Berhasil!",
                "data": result
            });
        } catch (error) {
            logger.error("Gagal mendapatkan data pembayaran:", error);
            next(error);
        }
    }

    getPayments = async (req, res, next) => {
        try {
            const userId = req.claimsToken.id;
            const result = await this.paymentService.getPayments(userId);
            return res.status(200).json({
                "message": "Berhasil!",
                "data": result
            });
        } catch (e) {
            logger.error("Gagal mendapatkan semua data pembayaran:", e);
            next(e);
        }
    }

    getPaymentsAdmin = async (req, res, next) => {
        try {
            const {payments, totalData, totalPage} = await this.paymentService.getPaymentsAdmin(req);
            return res.status(200).json({
                "message": "Berhasil!",
                "data": {
                    "pagination": {
                        "page": parseInt(req.query.page) || 1,
                        "limit": parseInt(req.query.limit) || 10,
                        "total_data": totalData,
                        "total_page": totalPage
                    },
                    payments
                }
            })
        } catch (e) {
            logger.error("Gagal mendapatkan semua data payment:", e);
            next(e);
        }
    }

    handleMidtransNotification = async (req, res, next) => {
        try {
            const notification = req.body;
            await this.paymentService.handleMidtransNotification(notification);
            return res.status(200).json({ status: "OK" });
        } catch (error) {
            logger.error("Gagal memproses notifikasi Midtrans:", error);
            next(error);
        }
    }
}

export default PaymentController;