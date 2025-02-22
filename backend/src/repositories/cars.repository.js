import {prismaClient} from "../config/database.config.js";
import {redisClient} from "../config/redis.config.js";
import fs from 'fs/promises'

class CarsRepository {
    constructor(dbClient = prismaClient) {
        this.db = dbClient;
        this.rdb = redisClient;
    };

    async addNewCar(carData) {
        const {images, category, features, ...CarData} = carData;
        try {
            return await this.db.$transaction(async (tx) => {
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
        } catch (err) {
            for (let i = 0; i < images.length; i++) {
                await fs.unlink(images[i].path)
                console.log(images[i].path)
            }
            throw err;
        }
    }
}

export default CarsRepository;