import CarsRepository from "../repositories/cars.repository.js";
import {carSchema} from "../utils/validator.js";
import {ResponseError} from "../error/response.error.js";
import fs from "fs/promises";

class CarService {
    constructor() {
        this.carRepo = new CarsRepository();
    }

    async addNewCar(request) {
        const files = request.files.car;
        const carData = request.body;
        carData.images = files;

        carData.features = carData.features ? JSON.parse(carData.features) : [];
        carData.category = carData.category ? JSON.parse(carData.category) : [];

        const {value, error} = carSchema.validate(carData, {abortEarly: false, stripUnknown: true});
        if (error) {
            const errors = error.details.map(err =>
                err.message.trim()
            );

            for (let i = 0; i < carData.images.length; i++) {
                await fs.unlink(carData.images[i].path)
            }

            throw new ResponseError(400, errors);
        }

        return await this.carRepo.addNewCar(value)
    }

    async getCars(request) {
        const {
            brand,
            transmission,
            fuel_type,
            page = 1,
            limit = 10
        } = request.query;

        const filterData = {
            page: parseInt(page),
            limit: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            where: {
                ...(brand && {brand}),
                ...(transmission && {transmission}),
                ...(fuel_type && {fuel_type})
            }
        }

        const {cars, totalData} = await this.carRepo.getCars(filterData);
        const totalPage = Math.ceil(totalData / filterData.limit)

        return {
            cars,
            totalData,
            totalPage
        }
    }
}

export default CarService;