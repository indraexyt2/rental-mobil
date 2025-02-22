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
}

export default CarController;