import {prismaClient} from "../config/database.config.js";
import {redisClient} from "../config/redis.config.js";
import {logger} from "../utils/logger.js";

class PaymentRepository {
    constructor() {
        this.db = prismaClient;
        this.rdb = redisClient;
    }

    async createPayment(paymentData) {
        try {
            const payment = await this.db.payment.create({
                data: paymentData
            });

            logger.info(`Payment created for rental ID: ${payment.rental_id}`);
            return payment;
        } catch (error) {
            logger.error("Failed to create payment:", error);
            throw error;
        }
    }

    async getPaymentByRentalId(rentalId) {
        try {
            const cacheKey = `payment:rental:${rentalId}`;
            const cachedPayment = await this.rdb.get(cacheKey);

            if (cachedPayment) {
                logger.info("Berhasil mendapatkan data pembayaran dari redis!");
                return JSON.parse(cachedPayment);
            }

            const payment = await this.db.payment.findFirst({
                where: {
                    rental_id: parseInt(rentalId),
                    midtrans_order_id: {
                        contains: 'INT'
                    }
                },
                include: {
                    rental: {
                        include: {
                            car: true,
                            user: {
                                select: {
                                    id: true,
                                    email: true,
                                    full_name: true,
                                    phone: true,
                                    password: false
                                }
                            }
                        }
                    }
                }
            });

            if (payment) {
                await this.rdb.set(cacheKey, JSON.stringify(payment), {EX: 60 * 60});
                logger.info("Berhasil menyimpan data payment ke redis!");
            }

            return payment;
        } catch (error) {
            logger.error("Gagal mendapatkan data payment berdasarkan rental id:", error);
            throw error;
        }
    }

    async getPaymentByPaymentId(paymentId) {
        try {
            const cacheKey = `payment:${paymentId}`;
            const cachedPayment = await this.rdb.get(cacheKey);

            if (cachedPayment) {
                logger.info("Berhasil mendapatkan data pembayaran dari redis!");
                return JSON.parse(cachedPayment);
            }

            const payment = await this.db.payment.findUnique({
                where: {
                    id: parseInt(paymentId),
                },
                include: {
                    rental: {
                        include: {
                            car: true,
                            user: {
                                select: {
                                    id: true,
                                    email: true,
                                    full_name: true,
                                    phone: true,
                                    password: false
                                }
                            }
                        }
                    }
                }
            });

            if (payment) {
                await this.rdb.set(cacheKey, JSON.stringify(payment), {EX: 60 * 60});
                logger.info("Berhasil menyimpan data payment ke redis!");
            }

            return payment;
        } catch (error) {
            logger.error("Gagal mendapatkan data pembayaran berdasarkan payment id:", error);
            throw error;
        }
    }

    async getPayments(userId) {
        try {
            const cacheKey = `payment:user:${userId}`;
            const cachedPayment = await this.rdb.get(cacheKey);

            if (cachedPayment) {
                logger.info("Berhasil mendapatkan semua data pembayaran dari redis!");
                return JSON.parse(cachedPayment);
            }

            const payments = await this.db.payment.findMany({
                where: {
                    user_id: parseInt(userId),
                },
                orderBy: {
                    updated_at: "desc"
                }
            });

            if (payments) {
                await this.rdb.set(cacheKey, JSON.stringify(payments), {EX: 60 * 60 * 24});
                logger.info("Berhasil menyimpan data payment ke redis!");
            }

            return payments;
        } catch (error) {
            logger.error("Gagal mendapatkan semua data pembayaran berdasarkan payment id:", error);
            throw error;
        }
    }

    async getPaymentsAdmin(filterData) {
        try {
            return await this.db.$transaction(async (tx) => {
                const payments = await tx.payment.findMany({
                    where: filterData.where,
                    skip: filterData.skip,
                    take: filterData.limit,
                    orderBy: {
                        created_at: "desc"
                    }
                });

                const totalData = await tx.payment.count({
                    where: filterData.where
                });

                return {payments, totalData}
            });
        } catch (e) {
            throw e;
        }
    }

    async updatePaymentStatus(paymentId, status, payment_method = null, paid_at = null) {
        try {
            const updateData = {
                status,
                ...(payment_method && { payment_method }),
                ...(paid_at && { paid_at })
            };

            const payment = await this.db.payment.update({
                where: { id: parseInt(paymentId) },
                data: updateData
            });

            await this.rdb.del(`payment:${payment.id}`);
            await this.rdb.del(`payment:user:${payment.user_id}`);

            return payment;
        } catch (error) {
            logger.error("Failed to update payment status:", error);
            throw error;
        }
    }

    async getPaymentByMidtransOrderId(orderId) {
        try {
            return await this.db.payment.findUnique({
                where: { midtrans_order_id: orderId },
                include: { rental: true }
            });
        } catch (error) {
            logger.error("Failed to get payment by Midtrans order ID:", error);
            throw error;
        }
    }
}

export default PaymentRepository;