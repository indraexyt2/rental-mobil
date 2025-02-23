import CarsRepository from "../repositories/cars.repository.js";
import {carSchema} from "../utils/validator.js";
import {ResponseError} from "../error/response.error.js";
import fs from "fs/promises";
import car from "../routes/car.route.js";

class CarService {
    constructor() {
        this.carRepo = new CarsRepository();
    }

    async addNewCar(request) {
        const files = request.files.car;
        const carData = request.body;
        carData.images = files;

        carData.features = carData.features ? JSON.parse(carData.features) : [];
        carData.categories = carData.categories ? JSON.parse(carData.categories) : [];

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

    async getCar(request) {
        const carId = request.params.id;
        if (!carId) {
            throw new ResponseError(400, "Mobil ID dibutuhkan!");
        }

        return await this.carRepo.getCar(parseInt(carId))
    }

    async updateCar(request) {
        const carId = request.params.id;
        const carData = request.body;
        carData.images = request.files.car;

        carData.deleted_image = carData.deleted_image ? JSON.parse(carData.deleted_image) : [];
        carData.features = carData.features ? JSON.parse(carData.features) : [];
        carData.categories = carData.categories ? JSON.parse(carData.categories) : [];

        const {value, error} = carSchema.validate(carData, {
            abortEarly: false,
            stripUnknown: true
        })

        if (error) {
            for (let i = 0; i < carData.images.length; i++) {
                await fs.rm(carData.images[i].path)
            }

            const errors = error.details.map(err =>
                err.message.trim()
            );

            throw new ResponseError(400, errors)
        }
        return await this.carRepo.updateCar(value, carId);
    }

    async addCategory(request) {
        const categoryName = request.body.category_name;
        if (!categoryName) {
            throw new ResponseError(400, "Nama kategori wajib diisi!");
        }

        return await this.carRepo.addCategory(categoryName);
    }

    async updateCategory(request) {
        const categoryId = request.params.id;
        if (!categoryId) {
            throw new ResponseError(400, "Kategori id dibutuhkan!");
        }

        const categoryName = request.body.category_name;
        if (!categoryName) {
            throw new ResponseError(400, "Nama kategori wajib diisi!");
        }

        return await this.carRepo.updateCategory(categoryId, categoryName);
    }

    async delCategory(request) {
        const categoryId = request.params.id;
        if (!categoryId) {
            throw new ResponseError(400, "Kategori id dibutuhkan!");
        }

        return await this.carRepo.delCategory(categoryId)
    }

    async getCategory(request) {
        const categoryId = request.params.id;
        if (!categoryId) {
            throw new ResponseError(400, "Kategori id dibutuhkan!");
        }

        return await this.carRepo.getCategory(categoryId)
    }

    async getCategories() {
        return await this.carRepo.getCategories();
    }

    async addFeature(request) {
        const featureName = request.body.feature_name;
        if (!featureName) {
            throw new ResponseError(400, "Nama feature wajib diisi!");
        }

        return await this.carRepo.addFeature(featureName);
    }

    async updateFeature(request) {
        const featureId = request.params.id;
        if (!featureId) {
            throw new ResponseError(400, "Feature id dibutuhkan!");
        }

        const featureName = request.body.feature_name;
        if (!featureName) {
            throw new ResponseError(400, "Nama feature wajib diisi!");
        }

        return await this.carRepo.updateFeature(featureId, featureName);
    }

    async delFeature(request) {
        const featureId = request.params.id;
        if (!featureId) {
            throw new ResponseError(400, "Feature id dibutuhkan!");
        }

        return await this.carRepo.delFeature(featureId)
    }

    async getFeature(request) {
        const featureId = request.params.id;
        if (!featureId) {
            throw new ResponseError(400, "Feature id dibutuhkan!");
        }

        return await this.carRepo.getFeature(featureId)
    }

    async getFeatures() {
        return await this.carRepo.getFeatures();
    }
}

export default CarService;