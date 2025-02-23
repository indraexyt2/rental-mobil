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
        const {images, categories, features, ...CarData} = carData;
        try {
            const result = this.db.$transaction(async (tx) => {
                const newCar = await tx.car.create({
                    data: {
                        ...CarData,
                    },
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

                if (categories.length > 0) {
                    await tx.categoryOnCars.createMany({
                        data: categories.map(id => ({
                            car_id: newCar.id,
                            category_id: id
                        }))
                    });
                }

                if (features.length > 0) {
                    await tx.featureOnCars.createMany({
                        data: features.map(id => ({
                            car_id: newCar.id,
                            feature_id: id
                        }))
                    });
                }

                return tx.car.findUnique({
                    where: {
                        id: newCar.id,
                    },
                    include: {
                        images: true,
                        categories: true,
                        features: true
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
                      categories: true,
                      features: true
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

    async getCar(carId) {
        try {
            const carRdb = await this.rdb.get(`car:${carId}`) ;
            if (carRdb) {
                logger.info("Berhasil mendapatkan data mobil dari redis!")
                return JSON.parse(carRdb)
            }

            const car = await this.db.car.findUnique({
                where: {
                    id: carId,
                },
                include: {
                    images: true,
                    categories: true,
                    features: true
                }
            });

            const ok = await this.rdb.set(`car:${car.id}`, JSON.stringify(car), {EX: 60 * 60 * 24});
            switch (ok) {
                case ('OK'):
                    logger.info("Berhasil menyimpan data mobil ke redis!");
                    break;
                default:
                    logger.warn("Gagal menyimpan data mobil ke redis!");
                    break;
            }

            return car;
        } catch (err) {
            return err;
        }
    }

    async updateCar(carData, carId) {
        const {deleted_image, images, categories, features, ...CarData} = carData;
        const carIdInt = parseInt(carId)
        try {
            const result = await this.db.$transaction( async (tx) => {
                await tx.car.update({
                    where: {
                        id: carIdInt
                    },
                    data: CarData
                });

                if (deleted_image.length > 0) {
                    await tx.carImage.deleteMany({
                        where: {
                            id: {
                                in: deleted_image
                            }
                        }
                    });
                }

                if (images.length > 0) {
                    await tx.carImage.createMany({
                        data: images.map(file => ({
                            car_id: carIdInt,
                            image_url: file.path
                        }))
                    });
                }

                if (categories.length > 0) {
                    const exitingCategory = await tx.categoryOnCars.findMany({
                        where: { car_id: carIdInt },
                        select: { category_id: true }
                    });

                    const exitingCategoryId = exitingCategory.map(c => c.category_id);
                    let categoryToRemove = exitingCategoryId.filter(id => !categories.includes(id));
                    let categoryToAdd = categories.filter(id => !exitingCategoryId.includes(id));

                    if (categoryToRemove.length > 0) {
                        await tx.categoryOnCars.deleteMany({
                            where: {
                                car_id: carIdInt,
                                category_id: { in: categoryToRemove }
                            }
                        });
                    }

                    if (categoryToAdd.length > 0) {
                        await tx.categoryOnCars.createMany({
                            data: categoryToAdd.map(id => ({
                                car_id: carIdInt,
                                category_id: id
                            }))
                        })
                    }
                }

                if (features.length > 0) {
                    const exitingFeatures = await tx.featureOnCars.findMany({
                        where: { car_id: carIdInt },
                        select: { feature_id: true }
                    });

                    const exitingFeatureId = exitingFeatures.map(f => f.feature_id);
                    let featureToRemove = exitingFeatureId.filter(id => !features.includes(id));
                    let featureToAdd = features.filter(id => !exitingFeatureId.includes(id));

                    if (featureToRemove.length > 0) {
                        await tx.featureOnCars.deleteMany({
                            where: {
                                car_id: carIdInt,
                                feature_id: { in: featureToRemove }
                            }
                        });
                    }

                    if (featureToAdd.length > 0) {
                        await tx.featureOnCars.createMany({
                            data: featureToAdd.map(id => ({
                                car_id: carIdInt,
                                feature_id: id
                            }))
                        })
                    }
                }

                return tx.car.findUnique({
                    where: {
                        id: carIdInt
                    },
                    select: {
                        id: true,
                        brand: true,
                        model: true,
                        year: true,
                        transmission: true,
                        capacity: true,
                        fuel_type: true,
                        price_per_day: true,
                        is_active: true,
                        description: true,
                        mileage: true,
                        created_at: true,
                        updated_at: true,
                        features: true,
                        images: true,
                        categories: true,
                        rentals: true
                    }
                });
            });

            await this.rdb.del(`car:all`);
            await this.rdb.del(`car:${result.id}`);

            return result;
        } catch (err) {
            throw err;
        }
    }

    async addCategory(categoryName) {
        try {
            return await this.db.category.create({
                data: {
                    category_name: categoryName
                },
                select : {
                    id: true,
                    category_name: true
                }
            })
        } catch (err) {
            throw err;
        }
    }

    async updateCategory(categoryId, categoryName) {
        try {
            return await this.db.category.update({
                where: {
                    id: parseInt(categoryId)
                },
                data: {
                    category_name: categoryName
                },
                select: {
                    id: true,
                    category_name: true
                }
            })
        } catch (err) {
            throw err;
        }
    }

    async delCategory(categoryId) {
        try {
            return await this.db.category.delete({
                where: {
                    id: parseInt(categoryId)
                }
            })
        } catch (err) {
            throw err;
        }
    }

    async getCategory(categoryId) {
        try {
            return await this.db.category.findUnique({
                where: {
                    id: parseInt(categoryId)
                }
            })
        } catch (err) {
            throw err;
        }
    }

    async getCategories() {
        try {
            return await this.db.category.findMany();
        } catch (err) {
            throw err;
        }
    }

    async addFeature(featureName) {
        try {
            return await this.db.features.create({
                data: {
                    feature: featureName
                }
            });
        } catch (err) {
            throw err;
        }
    }

    async updateFeature(featureId, featureName) {
        try {
            return await this.db.features.update({
                where: {
                    id: parseInt(featureId)
                },
                data: {
                    feature: featureName
                }
            });
        } catch (err) {
            throw err;
        }
    }

    async delFeature(featureId) {
        try {
            return await this.db.features.delete({
                where: {
                    id: parseInt(featureId)
                }
            })
        } catch (err) {
            throw err;
        }
    }

    async getFeature(featureId) {
        try {
            return await this.db.features.findUnique({
                where: {
                    id: parseInt(featureId)
                }
            })
        } catch (err) {
            throw err;
        }
    }

    async getFeatures() {
        try {
            return await this.db.features.findMany();
        } catch (err) {
            throw err;
        }
    }
}

export default CarsRepository;