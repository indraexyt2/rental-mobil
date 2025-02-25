import {prismaClient} from "../config/database.config.js";
import {redisClient} from "../config/redis.config.js";
import {logger} from "../utils/logger.js";

class RentalRepository {
    constructor() {
        this.db = prismaClient;
        this.rdb = redisClient;
    }

    async addNewRent(rentData, userId) {
        try {
            const newRent = await this.db.rental.create({
                data: {
                    ...rentData,
                    user_id: parseInt(userId)
                }
            })

            await this.rdb.del(`user:all`)
            const ok = await this.rdb.del(`user:info:${userId}`);
            if (ok > 0) {
                logger.info(`Berhasil menghapus data user:info:${userId} dari redis!`);
            } else {
                logger.warn(`Gagal menghapus data user:info:${userId} dari redis!`);
            }

            return newRent;
        } catch (e) {
            throw e;
        }
    }

    async getRents(filterData) {
        try {
            let rents = await this.rdb.get(`rent:all`);
            if (rents) {
                const rentsObj = JSON.parse(rents);

                rents = rentsObj.filter(rent => {
                    const status = !filterData.where.status || filterData.where.status === rent.status;
                    const car_id = !filterData.where.car_id  || filterData.where.car_id  === rent.car_id ;

                    let dateFilter = true;
                    if (filterData.where.AND) {
                        dateFilter =
                            new Date(rent.start_date) >= new Date(filterData.where.AND[0].start_date.gte) &&
                            new Date(rent.end_date) <= new Date(filterData.where.AND[1].end_date.lte);
                    } else if (filterData.where.gte) {
                        dateFilter = new Date(rent.start_date) >= new Date(filterData.where.gte);
                    } else if (filterData.where.lte) {
                        dateFilter = new Date(rent.end_date) <= new Date(filterData.where.lte);
                    }

                    return status && car_id && dateFilter;
                });

                const totalData = rents.length
                rents = rents.slice(filterData.skip, filterData.skip + filterData.limit);
                rents = rents.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                logger.info("Berhasil mendapatkan semua data rental dari redis!")
                return {rents, totalData};
            }

           const result = await this.db.$transaction(async (tx) => {
               const rents = await tx.rental.findMany({
                   where: filterData.where,
                   skip: filterData.skip,
                   take: filterData.limit,
                   orderBy: {
                       created_at: 'desc'
                   },
                   include: {
                       car: {
                           select: {
                               id: true,
                               brand: true,
                               model: true,
                               year: true,
                               transmission: true,
                               capacity: true
                           }
                       },
                       user: {
                           select: {
                               id: true,
                               email: true,
                               full_name: true,
                               address: true,
                               phone: true,
                               avatar: true,
                               role: true,
                               sim_number: true,
                               sim_image: true,
                               password: false
                           }
                       }
                   }
               });

               const totalData = await tx.rental.count({
                   where: filterData.where
               });

               return {rents, totalData};
           })

            const allRents = await this.db.rental.findMany({
                include: {
                    car: true,
                    user: true
                }
            });
            const ok = await this.rdb.set("rent:all", JSON.stringify(allRents), {EX: 60 * 60 * 24});
            switch (ok) {
                case 'OK':
                    logger.info("Berhasil meyimpan semua data rental ke redis!");
                    break;
                default:
                    logger.warn("Gagal menyimpan semua data rental ke redis");
                    break
            }

            return result;
        } catch (e) {
            throw e;
        }
    }

