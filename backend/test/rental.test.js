import {registerAdmin, registerUser, removeTestUser, setupTestDb} from "./utils/test.utils.js";
import request from "supertest";
import {prismaClient} from "../src/config/database.config.js";
import {validCarData} from "./utils/mock.data.js";
import {app} from "../src/app.js";
import {redisClient} from "../src/config/redis.config.js";

describe('POST /api/rentals', () => {
    let adminCookie;
    let userCookie;
    let rentData;
    let car;

    beforeAll(async () => {
        await setupTestDb();
    });

    beforeEach(async () => {
        adminCookie = await registerAdmin();
        userCookie = await registerUser();

        car = await prismaClient.car.create({
            data: {
                brand: validCarData.brand,
                model: validCarData.model,
                year: validCarData.year,
                transmission: validCarData.transmission,
                capacity: validCarData.capacity,
                fuel_type: validCarData.fuel_type,
                price_per_day: validCarData.price_per_day,
                description: validCarData.description,
                mileage: validCarData.mileage
            }
        });

        rentData = {
            "car_id": car.id,
            "start_date": "2025-03-01",
            "end_date": "2025-03-02",
            "driver_needed": false
        };
    });

    afterEach(async () => {
        await prismaClient.rental.deleteMany();
        await setupTestDb();
        await removeTestUser();
    });

    afterAll(async () => {
        await setupTestDb();
        await prismaClient.$disconnect();
    });

    it('should create a new rental successfully', async () => {
        const response = await request(app)
            .post('/api/rentals')
            .set('Cookie', userCookie)
            .send(rentData);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Berhasil!');
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.car_id).toBe(car.id);
        expect(response.body.data.status).toBe('PENDING');
        expect(response.body.data.driver_needed).toBe(false);
    });

    it('should return 400 when required fields are missing', async () => {
        const invalidData = {
        };

        const response = await request(app)
            .post('/api/rentals')
            .set('Cookie', userCookie)
            .send(invalidData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });

    it('should calculate correct price without driver', async () => {
        const response = await request(app)
            .post('/api/rentals')
            .set('Cookie', userCookie)
            .send(rentData);

        expect(response.status).toBe(200);

        const expectedPrice = 1 * validCarData.price_per_day;
        expect(response.body.data.total_price).toBe(expectedPrice);
        expect(response.body.data.driver_fee).toBeNull();
    });

    it('should calculate correct price with driver', async () => {
        const dataWithDriver = {
            ...rentData,
            driver_needed: true
        };

        const response = await request(app)
            .post('/api/rentals')
            .set('Cookie', userCookie)
            .send(dataWithDriver);

        expect(response.status).toBe(200);

        const expectedCarPrice = 1 * validCarData.price_per_day;
        const expectedDriverFee = 1 * 150000;
        const expectedTotal = expectedCarPrice + expectedDriverFee;

        expect(response.body.data.driver_fee).toBe(expectedDriverFee);
        expect(response.body.data.total_price).toBe(expectedTotal);
    });

    it('should return 401 when not authenticated', async () => {
        const response = await request(app)
            .post('/api/rentals')
            .send(rentData);

        expect(response.status).toBe(401);
    });
});

