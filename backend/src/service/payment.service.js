import { ResponseError } from "../error/response.error.js";
import PaymentRepository from "../repositories/payment.repository.js";
import RentalRepository from "../repositories/rental.repository.js";
import { snap } from "../config/midtrans.config.js";
import { logger } from "../utils/logger.js";
import {nanoid} from "nanoid";

class PaymentService {
    constructor() {
        this.paymentRepo = new PaymentRepository();
        this.rentalRepo = new RentalRepository();
    }

    async createPaymentFromRental(rentalId) {
        try {
            const existingPayment = await this.paymentRepo.getPaymentByRentalId(rentalId);
            if (existingPayment) {
                logger.info(`Pembayaran sudah ada untuk ID sewa: ${rentalId}`);
                return existingPayment;
            }

            const rental = await this.rentalRepo.getRentDetail(rentalId);
            if (!rental) {
                throw new ResponseError(404, "Rental tidak ditemukan!");
            }

            const orderId = `INT-RENT-${rental.id}-${nanoid(8)}`;

            const expiryTime = new Date();
            expiryTime.setHours(expiryTime.getHours() + 24);

            const startDate = new Date(rental.start_date);
            const endDate = new Date(rental.end_date);
            const durationDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

            const transactionDetails = {
                transaction_details: {
                    order_id: orderId,
                    gross_amount: rental.total_price
                },
                item_details: [
                    {
                        id: `CAR-${rental.car.id}`,
                        price: rental.car.price_per_day,
                        quantity: durationDays,
                        name: `${rental.car.brand} ${rental.car.model} (${rental.car.year})`
                    }
                ],
                customer_details: {
                    first_name: rental.user.full_name,
                    email: rental.user.email,
                    phone: rental.user.phone || ""
                },
                expiry: {
                    unit: "hour",
                    duration: 24
                },
            };

            if (rental.driver_needed && rental.driver_fee) {
                transactionDetails.item_details.push({
                    id: `DRIVER-${rental.id}`,
                    price: 150000,
                    quantity: rental.driver_fee / 150000,
                    name: "Driver Service"
                });
            }

            const transaction = await snap.createTransaction(transactionDetails);
            const snapToken = transaction.redirect_url;

            const paymentData = {
                user_id: rental.user_id,
                rental_id: parseInt(rentalId),
                amount: rental.total_price,
                midtrans_order_id: orderId,
                snap_token: snapToken,
                status: "PENDING",
                expiry_time: expiryTime
            };

            const payment = await this.paymentRepo.createPayment(paymentData);
            logger.info(`Pembayaran dibuat dengan snap token Midtrans untuk ID sewa: ${rentalId}`);

            return payment;
        } catch (error) {
            logger.error(`Gagal membuat pembayaran untuk ID sewa: ${rentalId}`, error);
            throw error;
        }
    }

    async createAdditionalPaymentFromRental(rentalData) {
        try {
            const existingPayment = await this.paymentRepo.getPaymentByRentalId(rentalData.id);
            if (!existingPayment) {
                logger.info(`Pembayaran untuk ID rental: ${rentalData.id} tidak ada!`);
                throw new ResponseError(404, "Riwayat pembayaran tidak ditemukan!");
            }

            const rental = await this.rentalRepo.getRentDetail(rentalData.id);
            if (!rental) {
                throw new ResponseError(404, "Rental tidak ditemukan!");
            }

            const orderId = `ADD-RENT-${rental.id}-${nanoid(8)}`;

            const expiryTime = new Date();
            expiryTime.setHours(expiryTime.getHours() + 24);

            const transactionDetails = {
                transaction_details: {
                    order_id: orderId,
                    gross_amount: rentalData.additional_cost
                },
                item_details: [
                    {
                        id: `CAR-${rental.car.id}`,
                        price: rental.car.price_per_day,
                        quantity: rentalData.different_day,
                        name: `${rental.car.brand} ${rental.car.model} (${rental.car.year})`
                    }
                ],
                customer_details: {
                    first_name: rental.user.full_name,
                    email: rental.user.email,
                    phone: rental.user.phone || ""
                },
                expiry: {
                    unit: "hour",
                    duration: 24
                },
            };

            if (rental.driver_needed && rental.driver_fee) {
                transactionDetails.item_details.push({
                    id: `DRIVER-${rental.id}`,
                    price: 150000,
                    quantity: rentalData.different_day_driver,
                    name: "Driver Service"
                });
            }

            const transaction = await snap.createTransaction(transactionDetails);
            const snapToken = transaction.redirect_url;

            const paymentData = {
                user_id: rental.user_id,
                payment_type: "ADDITIONAL",
                rental_id: parseInt(rentalData.id),
                amount: rentalData.additional_cost,
                midtrans_order_id: orderId,
                snap_token: snapToken,
                status: "PENDING",
                expiry_time: expiryTime
            };

            const payment = await this.paymentRepo.createPayment(paymentData);
            logger.info(`Pembayaran dibuat dengan snap token Midtrans untuk ID sewa: ${rentalData.id}`);

            return payment;
        } catch (error) {
            logger.error(`Gagal membuat pembayaran untuk ID sewa: ${rentalData.id}`, error);
            throw error;
        }
    }

