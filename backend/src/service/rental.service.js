import {rentalSchema, rentalSchemaUpdate} from "../utils/validator.js";
import {ResponseError} from "../error/response.error.js";
import RentalRepository from "../repositories/rental.repository.js";
import CarsRepository from "../repositories/cars.repository.js";
import {rentalStatusMapping} from "../utils/constants.js";
import {publishToQueue} from "../utils/rabbitmq.js";
import {logger} from "../utils/logger.js";
import {prismaClient} from "../config/database.config.js";

class RentalService {
    constructor() {
        this.rentalRepo = new RentalRepository();
        this.carRepo = new CarsRepository();
    }

    async addNewRent(request) {
        const userId = request.claimsToken.id;
        const rentData = request.body;

        const {value, error} = rentalSchema.validate(rentData, {abortEarly: false, stripUnknown: true});
        if (error) {
            const errors = error.details.map(err => err.message.trim());
            throw new ResponseError(400, errors);
        }

        const startDate = new Date(rentData.start_date);
        const endDate = new Date(rentData.end_date);
        const diffTime = Math.abs(endDate - startDate)
        const dayRent = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const carData = await this.carRepo.db.car.findUnique({
            where: {
                id: value.car_id
            },
            select: {
                price_per_day: true
            }
        })

        value.total_price = dayRent * carData.price_per_day;

        if (value.driver_needed === true) {
            // Note: Driver fee example - In real implementation, should fetch from database
            // Driver fee per day = Rp150.000
            const driverFee = 150000 * dayRent;
            value.driver_fee = driverFee;
            value.total_price += driverFee;
        }

        const newRent = await this.rentalRepo.addNewRent(value, userId);
        const rental_id = newRent.id;

        try {
            await publishToQueue('new_rental_queue', rental_id);
            logger.info(`Pesan rental ID: ${rental_id} dikirim ke antrian pembayaran`);
        } catch (err) {
            logger.error(`Gagal mengirim pesan ke RabbitMQ: ${err.message}`);
        }

        return newRent;
    }

    async getRents(request) {
        let {
            status = null,
            start_date = null,
            end_date = null,
            car_id = null,
            page = 1,
            limit = 10
        } = request.query;

        car_id = car_id ? parseInt(car_id) : null;
        const filterData = {
            page: parseInt(page),
            limit: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            where: {
                ...(status && { status }),
                ...(start_date && end_date && {
                    AND : [
                        { start_date: {gte: new Date(start_date) } },
                        { end_date: { lte: new Date(end_date) }}
                    ]
                }),
                ...(start_date && !end_date && { gte: new Date(start_date) }),
                ...(end_date && !start_date && { lte: new Date(end_date) }),
                ...(car_id && { car_id })
            }
        }

        const {rents, totalData} = await this.rentalRepo.getRents(filterData);
        const totalPage = Math.ceil(totalData / filterData.limit);

        return {
            rents,
            totalData,
            totalPage
        }
    }

    async getRentsByUserId(request) {
        let {
            status = null,
            start_date = null,
            end_date = null,
            car_id = null,
            page = 1,
            limit = 10
        } = request.query;

        car_id = car_id ? parseInt(car_id) : null;
        const user_id = request.claimsToken.id;
        const filterData = {
            page: parseInt(page),
            limit: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            where: {
                ...(user_id && { user_id }),
                ...(status && { status }),
                ...(start_date && end_date && {
                    AND : [
                        { start_date: {gte: new Date(start_date) } },
                        { end_date: { lte: new Date(end_date) }}
                    ]
                }),
                ...(start_date && !end_date && { gte: new Date(start_date) }),
                ...(end_date && !start_date && { lte: new Date(end_date) }),
                ...(car_id && { car_id })
            }
        }

        const {rents, totalData} = await this.rentalRepo.getRentsByUserId(filterData);
        const totalPage = Math.ceil(totalData / filterData.limit);

        return {
            rents,
            totalData,
            totalPage
        }
    }

    async getRentDetail(request) {
        const carId = request.params.id;
        return await this.rentalRepo.getRentDetail(carId);
    }

