import RentalService from "../service/rental.service.js";
import {logger} from "../utils/logger.js";

class RentalController {
    constructor() {
        this.rentalService = new RentalService();
    }

    addNewRent = async (req, res, next) => {
        try {
            const result = await this.rentalService.addNewRent(req);
            return res.status(200).json({
                "message": "Berhasil!",
                "data": result
            })
        } catch (e) {
            logger.error("Gagal menambahkan rental baru:", e);
            next(e);
        }
    }

    getRents = async (req, res, next) => {
        try {
            const {rents, totalData, totalPage} = await this.rentalService.getRents(req);
            return res.status(200).json({
                "message": "Berhasil!",
                "data": {
                    "pagination": {
                        "page": parseInt(req.query.page) || 1,
                        "limit": parseInt(req.query.limit) || 10,
                        "total_data": totalData,
                        "total_page": totalPage
                    },
                    rents
                }
            })
        } catch (e) {
            logger.error("Gagal mendapatkan semua data rental:", e);
            next(e);
        }
    }

    getRentDetailByUserId = async (req, res, next) => {
        try {
            const {rents, totalData, totalPage} = await this.rentalService.getRentsByUserId(req);
            return res.status(200).json({
                "message": "Berhasil!",
                "data": {
                    "pagination": {
                        "page": parseInt(req.query.page) || 1,
                        "limit": parseInt(req.query.limit) || 10,
                        "total_data": totalData,
                        "total_page": totalPage
                    },
                    rents
                }
            })
        } catch (e) {
            logger.info("Gagal mendapatkan rental detail by user id:", e);
            next(e);
        }
    }

    getRentDetail = async (req, res, next) => {
        try {
            const result = await this.rentalService.getRentDetail(req);
            return res.status(200).json({
                "message": "Berhasil!",
                "data": result
            })
        } catch (e) {
            logger.info("Gagal mendapatkan rental detail:", e);
            next(e);
        }
    }

    updateRent = async (req, res, next) => {
        try {
            const result = await this.rentalService.updateRend(req);
            return res.status(200).json({
                "message": "Berhasil!",
                "data": result
            })
        } catch (e) {
            next(e);
        }
    }

    updateRentStatus = async (req, res, next) => {
        try {
            const result = await this.rentalService.updateRentStatus(req);
            return res.status(200).json({
                "message": "Berhasil!",
                "data": result
            })
        } catch (e) {
            next(e);
        }
    }

    getRentsDates = async (req, res, next) => {
        try {
            const result = await this.rentalService.getRentsDates(req);
            res.status(200).json({
                "message": "Berhasil!",
                "data": result
            });
        } catch (e) {
            logger.error("Gagal mendapatkan booking dates:", e)
            next(e);
        }
    }
}

export default RentalController;