    async createRefundPaymentFromRental(rentalData) {
        try {
            const existingPayment = await this.paymentRepo.getPaymentByRentalId(rentalData.id);
            if (!existingPayment) {
                logger.info(`Pembayaran untuk ID rental: ${rentalData.id} tidak ada!`);
                throw new ResponseError(404, "Riwayat pembayaran tidak ditemukan!");
            }

            const rental = await this.rentalRepo.getRentDetail(rentalData.id);
            if (!rental) {
                throw new ResponseError(404, "Rental data tidak ditemukan!");
            }

            const orderId = `REF-RENT-${rental.id}-${nanoid(8)}`;

            const paymentData = {
                user_id: rental.user_id,
                payment_type: "REFUND",
                rental_id: parseInt(rentalData.id),
                amount: rentalData.refund_cost,
                midtrans_order_id: orderId,
                status: "PENDING",
                expiry_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            };

            const payment = await this.paymentRepo.createPayment(paymentData);
            logger.info(`Lakukan refund dengan ID rental: ${rentalData.id}!`);

            return payment;
        } catch (error) {
            logger.error(`Gagal membuat pembayaran untuk ID sewa: ${rentalData.id}`, error);
            throw error;
        }
    }

    async getPaymentByPaymentId(rentalId) {
        if (!rentalId) {
            throw new ResponseError(400, "Payment ID diperlukan!");
        }

        const payment = await this.paymentRepo.getPaymentByPaymentId(rentalId);
        if (!payment) {
            throw new ResponseError(404, "Pembayaran tidak ditemukan!");
        }


        return payment;
    }

    async getPayments(userId) {
        if (!userId) {
            throw new ResponseError(400, "User ID diperlukan!");
        }

        const payments = await this.paymentRepo.getPayments(userId);
        if (!payments) {
            throw new ResponseError(404, "Pembayaran tidak ditemukan!");
        }

        return payments;
    }

    async getPaymentsAdmin(request)  {
        const {
            page = 1,
            limit = 10,
            payment_type,
            status,
            start_date,
            end_date
        } = request.query;

        const filterData = {
            skip: (parseInt(page) - 1) * parseInt(limit),
            limit: parseInt(limit),
            where: {
                ...(payment_type && { payment_type }),
                ...(status && { status }),
                ...(start_date && end_date && {
                    AND: [
                        {start_date: { gte: new Date(start_date) }},
                        {end_date : { lte: new Date(end_date) }}
                    ]
                }),
                ...(start_date && { gte: new Date(start_date) }),
                ...(end_date && { gte: new Date(end_date) }),
            }
        }
        const {payments, totalData} = await this.paymentRepo.getPaymentsAdmin(filterData);
        const totalPage = Math.ceil(totalData / filterData.limit);

        return {
            payments,
            totalData,
            totalPage
        }
    }

    async handleMidtransNotification(notification) {
        try {
            logger.info("Menerima notifikasi pembayaran dari Midtrans:", notification);

            const orderId = notification.order_id;
            const transactionStatus = notification.transaction_status;
            const fraudStatus = notification.fraud_status;
            const paymentType = notification.payment_type;

            const payment = await this.paymentRepo.getPaymentByMidtransOrderId(orderId);
            if (!payment) {
                throw new Error(`Pembayaran dengan ID pesanan ${orderId} tidak ditemukan`);
            }

            let paymentStatus;
            if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
                if (fraudStatus === 'challenge') {
                    paymentStatus = 'PENDING';
                } else if (fraudStatus === 'accept') {
                    paymentStatus = 'PAID';
                }
            } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
                paymentStatus = transactionStatus === 'expire' ? 'EXPIRED' : 'FAILED';
            } else if (transactionStatus === 'pending') {
                paymentStatus = 'PENDING';
            } else {
                paymentStatus = 'PENDING';
            }

            await this.paymentRepo.updatePaymentStatus(
                payment.id,
                paymentStatus,
                paymentType,
                paymentStatus === 'PAID' ? new Date() : null
            );

            if (paymentStatus === 'PAID') {
                await this.rentalRepo.updateRentStatus('CONFIRMED', payment.rental_id);
                logger.info(`Status sewa diperbarui menjadi CONFIRMED untuk ID sewa: ${payment.rental_id}`);
            }

            return { success: true };
        } catch (error) {
            logger.error("Gagal memproses notifikasi pembayaran:", error);
            throw error;
        }
    }
}

export default PaymentService;