    async updateRend(request) {
        const updatedData = request.body;
        const rentId = request.params.id;
        const userId = request.claimsToken.id;

        const currentRent = await this.rentalRepo.db.rental.findFirst({
            where: { id: parseInt(rentId) },
            select: {
                id: true,
                total_price: true,
                driver_fee: true,
                status: true,
                driver_needed: true,
                start_date: true,
                end_date: true,
                user: {
                    select: { id: true }
                },
                car: {
                    select: { price_per_day: true }
                }
            }
        });

        if (!currentRent) {
            throw new ResponseError(400, "Rental ID tidak ditemukan!")
        }

        if (userId !== currentRent.user.id) {
            throw new ResponseError(401, "Unauthorized")
        }

        if (currentRent.status !== 'CONFIRMED' && currentRent.status !== 'ACTIVE') {
            logger.info(`Pembayaran untuk ID rental: ${currentRent.id} belum dibayar!`);
            throw new ResponseError(400, "Pembayaran sebelumnya belum dibayarkan!");
        }

        const {value, error} = rentalSchemaUpdate.validate(updatedData, {abortEarly: false, stripUnknown: true});
        if (error) {
            const errors = error.details.map(err => err.message.trim());
            throw new ResponseError(400, errors);
        }

        const diffTime = Math.abs(value.start_date - value.end_date);
        const rentDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const driverFee = 150000 * rentDay;
        const driverFeeCurrent = currentRent.driver_fee || 0;

        value.total_price = rentDay * currentRent.car.price_per_day;

        if (currentRent.driver_needed !== value.driver_needed) {
            if (value.driver_needed) {
                value.driver_fee = driverFee;
                value.total_price += driverFee;
            } else {
                value.driver_fee = null;
            }
        } else if (driverFee > driverFeeCurrent && value.driver_needed === true) {
            value.total_price += driverFee;
        } else {
            value.total_price += driverFeeCurrent;
        }

        if (value.total_price > currentRent.total_price) {
            const additionalCost = value.total_price - currentRent.total_price;
            value.status = 'PENDING';
            const updatedData = await this.rentalRepo.updateRent(value, rentId);

            const diffCurrentRentTime = Math.abs(currentRent.start_date - currentRent.end_date);
            const currentRentDay = Math.ceil( diffCurrentRentTime / (1000 * 60 * 60 * 24));
            const differentDriverFee = Math.abs(driverFee - driverFeeCurrent);

            updatedData.different_day_driver = differentDriverFee / 150000;
            updatedData.different_day = rentDay - currentRentDay;
            updatedData.additional_cost = additionalCost;

            // TODO: Implement additional payment handling
            await publishToQueue('update_rental_queue', updatedData);
            console.log("Additional cost:", additionalCost);

            return updatedData;
        } else if (value.total_price < currentRent.total_price) {
            const refundAmount  = currentRent.total_price - value.total_price;
            const updatedData = await this.rentalRepo.updateRent(value, rentId);
            updatedData.refund_cost = refundAmount;

            // TODO: Handle refund flow
            await publishToQueue('refund_rental_queue', updatedData)
            console.log("Refund amount:", refundAmount);

            return updatedData;
        } else {
            return await this.rentalRepo.updateRent(value, rentId);
        }
    }

    async updateRentStatus(request) {
        const rentId = request.params.id;
        if (!rentId) {
            throw new ResponseError(400, "Rental ID dibutuhkan!");
        }

        const statusRent = request.body.status ? request.body.status.toUpperCase() : null;
        if (!statusRent) {
            throw new ResponseError(400, "Update status dibutuhkan!");
        }

        const currentRent = await this.rentalRepo.db.rental.findUnique({
            where: { id: parseInt(rentId) },
            select: { status: true }
        });
        if (!currentRent) {
            throw new ResponseError(400, "Rental ID tidak valid!");
        }

        const mappingStatus = rentalStatusMapping[currentRent.status];
        if (!mappingStatus || !mappingStatus.includes(statusRent)) {
            throw new ResponseError(400, "Status tidak valid!");
        }

        return await this.rentalRepo.updateRentStatus(statusRent, rentId);
    }

    async getRentsDates(request) {
        const carId = request.params.id;
        if (!carId) {
            throw new ResponseError(400, "Mobil ID dibutuhkan!");
        }

        const bookings = await this.rentalRepo.getRentsDates(carId);

        const bookedDates = [];
        bookings.forEach(booking => {
            const start = new Date(booking.start_date);
            const end = new Date(booking.end_date);

            const currentDate = new Date(start);
            while (currentDate <= end) {
                bookedDates.push(new Date(currentDate).toISOString().split('T')[0]);
                currentDate.setDate(currentDate.getDate() + 1);
            }
        });

        return [...new Set(bookedDates)];
    }
}

export default RentalService;