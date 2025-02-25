import CarService from "../service/car.service.js";
import {logger} from "../utils/logger.js";

class CarController {
    constructor() {
        this.carService = new CarService();
    }

    addNewCar = async (req, res, next) => {
        try {
            const result = await this.carService.addNewCar(req);
            return res.status(200).json({
                "messange": "Berhasil!",
                "data": result
            })
        } catch (e) {
            logger.error("Gagal menambahkan mobil baru:", e);
            next(e);
        }
    }

    getCars = async (req, res, next) => {
        try {
            const {cars, totalData, totalPage} = await this.carService.getCars(req);
            return res.status(200).json({
                "message": "Berhasil!",
                "data": {
                    "pagination": {
                        "page": parseInt(req.query.page) || 1,
                        "limit": parseInt(req.query.limit) || 10,
                        "total_data": totalData,
                        "total_page": totalPage
                    },
                    cars
                }
            })
        } catch (e) {
            logger.error("Gagal mendapatkan semua data mobil:", e);
            next(e);
        }
    }

    getCar = async (req, res, next) => {
        try {
            const result = await this.carService.getCar(req);
            return res.status(200).json({
                "message": "Berhasil!",
                "data": result
            })
        } catch (e) {
            logger.error("Gagal mendapatkan data mobil:", e);
            next(e);
        }
    }

    updateCar = async (req, res, next) => {
        try {
            const result = await this.carService.updateCar(req);
            return res.status(200).json({
                "message": "Berhasil",
                "data": result
            });
        } catch (e) {
            logger.error("Gagal memperbarui data mobil:", e);
            next(e);
        }
    }

    deleteCar = async (req, res, next) => {
        try {
            const result = await this.carService.deleteCar(req);
            return res.status(200).json({
                "message": "Berhasil!",
                "data": result
            });
        } catch (e) {
            logger.error("Gagal menghapus mobil:", e)
            next(e);
        }
    }

    addCategory = async (req, res, next) => {
        try {
            const result = await this.carService.addCategory(req);
            return res.status(200).json({
                "message": "Berhasil!",
                "data": result
            });
        } catch (e) {
            logger.error("Gagal menambahkan kategory:", e);
            next(e);
        }
    }

    updateCategory = async (req, res, next) => {
        try {
            const result = await this.carService.updateCategory(req);
            return res.status(200).json({
                "message": "Berhasil!",
                "data": result
            });
        } catch (e) {
            logger.error("Gagal memperbarui kategory:", e);
            next(e);
        }
    }

    delCategory = async (req, res, next) => {
        try {
            const result = await this.carService.delCategory(req);
            return res.status(200).json({
                "message": "Berhasil!",
                "data": result
            });
        } catch (e) {
            logger.error("Gagal menghapus kategory:", e);
            next(e);
        }
    }

    getCategory = async (req, res, next) => {
        try {
            const result = await this.carService.getCategory(req);
            return res.status(200).json({
                "message": "Berhasil!",
                "data": result
            });
        } catch (e) {
            logger.error("Gagal mendapatkan kategory:", e);
            next(e);
        }
    }

    getCategories = async (req, res, next) => {
        try {
            const result = await this.carService.getCategories();
            return res.status(200).json({
                "message": "Berhasil!",
                "data": result
            });
        } catch (e) {
            logger.error("Gagal mendapatkan semua kategory:", e);
            next(e);
        }
    }

    addFeature = async (req, res, next) => {
        try {
            const result = await this.carService.addFeature(req);
            return res.status(200).json({
                "message": "Berhasil!",
                "data": result
            });
        } catch (e) {
            logger.error("Gagal menambahkan feature:", e);
            next(e);
        }
    }

    updateFeature = async (req, res, next) => {
        try {
            const result = await this.carService.updateFeature(req);
            return res.status(200).json({
                "message": "Berhasil!",
                "data": result
            });
        } catch (e) {
            logger.error("Gagal memperbarui feature:", e);
            next(e);
        }
    }

    delFeature = async (req, res, next) => {
        try {
            const result = await this.carService.delFeature(req);
            return res.status(200).json({
                "message": "Berhasil!",
                "data": result
            });
        } catch (e) {
            logger.error("Gagal menghapus feature:", e);
            next(e);
        }
    }

    getFeature = async (req, res, next) => {
        try {
            const result = await this.carService.getFeature(req);
            return res.status(200).json({
                "message": "Berhasil!",
                "data": result
            });
        } catch (e) {
            logger.error("Gagal mendapatkan feature:", e);
            next(e);
        }
    }

    getFeatures = async (req, res, next) => {
        try {
            const result = await this.carService.getFeatures();
            return res.status(200).json({
                "message": "Berhasil!",
                "data": result
            });
        } catch (e) {
            logger.error("Gagal mendapatkan semua feature:", e);
            next(e);
        }
    }
}

export default CarController;