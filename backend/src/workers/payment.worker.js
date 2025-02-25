import { consumeFromQueue } from "../utils/rabbitmq.js";
import PaymentService from "../service/payment.service.js";
import { logger } from "../utils/logger.js";
import { prismaClient } from "../config/database.config.js";

const paymentService = new PaymentService();

const handleNewRental = async (message) => {
    try {
        const rental_id = message;
        logger.info(`Memproses sewa baru untuk pembayaran: ${rental_id}`);
        await paymentService.createPaymentFromRental(rental_id);
    } catch (error) {
        logger.error(`Terjadi kesalahan saat memproses pembayaran sewa: ${error.message}`);
        throw error;
    }
};

const handleAdditionalRental = async (message) => {
    try {
        logger.info(`Memproses sewa tambahan untuk pembayaran: ${message.id}`);
        await paymentService.createAdditionalPaymentFromRental(message);
    } catch (error) {
        logger.error(`Terjadi kesalahan saat memproses pembayaran sewa tambahan: ${error.message}`);
        throw error;
    }
};

const handleRefundRental = async (message) => {
    try {
        logger.info(`Memproses partial refund untuk pembayaran: ${message.id}`);
        await paymentService.createRefundPaymentFromRental(message);
    } catch (error) {
        logger.error(`Terjadi kesalahan saat memproses partial refund: ${error.message}`);
        throw error;
    }
};

const checkExpiredPayments = async () => {
    try {
        const now = new Date();

        const expiredPayments = await prismaClient.payment.findMany({
            where: {
                status: 'PENDING',
                expiry_time: { lt: now }
            }
        });

        for (const payment of expiredPayments) {
            logger.info(`Memproses pembayaran yang sudah kadaluwarsa: ${payment.id}`);

            await prismaClient.payment.update({
                where: { id: payment.id },
                data: { status: 'EXPIRED' }
            });

            await prismaClient.rental.update({
                where: { id: payment.rental_id },
                data: { status: 'CANCELLED' }
            });

            logger.info(`Pembayaran ${payment.id} ditandai EXPIRED dan sewa ${payment.rental_id} ditandai CANCELLED`);
        }
    } catch (error) {
        logger.error(`Kesalahan saat memeriksa pembayaran yang sudah kedaluwarsa: ${error.message}`);
    }
};

const startWorkers = async () => {
    await consumeFromQueue('new_rental_queue', handleNewRental);
    logger.info('Memulai worker for new_rental_queue');

    await consumeFromQueue('update_rental_queue', handleAdditionalRental);
    logger.info('Memulai worker for update_rental_queue');

    await consumeFromQueue('refund_rental_queue', handleRefundRental);
    logger.info('Memulai worker for refund_rental_queue');

    setInterval(checkExpiredPayments, 60 * 60 * 1000);
    logger.info('Memulai expired payment checker');
};

export { startWorkers };