    async getRentsByUserId(filterData) {
        try {
            let rents = await this.rdb.get(`rent:user:${filterData.user_id}`);
            if (rents) {
                const rentsObj = JSON.parse(rents);

                rents = rentsObj.filter(rent => {
                    const status = !filterData.where.status || filterData.where.status === rent.status;
                    const car_id = !filterData.where.car_id  || filterData.where.car_id  === rent.car_id ;

                    let dateFilter = true;
                    if (filterData.where.AND) {
                        dateFilter =
                            new Date(rent.start_date) >= new Date(filterData.where.AND[0].start_date.gte) &&
                            new Date(rent.end_date) <= new Date(filterData.where.AND[1].end_date.lte);
                    } else if (filterData.where.gte) {
                        dateFilter = new Date(rent.start_date) >= new Date(filterData.where.gte);
                    } else if (filterData.where.lte) {
                        dateFilter = new Date(rent.end_date) <= new Date(filterData.where.lte);
                    }

                    return status && car_id && dateFilter;
                });

                const totalData = rents.length
                rents = rents.slice(filterData.skip, filterData.skip + filterData.limit);
                rents = rents.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                logger.info("Berhasil mendapatkan semua data rental dari redis!")
                return {rents, totalData};
            }

            const result = await this.db.$transaction(async (tx) => {
                const rents = await tx.rental.findMany({
                    where: filterData.where,
                    skip: filterData.skip,
                    take: filterData.limit,
                    orderBy: {
                        created_at: 'desc'
                    },
                    include: {
                        car: {
                            select: {
                                id: true,
                                brand: true,
                                model: true,
                                year: true,
                                transmission: true,
                                capacity: true
                            }
                        },
                        user: {
                            select: {
                                id: true,
                                email: true,
                                full_name: true,
                                address: true,
                                phone: true,
                                avatar: true,
                                role: true,
                                sim_number: true,
                                sim_image: true,
                                password: false
                            }
                        }
                    }
                });

                const totalData = await tx.rental.count({
                    where: filterData.where
                });

                return {rents, totalData};
            })

            const allRents = await this.db.rental.findMany({
                where: {
                    user_id: filterData.user_id
                },
                include: {
                    car: true,
                    user: true
                }
            });
            const ok = await this.rdb.set(`rent:user:${filterData.where.user_id}`, JSON.stringify(allRents), {EX: 60 * 60 * 24});
            switch (ok) {
                case 'OK':
                    logger.info(`Berhasil meyimpan data rental user ${filterData.where.user_id} ke redis!`);
                    break;
                default:
                    logger.warn(`Gagal meyimpan data rental user ${filterData.where.user_id} ke redis!`);
                    break
            }

            return result;
        } catch (e) {
            throw e;
        }
    }

    async getRentDetail(rentId) {
        try {
            let rent = await this.rdb.get(`rent:${rentId}`);
            if (rent) {
                rent = JSON.parse(rent);
                logger.info("Berhasil mengambil data rental dari redis!");
                return rent
            }

            rent = await this.db.rental.findUnique({
                where: { id: parseInt(rentId) },
                include: {
                    car: {
                        select: {
                            id: true,
                            brand: true,
                            model: true,
                            year: true,
                            transmission: true,
                            capacity: true,
                            price_per_day: true
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            email: true,
                            full_name: true,
                            address: true,
                            phone: true,
                            avatar: true,
                            role: true,
                            sim_number: true,
                            sim_image: true,
                            password: false
                        }
                    }
                }
            })

            const ok = await this.rdb.set(`rent:${rent.id}`, JSON.stringify(rent), {EX: 24 * 60 * 60});
            switch (ok) {
                case 'OK':
                    logger.info("Berhasil meyimpan data rental ke redis!");
                    break;
                default:
                    logger.warn("Gagal menyimpan data rental ke redis");
                    break
            }

            return rent;
        } catch (e) {
            throw e;
        }
    }

    async updateRent(rendData, rentID) {
        try {
            const updatedRent = await this.db.rental.update({
                where: {
                    id: parseInt(rentID)
                },
                data: rendData
            });

            await this.rdb.del(`rent:${rentID}`);
            await this.rdb.del(`rent:all`);

            return updatedRent;
        } catch (e) {
            throw e;
        }
    }

    async updateRentStatus(statusRent, rentId) {
        try {
            const statusUpdated = this.db.rental.update({
                where: {
                    id: parseInt(rentId)
                },
                data: {
                    status: statusRent
                }
            });

            await this.rdb.del(`rent:${rentId}`);
            await this.rdb.del(`rent:all`);

            return statusUpdated;
        } catch (e) {
            throw e;
        }
    }

    async getRentsDates(carId) {
       try {
           return await this.db.rental.findMany({
               where: {
                   car_id: parseInt(carId),
                   status: {
                       notIn: ['CANCELLED', 'COMPLETED']
                   }
               },
               select: {
                   start_date: true,
                   end_date: true
               }
           });
       } catch (e) {
           throw e;
       }
    }
}

export default RentalRepository;