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
            logger.error("Gagal mendapatkan mobil baru:", e);
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
}

export default CarController;