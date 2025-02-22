import {prismaClient} from "../config/database.config.js";
import {redisClient} from "../config/redis.config.js";
import fs from 'fs/promises'
import {logger} from "../utils/logger.js";

class CarsRepository {
    constructor(dbClient = prismaClient) {
        this.db = dbClient;
        this.rdb = redisClient;
    };

    async addNewCar(carData) {
        const {images, category, features, ...CarData} = carData;
        try {
            const result = this.db.$transaction(async (tx) => {
                const newCar = await tx.car.create({
                    data: CarData,
                    select: {
                        id: true
                    }
                });

                if (images.length > 0) {
                    await tx.carImage.createMany({
                        data: images.map(file => ({
                            image_url: file.path,
                            car_id: newCar.id
                        }))
                    });
                }

                if (features.length > 0) {
                    await tx.features.createMany({
                        data: features.map(feat => ({
                            feature: feat,
                            car_id: newCar.id
                        }))
                    });
                }

                if (category.length > 0) {
                    await tx.category.createMany({
                        data: category.map(c => ({
                            category: c,
                            car_id: newCar.id
                        }))
                    });
                }

                return tx.car.findUnique({
                    where: {
                        id: newCar.id,
                    },
                    include: {
                        images: true,
                        category: true
                    }
                });
            });

            await this.rdb.del("car:all");
            await this.rdb.del(`car:${result.id}`)

            return result;
        } catch (err) {
            for (let i = 0; i < images.length; i++) {
                await fs.unlink(images[i].path)
                console.log(images[i].path)
            }
            throw err;
        }
    }

    async getCars(filterData) {
        try {
            let cars = await this.rdb.get("car:all");
            if (cars) {
                const carsObj = JSON.parse(cars);
                cars = carsObj.filter(car => {
                    const brandFilter = !filterData.where.brand || filterData.where.brand === car.brand;
                    const transmissionFilter = !filterData.where.transmission || filterData.where.transmission === car.transmission;
                    const fuelFilter = !filterData.where.fuel_type || filterData.where.fuel_type === car.fuel_type;

                    return brandFilter && transmissionFilter && fuelFilter;
                })

                logger.info("Berhasil mendapatkan semua data mobil dari redis!")
                const totalData = cars.length;
                return {cars, totalData};
            }

            const result = await this.db.$transaction(async (tx) => {
              const cars = await tx.car.findMany({
                   where: filterData.where,
                   skip: filterData.skip,
                   take: filterData.limit,
                   orderBy: {
                       created_at: "desc"
                   },
                  include: {
                       images: true,
                      category: true
                  }
               });

              const totalData = await tx.car.count({
                  where: filterData.where
              })

               return {cars, totalData};
           })

            const allCars = await this.db.car.findMany();
            const ok = await this.rdb.set("car:all", JSON.stringify(allCars), {EX: 60 * 60 * 24});
            switch (ok) {
                case 'OK':
                    logger.info("Berhasil meyimpan semua data mobil ke redis!");
                    break;
                default:
                    logger.warn("Gagal menyimpan semua data mobil ke redis");
                    break
            }

            return result;
        } catch (err) {
            throw err;
        }
    }
}

export default CarsRepository;