describe('GET /api/rentals/all', () => {
    let adminCookie;
    let userCookie;
    let car;
    let userId;

    beforeAll(async () => {
        await setupTestDb();
    });

    beforeEach(async () => {
        await redisClient.flushAll();
        adminCookie = await registerAdmin();
        userCookie = await registerUser();

        const user = await prismaClient.user.findUnique({
            where: {
                email: "user@test.com"
            }
        });
        userId = user.id;

        car = await prismaClient.car.create({
            data: {
                brand: validCarData.brand,
                model: validCarData.model,
                year: validCarData.year,
                transmission: validCarData.transmission,
                capacity: validCarData.capacity,
                fuel_type: validCarData.fuel_type,
                price_per_day: validCarData.price_per_day,
                description: validCarData.description,
                mileage: validCarData.mileage
            }
        });

        await prismaClient.rental.createMany({
            data: [
                {
                    car_id: car.id,
                    user_id: userId,
                    start_date: new Date('2025-03-01'),
                    end_date: new Date('2025-03-02'),
                    status: 'PENDING',
                    driver_needed: false,
                    total_price: validCarData.price_per_day
                },
                {
                    car_id: car.id,
                    user_id: userId,
                    start_date: new Date('2025-04-01'),
                    end_date: new Date('2025-04-05'),
                    status: 'CONFIRMED',
                    driver_needed: true,
                    driver_fee: 150000 * 4,
                    total_price: (validCarData.price_per_day * 4) + (150000 * 4)
                }
            ]
        });
    });

    afterEach(async () => {
        await prismaClient.rental.deleteMany();
        await setupTestDb();
        await removeTestUser();
    });

    afterAll(async () => {
        await setupTestDb();
        await prismaClient.$disconnect();
    });

    it('should get all rentals with pagination for admin', async () => {
        const response = await request(app)
            .get('/api/rentals/all')
            .set('Cookie', adminCookie)
            .query({
                page: 1,
                limit: 10
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Berhasil!');
        expect(response.body.data.rents).toHaveLength(2);
        expect(response.body.data.pagination).toEqual({
            page: 1,
            limit: 10,
            total_data: 2,
            total_page: 1
        });

        // Memastikan rentals memiliki data yang benar
        const rentals = response.body.data.rents;
        expect(rentals.some(rental => rental.status === 'PENDING')).toBe(true);
        expect(rentals.some(rental => rental.status === 'CONFIRMED')).toBe(true);
    });

    it('should filter rentals by status', async () => {
        const response = await request(app)
            .get('/api/rentals/all')
            .set('Cookie', adminCookie)
            .query({
                status: 'PENDING'
            });

        expect(response.status).toBe(200);
        expect(response.body.data.rents).toHaveLength(1);
        expect(response.body.data.rents[0].status).toBe('PENDING');
    });

    it('should filter rentals by date range', async () => {
        const response = await request(app)
            .get('/api/rentals/all')
            .set('Cookie', adminCookie)
            .query({
                start_date: '2025-03-01',
                end_date: '2025-03-31'
            });

        expect(response.status).toBe(200);
        expect(response.body.data.rents).toHaveLength(1);
        expect(new Date(response.body.data.rents[0].start_date).getMonth()).toBe(2);
    });

    it('should filter rentals by car_id', async () => {
        const response = await request(app)
            .get('/api/rentals/all')
            .set('Cookie', adminCookie)
            .query({
                car_id: car.id
            });

        expect(response.status).toBe(200);
        expect(response.body.data.rents.length).toBeGreaterThan(0);
        expect(response.body.data.rents.every(rental => rental.car_id === car.id)).toBe(true);
    });

    it('should handle multiple filters', async () => {
        const car2 = await prismaClient.car.create({
            data: {
                brand: "Honda",
                model: "Civic",
                year: 2022,
                transmission: "Automatic",
                capacity: 5,
                fuel_type: "Bensin",
                price_per_day: 400000,
                description: "Mobil sedan mewah",
                mileage: 5000
            }
        });

        await prismaClient.rental.create({
            data: {
                car_id: car2.id,
                user_id: userId,
                start_date: new Date('2025-03-10'),
                end_date: new Date('2025-03-15'),
                status: 'PENDING',
                driver_needed: false,
                total_price: 400000 * 5
            }
        });

        const response = await request(app)
            .get('/api/rentals/all')
            .set('Cookie', adminCookie)
            .query({
                status: 'PENDING',
                car_id: car.id
            });

        expect(response.status).toBe(200);
        expect(response.body.data.rents).toHaveLength(1);
        expect(response.body.data.rents[0].status).toBe('PENDING');
        expect(response.body.data.rents[0].car_id).toBe(car.id);
    });

    it('should return 401 when not authenticated as admin', async () => {
        const response = await request(app)
            .get('/api/rentals/all')
            .set('Cookie', userCookie);

        expect(response.status).toBe(401);
    });

    it('should return empty array when no rentals match filter', async () => {
        const response = await request(app)
            .get('/api/rentals/all')
            .set('Cookie', adminCookie)
            .query({
                status: 'COMPLETED'
            });

        expect(response.status).toBe(200);
        expect(response.body.data.rents).toHaveLength(0);
        expect(response.body.data.pagination.total_data).toBe(0);
    });
});

describe('GET /api/rentals/me', () => {
    let adminCookie;
    let userCookie;
    let car1;
    let car2;
    let userId;

    beforeAll(async () => {
        await setupTestDb();
    });

    beforeEach(async () => {
        await redisClient.flushAll();
        adminCookie = await registerAdmin();
        userCookie = await registerUser();

        const user = await prismaClient.user.findUnique({
            where: {
                email: "user@test.com"
            }
        });
        userId = user.id;

        car1 = await prismaClient.car.create({
            data: {
                brand: validCarData.brand,
                model: validCarData.model,
                year: validCarData.year,
                transmission: validCarData.transmission,
                capacity: validCarData.capacity,
                fuel_type: validCarData.fuel_type,
                price_per_day: validCarData.price_per_day,
                description: validCarData.description,
                mileage: validCarData.mileage
            }
        });

        car2 = await prismaClient.car.create({
            data: {
                brand: "Honda",
                model: "Civic",
                year: 2022,
                transmission: "Automatic",
                capacity: 5,
                fuel_type: "Bensin",
                price_per_day: 400000,
                description: "Mobil sedan mewah",
                mileage: 5000
            }
        });

        await prismaClient.rental.createMany({
            data: [
                {
                    car_id: car1.id,
                    user_id: userId,
                    start_date: new Date('2025-03-01'),
                    end_date: new Date('2025-03-02'),
                    status: 'PENDING',
                    driver_needed: false,
                    total_price: validCarData.price_per_day
                },
                {
                    car_id: car2.id,
                    user_id: userId,
                    start_date: new Date('2025-04-01'),
                    end_date: new Date('2025-04-05'),
                    status: 'CONFIRMED',
                    driver_needed: true,
                    driver_fee: 150000 * 4,
                    total_price: (400000 * 4) + (150000 * 4)
                }
            ]
        });

        const admin = await prismaClient.user.findUnique({
            where: {
                email: "admin@test.com"
            }
        });

        await prismaClient.rental.create({
            data: {
                car_id: car1.id,
                user_id: admin.id,
                start_date: new Date('2025-05-01'),
                end_date: new Date('2025-05-05'),
                status: 'PENDING',
                driver_needed: false,
                total_price: validCarData.price_per_day * 4
            }
        });
    });

    afterEach(async () => {
        await prismaClient.rental.deleteMany();
        await setupTestDb();
        await removeTestUser();
    });

    afterAll(async () => {
        await setupTestDb();
        await prismaClient.$disconnect();
    });

    it('should get all rentals for logged in user with pagination', async () => {
        const response = await request(app)
            .get('/api/rentals/me')
            .set('Cookie', userCookie)
            .query({
                page: 1,
                limit: 10
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Berhasil!');
        expect(response.body.data.rents).toHaveLength(2);
        expect(response.body.data.pagination).toEqual({
            page: 1,
            limit: 10,
            total_data: 2,
            total_page: 1
        });

        const rentals = response.body.data.rents;
        expect(rentals.every(rental => rental.user_id === userId)).toBe(true);
    });

    it('should filter rentals by status', async () => {
        const response = await request(app)
            .get('/api/rentals/me')
            .set('Cookie', userCookie)
            .query({
                status: 'PENDING'
            });

        expect(response.status).toBe(200);
        expect(response.body.data.rents).toHaveLength(1);
        expect(response.body.data.rents[0].status).toBe('PENDING');
        expect(response.body.data.rents[0].user_id).toBe(userId);
    });

    it('should filter rentals by date range', async () => {
        const response = await request(app)
            .get('/api/rentals/me')
            .set('Cookie', userCookie)
            .query({
                start_date: '2025-03-01',
                end_date: '2025-03-31'
            });

        expect(response.status).toBe(200);
        expect(response.body.data.rents).toHaveLength(1);
        expect(new Date(response.body.data.rents[0].start_date).getMonth()).toBe(2);
        expect(response.body.data.rents[0].user_id).toBe(userId);
    });

    it('should filter rentals by car_id', async () => {
        const response = await request(app)
            .get('/api/rentals/me')
            .set('Cookie', userCookie)
            .query({
                car_id: car1.id
            });

        expect(response.status).toBe(200);
        expect(response.body.data.rents).toHaveLength(1);
        expect(response.body.data.rents[0].car_id).toBe(car1.id);
        expect(response.body.data.rents[0].user_id).toBe(userId);
    });

    it('should handle multiple filters', async () => {
        await prismaClient.rental.create({
            data: {
                car_id: car2.id,
                user_id: userId,
                start_date: new Date('2025-03-10'),
                end_date: new Date('2025-03-15'),
                status: 'PENDING',
                driver_needed: false,
                total_price: 400000 * 5
            }
        });

        const response = await request(app)
            .get('/api/rentals/me')
            .set('Cookie', userCookie)
            .query({
                status: 'PENDING',
                car_id: car1.id
            });

        expect(response.status).toBe(200);
        expect(response.body.data.rents).toHaveLength(1);
        expect(response.body.data.rents[0].status).toBe('PENDING');
        expect(response.body.data.rents[0].car_id).toBe(car1.id);
        expect(response.body.data.rents[0].user_id).toBe(userId);
    });

    it('should return 401 when not authenticated', async () => {
        const response = await request(app)
            .get('/api/rentals/me');

        expect(response.status).toBe(401);
    });

    it('should return empty array when no rentals match filter', async () => {
        const response = await request(app)
            .get('/api/rentals/me')
            .set('Cookie', userCookie)
            .query({
                status: 'COMPLETED'
            });

        expect(response.status).toBe(200);
        expect(response.body.data.rents).toHaveLength(0);
        expect(response.body.data.pagination.total_data).toBe(0);
    });

    it('should include associated car information', async () => {
        const response = await request(app)
            .get('/api/rentals/me')
            .set('Cookie', userCookie);

        expect(response.status).toBe(200);

        const rental = response.body.data.rents[0];
        expect(rental.car).toBeDefined();
        expect(rental.car).toHaveProperty('brand');
        expect(rental.car).toHaveProperty('model');
        expect(rental.car).toHaveProperty('year');
        expect(rental.car).toHaveProperty('transmission');
        expect(rental.car).toHaveProperty('capacity');
    });

    it('should honor pagination parameters', async () => {
        for (let i = 0; i < 10; i++) {
            await prismaClient.rental.create({
                data: {
                    car_id: i % 2 === 0 ? car1.id : car2.id,
                    user_id: userId,
                    start_date: new Date(`2025-05-${i+1}`),
                    end_date: new Date(`2025-05-${i+5}`),
                    status: 'PENDING',
                    driver_needed: false,
                    total_price: validCarData.price_per_day * 4
                }
            });
        }

        const page1Response = await request(app)
            .get('/api/rentals/me')
            .set('Cookie', userCookie)
            .query({
                page: 1,
                limit: 5
            });

        expect(page1Response.status).toBe(200);
        expect(page1Response.body.data.rents).toHaveLength(5);
        expect(page1Response.body.data.pagination).toEqual({
            page: 1,
            limit: 5,
            total_data: 12,
            total_page: 3
        });

        const page2Response = await request(app)
            .get('/api/rentals/me')
            .set('Cookie', userCookie)
            .query({
                page: 2,
                limit: 5
            });

        expect(page2Response.status).toBe(200);
        expect(page2Response.body.data.rents).toHaveLength(5);
        expect(page2Response.body.data.pagination.page).toBe(2);
    });
});

describe('GET /api/rentals/detail/:id', () => {
    let userCookie;
    let car;
    let userId;
    let rentalId;

    beforeAll(async () => {
        await setupTestDb();
    });

    beforeEach(async () => {
        await redisClient.flushAll();
        userCookie = await registerUser();

        car = await prismaClient.car.create({
            data: {
                brand: validCarData.brand,
                model: validCarData.model,
                year: validCarData.year,
                transmission: validCarData.transmission,
                capacity: validCarData.capacity,
                fuel_type: validCarData.fuel_type,
                price_per_day: validCarData.price_per_day,
                description: validCarData.description,
                mileage: validCarData.mileage
            }
        });

        const user = await prismaClient.user.findUnique({
            where: { email: 'user@test.com' }
        })

        userId = user.id;
        const rental = await prismaClient.rental.create({
            data: {
                car_id: car.id,
                user_id: userId,
                start_date: new Date('2025-03-01'),
                end_date: new Date('2025-03-05'),
                status: 'PENDING',
                driver_needed: true,
                driver_fee: 150000 * 4,
                total_price: (validCarData.price_per_day * 4) + (150000 * 4)
            }
        });

        rentalId = rental.id;
    });

    afterEach(async () => {
        await prismaClient.rental.deleteMany();
        await setupTestDb();
        await removeTestUser();
    });

    afterAll(async () => {
        await setupTestDb();
        await prismaClient.$disconnect();
    });

    it('should get rental detail by id for authorized user', async () => {
        const response = await request(app)
            .get(`/api/rentals/detail/${rentalId}`)
            .set('Cookie', userCookie);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Berhasil!');
        expect(response.body.data).toHaveProperty('id', rentalId);
        expect(response.body.data).toHaveProperty('car_id', car.id);
        expect(response.body.data).toHaveProperty('user_id', userId);
        expect(response.body.data).toHaveProperty('status', 'PENDING');
        expect(response.body.data).toHaveProperty('driver_needed', true);
        expect(response.body.data).toHaveProperty('driver_fee');
        expect(response.body.data).toHaveProperty('total_price');
        expect(response.body.data).toHaveProperty('car');
        expect(response.body.data).toHaveProperty('user');
    });

    it('should return 401 when not authenticated', async () => {
        const response = await request(app)
            .get(`/api/rentals/detail/${rentalId}`);

        expect(response.status).toBe(401);
    });

    it('should include car details in the response', async () => {
        const response = await request(app)
            .get(`/api/rentals/detail/${rentalId}`)
            .set('Cookie', userCookie);

        expect(response.status).toBe(200);
        expect(response.body.data.car).toBeDefined();
        expect(response.body.data.car).toHaveProperty('id', car.id);
        expect(response.body.data.car).toHaveProperty('brand', car.brand);
        expect(response.body.data.car).toHaveProperty('model', car.model);
        expect(response.body.data.car).toHaveProperty('year', car.year);
        expect(response.body.data.car).toHaveProperty('transmission', car.transmission);
        expect(response.body.data.car).toHaveProperty('capacity', car.capacity);
    });

    it('should include user details in the response', async () => {
        const response = await request(app)
            .get(`/api/rentals/detail/${rentalId}`)
            .set('Cookie', userCookie);

        expect(response.status).toBe(200);
        expect(response.body.data.user).toBeDefined();
        expect(response.body.data.user).toHaveProperty('id', userId);
        expect(response.body.data.user).toHaveProperty('email');
        expect(response.body.data.user).toHaveProperty('full_name');
        expect(response.body.data.user).toHaveProperty('address');
        expect(response.body.data.user).toHaveProperty('phone');
        expect(response.body.data.user).not.toHaveProperty('password');
    });
});

describe('PUT /api/rentals/:id', () => {
    let userCookie;
    let adminCookie;
    let rentalId;
    let otherUserRentalId;
    let userId;
    let car;

    beforeAll(async () => {
        await setupTestDb();
    });

    beforeEach(async () => {
        await redisClient.flushAll();
        adminCookie = await registerAdmin();
        userCookie = await registerUser();

        const user = await prismaClient.user.findUnique({
            where: {
                email: "user@test.com"
            }
        });
        userId = user.id;

        const admin = await prismaClient.user.findUnique({
            where: {
                email: "admin@test.com"
            }
        });

        car = await prismaClient.car.create({
            data: {
                brand: validCarData.brand,
                model: validCarData.model,
                year: validCarData.year,
                transmission: validCarData.transmission,
                capacity: validCarData.capacity,
                fuel_type: validCarData.fuel_type,
                price_per_day: validCarData.price_per_day,
                description: validCarData.description,
                mileage: validCarData.mileage
            }
        });

        const userRental = await prismaClient.rental.create({
            data: {
                car_id: car.id,
                user_id: userId,
                start_date: new Date('2025-03-01'),
                end_date: new Date('2025-03-02'),
                status: 'PENDING',
                driver_needed: false,
                total_price: validCarData.price_per_day
            }
        });
        rentalId = userRental.id;

        const otherUserRental = await prismaClient.rental.create({
            data: {
                car_id: car.id,
                user_id: admin.id,
                start_date: new Date('2025-04-01'),
                end_date: new Date('2025-04-05'),
                status: 'CONFIRMED',
                driver_needed: true,
                driver_fee: 150000 * 4,
                total_price: (validCarData.price_per_day * 4) + (150000 * 4)
            }
        });
        otherUserRentalId = otherUserRental.id;
    });

    afterEach(async () => {
        await prismaClient.rental.deleteMany();
        await setupTestDb();
        await removeTestUser();
    });

    afterAll(async () => {
        await setupTestDb();
        await prismaClient.$disconnect();
    });

    it('should update rental successfully', async () => {
        const updateData = {
            start_date: '2025-03-05',
            end_date: '2025-03-10',
            driver_needed: true
        };

        const response = await request(app)
            .put(`/api/rentals/${rentalId}`)
            .set('Cookie', userCookie)
            .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Berhasil!');
        expect(response.body.data.id).toBe(rentalId);
        expect(new Date(response.body.data.start_date).toISOString().split('T')[0]).toBe('2025-03-05');
        expect(new Date(response.body.data.end_date).toISOString().split('T')[0]).toBe('2025-03-10');
        expect(response.body.data.driver_needed).toBe(true);
        expect(response.body.data.driver_fee).toBeDefined();
        expect(response.body.data.driver_fee).toBeGreaterThan(0);
    });

    it('should calculate correct new price after update', async () => {
        const updateData = {
            start_date: '2025-03-05',
            end_date: '2025-03-10',
            driver_needed: true
        };

        const response = await request(app)
            .put(`/api/rentals/${rentalId}`)
            .set('Cookie', userCookie)
            .send(updateData);

        expect(response.status).toBe(200);

        const daysRent = 5;
        const expectedCarPrice = daysRent * validCarData.price_per_day;
        const expectedDriverFee = daysRent * 150000;
        const expectedTotal = expectedCarPrice + expectedDriverFee;

        expect(response.body.data.total_price).toBe(expectedTotal);
        expect(response.body.data.driver_fee).toBe(expectedDriverFee);
    });

    it('should change status to PENDING if price increases', async () => {
        const updateData = {
            start_date: '2025-03-01',
            end_date: '2025-03-05',
            driver_needed: false
        };

        const response = await request(app)
            .put(`/api/rentals/${rentalId}`)
            .set('Cookie', userCookie)
            .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body.data.status).toBe('PENDING');
        expect(response.body.data.total_price).toBeGreaterThan(validCarData.price_per_day);
    });

    it('should not change status if price decreases', async () => {
        await request(app)
            .put(`/api/rentals/${rentalId}`)
            .set('Cookie', userCookie)
            .send({
                start_date: '2025-03-01',
                end_date: '2025-03-05',
                driver_needed: false
            });

        const response = await request(app)
            .put(`/api/rentals/${rentalId}`)
            .set('Cookie', userCookie)
            .send({
                start_date: '2025-03-01',
                end_date: '2025-03-02',
                driver_needed: false
            });

        expect(response.status).toBe(200);
        expect(response.body.data.total_price).toBe(validCarData.price_per_day);
    });

    it('should return 401 when user tries to update other user rental', async () => {
        const updateData = {
            start_date: '2025-04-10',
            end_date: '2025-04-15',
            driver_needed: false
        };

        const response = await request(app)
            .put(`/api/rentals/${otherUserRentalId}`)
            .set('Cookie', userCookie)
            .send(updateData);

        expect(response.status).toBe(401);
    });

    it('should return 400 when validation fails', async () => {
        const invalidData = {
            start_date: 'invalid-date',
            end_date: '2025-03-10'
        };

        const response = await request(app)
            .put(`/api/rentals/${rentalId}`)
            .set('Cookie', userCookie)
            .send(invalidData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 when end date is before start date', async () => {
        const invalidData = {
            start_date: '2025-03-10',
            end_date: '2025-03-05'
        };

        const response = await request(app)
            .put(`/api/rentals/${rentalId}`)
            .set('Cookie', userCookie)
            .send(invalidData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 when rental ID is not found', async () => {
        const updateData = {
            start_date: '2025-03-05',
            end_date: '2025-03-10'
        };

        const response = await request(app)
            .put('/api/rentals/99999')
            .set('Cookie', userCookie)
            .send(updateData);

        expect(response.status).toBe(400);
    });

    it('should return 401 when not authenticated', async () => {
        const updateData = {
            start_date: '2025-03-05',
            end_date: '2025-03-10'
        };

        const response = await request(app)
            .put(`/api/rentals/${rentalId}`)
            .send(updateData);

        expect(response.status).toBe(401);
    });

    it('should add driver fee when adding driver', async () => {
        const updateData = {
            start_date: '2025-03-01',
            end_date: '2025-03-02',
            driver_needed: true
        };

        const response = await request(app)
            .put(`/api/rentals/${rentalId}`)
            .set('Cookie', userCookie)
            .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body.data.driver_needed).toBe(true);
        expect(response.body.data.driver_fee).toBe(150000);
        expect(response.body.data.total_price).toBe(validCarData.price_per_day + 150000);
    });

    it('should remove driver fee when removing driver', async () => {
        await request(app)
            .put(`/api/rentals/${rentalId}`)
            .set('Cookie', userCookie)
            .send({
                start_date: '2025-03-01',
                end_date: '2025-03-02',
                driver_needed: true
            });

        const response = await request(app)
            .put(`/api/rentals/${rentalId}`)
            .set('Cookie', userCookie)
            .send({
                start_date: '2025-03-01',
                end_date: '2025-03-02',
                driver_needed: false
            });

        expect(response.status).toBe(200);
        expect(response.body.data.driver_needed).toBe(false);
        expect(response.body.data.driver_fee).toBeNull();
        expect(response.body.data.total_price).toBe(validCarData.price_per_day);
    });
});

describe('PATCH /api/rentals/:id', () => {
    let userCookie;
    let adminCookie;
    let pendingRentalId;
    let confirmedRentalId;
    let activeRentalId;
    let car;

    beforeAll(async () => {
        await setupTestDb();
    });

    beforeEach(async () => {
        adminCookie = await registerAdmin();
        userCookie = await registerUser();

        const user = await prismaClient.user.findUnique({
            where: {
                email: "user@test.com"
            }
        });

        car = await prismaClient.car.create({
            data: {
                brand: validCarData.brand,
                model: validCarData.model,
                year: validCarData.year,
                transmission: validCarData.transmission,
                capacity: validCarData.capacity,
                fuel_type: validCarData.fuel_type,
                price_per_day: validCarData.price_per_day,
                description: validCarData.description,
                mileage: validCarData.mileage
            }
        });

        const pendingRental = await prismaClient.rental.create({
            data: {
                car_id: car.id,
                user_id: user.id,
                start_date: new Date('2025-03-01'),
                end_date: new Date('2025-03-02'),
                status: 'PENDING',
                driver_needed: false,
                total_price: validCarData.price_per_day
            }
        });
        pendingRentalId = pendingRental.id;

        const confirmedRental = await prismaClient.rental.create({
            data: {
                car_id: car.id,
                user_id: user.id,
                start_date: new Date('2025-04-01'),
                end_date: new Date('2025-04-05'),
                status: 'CONFIRMED',
                driver_needed: true,
                driver_fee: 150000 * 4,
                total_price: (validCarData.price_per_day * 4) + (150000 * 4)
            }
        });
        confirmedRentalId = confirmedRental.id;

        const activeRental = await prismaClient.rental.create({
            data: {
                car_id: car.id,
                user_id: user.id,
                start_date: new Date('2025-05-01'),
                end_date: new Date('2025-05-05'),
                status: 'ACTIVE',
                driver_needed: false,
                total_price: validCarData.price_per_day * 4
            }
        });
        activeRentalId = activeRental.id;
    });

    afterEach(async () => {
        await prismaClient.rental.deleteMany();
        await setupTestDb();
        await removeTestUser();
    });

    afterAll(async () => {
        await setupTestDb();
        await prismaClient.$disconnect();
    });

    it('should update pending rental status to confirmed', async () => {
        const updateData = {
            status: 'CONFIRMED'
        };

        const response = await request(app)
            .patch(`/api/rentals/${pendingRentalId}`)
            .set('Cookie', adminCookie)
            .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Berhasil!');
        expect(response.body.data.id).toBe(pendingRentalId);
        expect(response.body.data.status).toBe('CONFIRMED');
    });

    it('should update confirmed rental status to active', async () => {
        const updateData = {
            status: 'ACTIVE'
        };

        const response = await request(app)
            .patch(`/api/rentals/${confirmedRentalId}`)
            .set('Cookie', adminCookie)
            .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body.data.status).toBe('ACTIVE');
    });

    it('should update active rental status to completed', async () => {
        const updateData = {
            status: 'COMPLETED'
        };

        const response = await request(app)
            .patch(`/api/rentals/${activeRentalId}`)
            .set('Cookie', adminCookie)
            .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body.data.status).toBe('COMPLETED');
    });

    it('should update rental status to cancelled from any valid status', async () => {
        const updateData = {
            status: 'CANCELLED'
        };

        const pendingResponse = await request(app)
            .patch(`/api/rentals/${pendingRentalId}`)
            .set('Cookie', adminCookie)
            .send(updateData);

        expect(pendingResponse.status).toBe(200);
        expect(pendingResponse.body.data.status).toBe('CANCELLED');

        const confirmedResponse = await request(app)
            .patch(`/api/rentals/${confirmedRentalId}`)
            .set('Cookie', adminCookie)
            .send(updateData);

        expect(confirmedResponse.status).toBe(200);
        expect(confirmedResponse.body.data.status).toBe('CANCELLED');

        const activeResponse = await request(app)
            .patch(`/api/rentals/${activeRentalId}`)
            .set('Cookie', adminCookie)
            .send(updateData);

        expect(activeResponse.status).toBe(200);
        expect(activeResponse.body.data.status).toBe('CANCELLED');
    });

    it('should return 400 when trying invalid status transition', async () => {
        const updateData = {
            status: 'COMPLETED'
        };

        const response = await request(app)
            .patch(`/api/rentals/${pendingRentalId}`)
            .set('Cookie', adminCookie)
            .send(updateData);

        expect(response.status).toBe(400);
        expect(response.body.errors).toBe('Status tidak valid!');
    });

    it('should return 400 when status is missing', async () => {

        const response = await request(app)
            .patch(`/api/rentals/${pendingRentalId}`)
            .set('Cookie', adminCookie)

        expect(response.status).toBe(400);
        expect(response.body.errors).toBe("Update status dibutuhkan!")
    });

    it('should return 400 when rental ID does not exist', async () => {
        const updateData = {
            status: 'CONFIRMED'
        };

        const response = await request(app)
            .patch('/api/rentals/99999')
            .set('Cookie', adminCookie)
            .send(updateData);

        expect(response.status).toBe(400);
        expect(response.body.errors).toBe("Rental ID tidak valid!");
    });

    it('should return 401 when user is not admin', async () => {
        const updateData = {
            status: 'CONFIRMED'
        };

        const response = await request(app)
            .patch(`/api/rentals/${pendingRentalId}`)
            .set('Cookie', userCookie)
            .send(updateData);

        expect(response.status).toBe(401);
    });

    it('should return 401 when not authenticated', async () => {
        const updateData = {
            status: 'CONFIRMED'
        };

        const response = await request(app)
            .patch(`/api/rentals/${pendingRentalId}`)
            .send(updateData);

        expect(response.status).toBe(401);
    });

    it('should not allow updating already completed rental', async () => {
        await request(app)
            .patch(`/api/rentals/${activeRentalId}`)
            .set('Cookie', adminCookie)
            .send({ status: 'COMPLETED' });

        const updateData = {
            status: 'CANCELLED'
        };

        const response = await request(app)
            .patch(`/api/rentals/${activeRentalId}`)
            .set('Cookie', adminCookie)
            .send(updateData);

        expect(response.status).toBe(400);
        expect(response.body.errors).toBe('Status tidak valid!');
    });

    it('should not allow updating already cancelled rental', async () => {
        await request(app)
            .patch(`/api/rentals/${pendingRentalId}`)
            .set('Cookie', adminCookie)
            .send({ status: 'CANCELLED' });

        const updateData = {
            status: 'CONFIRMED'
        };

        const response = await request(app)
            .patch(`/api/rentals/${pendingRentalId}`)
            .set('Cookie', adminCookie)
            .send(updateData);

        expect(response.status).toBe(400);
        expect(response.body.errors).toBe('Status tidak valid!');
    });
});

describe('GET /api/rentals/:id/booked-dates', () => {
    let car1Id;
    let car2Id;

    beforeAll(async () => {
        await setupTestDb();
    });

    beforeEach(async () => {
        await registerUser();

        const user = await prismaClient.user.findUnique({
            where: {
                email: "user@test.com"
            }
        });

        const car1 = await prismaClient.car.create({
            data: {
                brand: validCarData.brand,
                model: validCarData.model,
                year: validCarData.year,
                transmission: validCarData.transmission,
                capacity: validCarData.capacity,
                fuel_type: validCarData.fuel_type,
                price_per_day: validCarData.price_per_day,
                description: validCarData.description,
                mileage: validCarData.mileage
            }
        });
        car1Id = car1.id;

        const car2 = await prismaClient.car.create({
            data: {
                brand: "Honda",
                model: "Civic",
                year: 2022,
                transmission: "Automatic",
                capacity: 5,
                fuel_type: "Bensin",
                price_per_day: 400000,
                description: "Mobil sedan mewah",
                mileage: 5000
            }
        });
        car2Id = car2.id;

        await prismaClient.rental.createMany({
            data: [
                {
                    car_id: car1Id,
                    user_id: user.id,
                    start_date: new Date('2025-03-01'),
                    end_date: new Date('2025-03-05'),
                    status: 'CONFIRMED',
                    driver_needed: false,
                    total_price: validCarData.price_per_day * 4
                },
                {
                    car_id: car1Id,
                    user_id: user.id,
                    start_date: new Date('2025-03-10'),
                    end_date: new Date('2025-03-15'),
                    status: 'CONFIRMED',
                    driver_needed: true,
                    driver_fee: 150000 * 5,
                    total_price: (validCarData.price_per_day * 5) + (150000 * 5)
                },
                {
                    car_id: car1Id,
                    user_id: user.id,
                    start_date: new Date('2025-03-20'),
                    end_date: new Date('2025-03-25'),
                    status: 'CANCELLED',
                    driver_needed: false,
                    total_price: validCarData.price_per_day * 5
                }
            ]
        });

        await prismaClient.rental.create({
            data: {
                car_id: car2Id,
                user_id: user.id,
                start_date: new Date('2025-04-01'),
                end_date: new Date('2025-04-05'),
                status: 'CONFIRMED',
                driver_needed: false,
                total_price: 400000 * 4
            }
        });
    });

    afterEach(async () => {
        await prismaClient.rental.deleteMany();
        await setupTestDb();
        await removeTestUser();
    });

    afterAll(async () => {
        await setupTestDb();
        await prismaClient.$disconnect();
    });

    it('should get booked dates for a specific car', async () => {
        const response = await request(app)
            .get(`/api/rentals/${car1Id}/booked-dates`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Berhasil!');

        expect(response.body.data).toBeDefined();
        expect(Array.isArray(response.body.data)).toBe(true);

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        expect(response.body.data.every(date => dateRegex.test(date))).toBe(true);

        expect(response.body.data).toContain('2025-03-01');
        expect(response.body.data).toContain('2025-03-05');
        expect(response.body.data).toContain('2025-03-10');
        expect(response.body.data).toContain('2025-03-15');

        expect(response.body.data).not.toContain('2025-03-20');
        expect(response.body.data).not.toContain('2025-03-25');
    });

    it('should get different booked dates for another car', async () => {
        const response = await request(app)
            .get(`/api/rentals/${car2Id}/booked-dates`);

        expect(response.status).toBe(200);

        expect(response.body.data).toContain('2025-04-01');
        expect(response.body.data).toContain('2025-04-05');

        expect(response.body.data).not.toContain('2025-03-01');
        expect(response.body.data).not.toContain('2025-03-15');
    });

    it('should return empty array for car with no bookings', async () => {
        const newCar = await prismaClient.car.create({
            data: {
                brand: "Toyota",
                model: "Camry",
                year: 2023,
                transmission: "Automatic",
                capacity: 5,
                fuel_type: "Bensin",
                price_per_day: 500000,
                description: "Mobil mewah",
                mileage: 1000
            }
        });

        const response = await request(app)
            .get(`/api/rentals/${newCar.id}/booked-dates`);

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual([]);
    });

    it('should not require authentication', async () => {
        const response = await request(app)
            .get(`/api/rentals/${car1Id}/booked-dates`);

        expect(response.status).toBe(200);
    });

    it('should include all days between start and end dates inclusive', async () => {
        const response = await request(app)
            .get(`/api/rentals/${car1Id}/booked-dates`);

        expect(response.status).toBe(200);

        expect(response.body.data).toContain('2025-03-01');
        expect(response.body.data).toContain('2025-03-02');
        expect(response.body.data).toContain('2025-03-03');
        expect(response.body.data).toContain('2025-03-04');
        expect(response.body.data).toContain('2025-03-05');

        expect(response.body.data).toContain('2025-03-10');
        expect(response.body.data).toContain('2025-03-11');
        expect(response.body.data).toContain('2025-03-12');
        expect(response.body.data).toContain('2025-03-13');
        expect(response.body.data).toContain('2025-03-14');
        expect(response.body.data).toContain('2025-03-15');
    });
});