import {app} from "../src/app.js";
import request from "supertest";
import {registerAdmin, removeTestUser, seedTestData} from "./utils/test.utils.js";
const { setupTestDb } = require('./utils/test.utils.js');
import { prismaClient } from "../src/config/database.config.js";
import { validCarData } from "./utils/mock.data.js";
import fs from "fs/promises";
import path from "path";

describe('Category API Endpoints', () => {
    let adminToken;

    beforeEach(async () => {
        await setupTestDb();
        adminToken = await registerAdmin()
    });

    afterEach(async () => {
        await removeTestUser()
        await setupTestDb();
    })

    describe('POST /api/cars/category', () => {
        it('should create a new category successfully', async () => {
            const response = await request(app)
                .post('/api/cars/category')
                .set('Cookie', adminToken)
                .send({
                    category_name: 'SUV'
                });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Berhasil!');
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data.category_name).toBe('SUV');
        });

        it('should return 400 when category name is missing', async () => {
            const response = await request(app)
                .post('/api/cars/category')
                .set('Cookie', adminToken)
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.errors).toBe('Nama kategori wajib diisi!');
        });
    });

    describe('GET /api/cars/category/all', () => {
        beforeEach(async () => {
            await prismaClient.category.deleteMany();

            await prismaClient.category.createMany({
                data: [
                    { category_name: 'Category 0' },
                    { category_name: 'Category 1' },
                    { category_name: 'Category 2' },
                    { category_name: 'Category 3' },
                    { category_name: 'Category 4' }
                ]
            });
        });

        it('should return all categories', async () => {
            const response = await request(app)
                .get('/api/cars/category/all');

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveLength(5);
        });
    });

    describe('GET /api/cars/category/:id', () => {
        let categoryId;

        beforeEach(async () => {
            const category = await prismaClient.category.create({
                data: { category_name: 'SUV' }
            });
            categoryId = category.id;
        });

        it('should return specific category', async () => {
            const response = await request(app)
                .get(`/api/cars/category/${categoryId}`);

            expect(response.status).toBe(200);
            expect(response.body.data.id).toBe(categoryId);
            expect(response.body.data.category_name).toBe('SUV');
        });
    });

    describe('PUT /api/cars/category/:id', () => {
        let categoryId;

        beforeEach(async () => {
            const category = await prismaClient.category.create({
                data: { category_name: 'SUV' }
            });
            categoryId = category.id;
        });

        it('should update category successfully', async () => {
            const response = await request(app)
                .put(`/api/cars/category/${categoryId}`)
                .set('Cookie', adminToken)
                .send({
                    category_name: 'MPV'
                });

            expect(response.status).toBe(200);
            expect(response.body.data.category_name).toBe('MPV');
        });

        it('should return 500 when category not found', async () => {
            const response = await request(app)
                .put('/api/cars/category/999')
                .set('Cookie', adminToken)
                .send({
                    category_name: 'MPV'
                });

            expect(response.status).toBe(500);
        });
    });

    describe('DELETE /api/cars/category/:id', () => {
        let categoryId;

        beforeEach(async () => {
            const category = await prismaClient.category.create({
                data: { category_name: 'SUV' }
            });
            categoryId = category.id;
        });

        it('should delete category successfully', async () => {
            const response = await request(app)
                .delete(`/api/cars/category/${categoryId}`)
                .set('Cookie', adminToken)

            expect(response.status).toBe(200);

            const deletedCategory = await prismaClient.category.findUnique({
                where: { id: categoryId }
            });
            expect(deletedCategory).toBeNull();
        });
    });
});

describe('Feature API Endpoints', () => {
    let adminToken;

    beforeEach(async () => {
        await setupTestDb();
        adminToken = await registerAdmin()
    });

    afterEach(async () => {
        await removeTestUser()
        await setupTestDb();
    })

    describe('POST /api/cars/feature', () => {
        it('should create a new feature successfully', async () => {
            const response = await request(app)
                .post('/api/cars/feature')
                .set('Cookie', adminToken)
                .send({
                    feature_name: 'AC'
                });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Berhasil!');
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data.feature).toBe('AC');
        });

        it('should return 400 when feature name is missing', async () => {
            const response = await request(app)
                .post('/api/cars/feature')
                .set('Cookie', adminToken)
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.errors).toBe('Nama feature wajib diisi!');
        });
    });

    describe('GET /api/cars/feature/all', () => {
        beforeEach(async () => {
            await prismaClient.features.deleteMany();

            await prismaClient.features.createMany({
                data: [
                    { feature: 'AC' },
                    { feature: 'Power Steering' },
                    { feature: 'Electric Mirror' },
                    { feature: 'Central Lock' },
                    { feature: 'Parking Sensor' }
                ]
            });
        });

        it('should return all features', async () => {
            const response = await request(app)
                .get('/api/cars/feature/all');

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveLength(5);
        });
    });

    describe('GET /api/cars/feature/:id', () => {
        let featureId;

        beforeEach(async () => {
            const feature = await prismaClient.features.create({
                data: { feature: 'AC' }
            });
            featureId = feature.id;
        });

        it('should return specific feature', async () => {
            const response = await request(app)
                .get(`/api/cars/feature/${featureId}`);

            expect(response.status).toBe(200);
            expect(response.body.data.id).toBe(featureId);
            expect(response.body.data.feature).toBe('AC');
        });
    });

    describe('PUT /api/cars/feature/:id', () => {
        let featureId;

        beforeEach(async () => {
            const feature = await prismaClient.features.create({
                data: { feature: 'AC' }
            });
            featureId = feature.id;
        });

        it('should update feature successfully', async () => {
            const response = await request(app)
                .put(`/api/cars/feature/${featureId}`)
                .set('Cookie', adminToken)
                .send({
                    feature_name: 'Power Steering'
                });

            expect(response.status).toBe(200);
            expect(response.body.data.feature).toBe('Power Steering');
        });

        it('should return 500 when feature not found', async () => {
            const response = await request(app)
                .put('/api/cars/feature/999')
                .set('Cookie', adminToken)
                .send({
                    feature_name: 'Power Steering'
                });

            expect(response.status).toBe(500);
        });

        it('should return 400 when feature name is missing', async () => {
            const response = await request(app)
                .put(`/api/cars/feature/${featureId}`)
                .set('Cookie', adminToken)
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.errors).toBe('Nama feature wajib diisi!');
        });
    });

    describe('DELETE /api/cars/feature/:id', () => {
        let featureId;

        beforeEach(async () => {
            const feature = await prismaClient.features.create({
                data: { feature: 'AC' }
            });
            featureId = feature.id;
        });

        it('should delete feature successfully', async () => {
            const response = await request(app)
                .delete(`/api/cars/feature/${featureId}`)
                .set('Cookie', adminToken);

            expect(response.status).toBe(200);

            const deletedFeature = await prismaClient.features.findUnique({
                where: { id: featureId }
            });
            expect(deletedFeature).toBeNull();
        });

        it('should reject if role is not admin', async () => {
            const response = await request(app)
                .delete(`/api/cars/feature/${featureId}`)

            expect(response.status).toBe(401);
        });

        it('should reject if token wrong', async () => {
            const response = await request(app)
                .delete(`/api/cars/feature/${featureId}`)
                .set('Cookie', 'toke=worngtoken')

            expect(response.status).toBe(401);
        });
    });
});

describe('Car API Endpoints', () => {
    let adminToken;
    let categoryId;
    let featureId;
    let imageTestPath

    beforeEach(async () => {
        await setupTestDb();
        adminToken = await registerAdmin();
        const { category, feature } = await seedTestData();
        categoryId = category.id;
        featureId = feature.id;

        const uploadDir = '/uploads';
        await fs.mkdir(uploadDir, {recursive: true});
        const bufferFile = Buffer.from('test file');
        imageTestPath = path.join(uploadDir, 'test.png');
        await fs.writeFile(imageTestPath, bufferFile)
    });

    afterEach(async () => {
        await setupTestDb();
        await removeTestUser();
    });

    afterAll(async () => {
        await fs.rm('/uploads', { recursive: true, force: true });
    })

    describe('POST /api/cars', () => {
        it('should create a new car successfully', async () => {
            const response = await request(app)
                .post('/api/cars')
                .set('Cookie', adminToken)
                .field('brand', validCarData.brand)
                .field('model', validCarData.model)
                .field('year', validCarData.year)
                .field('transmission', validCarData.transmission)
                .field('capacity', validCarData.capacity)
                .field('fuel_type', validCarData.fuel_type)
                .field('price_per_day', validCarData.price_per_day)
                .field('description', validCarData.description)
                .field('mileage', validCarData.mileage)
                .field('categories', JSON.stringify([categoryId]))
                .field('features', JSON.stringify([featureId]))
                .attach('car', imageTestPath);

            expect(response.status).toBe(200);
            expect(response.body.messange).toBe('Berhasil!');
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data.brand).toBe(validCarData.brand);
            expect(response.body.data.images).toHaveLength(1);
            expect(response.body.data.categories).toHaveLength(1);
            expect(response.body.data.features).toHaveLength(1);
        });

        it('should return 400 when required fields are missing', async () => {
            const invalidData = { ...validCarData };
            delete invalidData.brand;
            delete invalidData.model;

            const response = await request(app)
                .post('/api/cars')
                .set('Cookie', adminToken)
                .field('year', invalidData.year)
                .field('transmission', invalidData.transmission)
                .attach('car', imageTestPath);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('errors');
        });

        it('should handle file cleanup when validation fails', async () => {
            const response = await request(app)
                .post('/api/cars')
                .set('Cookie', adminToken)
                .field('brand', '')
                .attach('car', imageTestPath);

            expect(response.status).toBe(400);

            const fileExists = await fs.access(imageTestPath)
                .then(() => true)
                .catch(() => false);
            expect(fileExists).toBe(true);
        });
    });

    describe('GET /api/cars', () => {
        beforeEach(async () => {
            await prismaClient.car.createMany({
                data: [
                    {
                        brand: 'Toyota',
                        model: 'Avanza',
                        year: 2022,
                        transmission: 'Automatic',
                        capacity: 7,
                        fuel_type: 'Bensin',
                        price_per_day: 300000,
                        description: 'Mobil Keluarga',
                        mileage: 1000
                    },
                    {
                        brand: 'Honda',
                        model: 'Civic',
                        year: 2023,
                        transmission: 'Manual',
                        capacity: 5,
                        fuel_type: 'Bensin',
                        price_per_day: 500000,
                        description: 'Mobil Sport',
                        mileage: 500
                    }
                ]
            });
        });

        it('should return paginated cars', async () => {
            const response = await request(app)
                .get('/api/cars')
                .query({
                    page: 1,
                    limit: 10
                });

            expect(response.status).toBe(200);
            expect(response.body.data.cars).toHaveLength(2);
            expect(response.body.data.pagination).toEqual({
                page: 1,
                limit: 10,
                total_data: 2,
                total_page: 1
            });
        });

        it('should filter cars by brand', async () => {
            const response = await request(app)
                .get('/api/cars')
                .query({
                    brand: 'Toyota'
                });

            expect(response.status).toBe(200);
            expect(response.body.data.cars).toHaveLength(1);
            expect(response.body.data.cars[0].brand).toBe('Toyota');
        });

        it('should filter cars by transmission', async () => {
            const response = await request(app)
                .get('/api/cars')
                .query({
                    transmission: 'Automatic'
                });

            expect(response.status).toBe(200);
            expect(response.body.data.cars).toHaveLength(1);
            expect(response.body.data.cars[0].transmission).toBe('Automatic');
        });

        it('should filter cars by fuel type', async () => {
            const response = await request(app)
                .get('/api/cars')
                .query({
                    fuel_type: 'Bensin'
                });

            expect(response.status).toBe(200);
            expect(response.body.data.cars.every(car => car.fuel_type === 'Bensin')).toBe(true);
        });

        it('should handle multiple filters', async () => {
            const response = await request(app)
                .get('/api/cars')
                .query({
                    brand: 'Toyota',
                    transmission: 'Automatic',
                    fuel_type: 'Bensin'
                });

            expect(response.status).toBe(200);
            expect(response.body.data.cars).toHaveLength(1);
            const car = response.body.data.cars[0];
            expect(car.brand).toBe('Toyota');
            expect(car.transmission).toBe('Automatic');
            expect(car.fuel_type).toBe('Bensin');
        });
    });

    describe('GET /api/cars/:id', () => {
        let carId;

        beforeEach(async () => {
            const car = await prismaClient.car.create({
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
            carId = car.id;

            await prismaClient.carImage.create({
                data: {
                    car_id: carId,
                    image_url: imageTestPath
                }
            });

            await prismaClient.categoryOnCars.create({
                data: {
                    car_id: carId,
                    category_id: categoryId
                }
            });

            await prismaClient.featureOnCars.create({
                data: {
                    car_id: carId,
                    feature_id: featureId
                }
            });
        });

        it('should return specific car with all relations', async () => {
            const response = await request(app)
                .get(`/api/cars/${carId}`);

            expect(response.status).toBe(200);
            expect(response.body.data.id).toBe(carId);
            expect(response.body.data.brand).toBe(validCarData.brand);
            expect(response.body.data.images).toHaveLength(1);
            expect(response.body.data.categories).toHaveLength(1);
            expect(response.body.data.features).toHaveLength(1);
        });
    });

    describe('PUT /api/cars/:id', () => {
        let carId;

        beforeEach(async () => {
            const car = await prismaClient.car.create({
                data: {
                    ...validCarData,
                    categories: undefined,
                    features: undefined
                }
            });
            carId = car.id;

            await prismaClient.carImage.create({
                data: {
                    car_id: carId,
                    image_url: imageTestPath
                }
            });
        });

        it('should update car successfully', async () => {
            const response = await request(app)
                .put(`/api/cars/${carId}`)
                .set('Cookie', adminToken)
                .field('brand', 'Honda')
                .field('model', 'Civic')
                .field('year', validCarData.year)
                .field('transmission', validCarData.transmission)
                .field('capacity', validCarData.capacity)
                .field('fuel_type', validCarData.fuel_type)
                .field('price_per_day', 500000)
                .field('description', validCarData.description)
                .field('mileage', validCarData.mileage)
                .field('categories', JSON.stringify([categoryId]))
                .field('features', JSON.stringify([featureId]))
                .attach('car', imageTestPath);

            expect(response.status).toBe(200);
            expect(response.body.data.brand).toBe('Honda');
            expect(response.body.data.model).toBe('Civic');
            expect(response.body.data.price_per_day).toBe(500000);
            expect(response.body.data.categories).toHaveLength(1);
            expect(response.body.data.features).toHaveLength(1);
        });

        it('should handle image deletion', async () => {
            const carImage = await prismaClient.carImage.create({
                data: {
                    car_id: carId,
                    image_url: 'uploads/test/old-image.jpg'
                }
            });

            const response = await request(app)
                .put(`/api/cars/${carId}`)
                .set('Cookie', adminToken)
                .field('deleted_image', JSON.stringify([carImage.id]))
                .field('brand', 'Honda')
                .field('model', 'Civic')
                .field('year', validCarData.year)
                .field('transmission', validCarData.transmission)
                .field('capacity', validCarData.capacity)
                .field('fuel_type', validCarData.fuel_type)
                .field('price_per_day', 500000)
                .field('description', validCarData.description)
                .field('mileage', validCarData.mileage)
                .field('categories', JSON.stringify([categoryId]))
                .field('features', JSON.stringify([featureId]))
                .attach('car', imageTestPath);

            expect(response.status).toBe(200);

            const deletedImage = await prismaClient.carImage.findUnique({
                where: { id: carImage.id }
            });
            expect(deletedImage).toBeNull();
        });

        it('should return 401 when not authenticated', async () => {
            const response = await request(app)
                .put(`/api/cars/${carId}`)
                .field('brand', 'Honda');

            expect(response.status).toBe(401);
        });
    });

    describe('DELETE /api/cars/:id', () => {
        let carId;

        beforeEach(async () => {
            const car = await prismaClient.car.create({
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
            carId = car.id;

            await prismaClient.carImage.create({
                data: {
                    car_id: carId,
                    image_url: imageTestPath
                }
            });

            await prismaClient.categoryOnCars.create({
                data: {
                    car_id: carId,
                    category_id: categoryId
                }
            });

            await prismaClient.featureOnCars.create({
                data: {
                    car_id: carId,
                    feature_id: featureId
                }
            });
        });

        it('should delete car and all relations successfully', async () => {
            const response = await request(app)
                .delete(`/api/cars/${carId}`)
                .set('Cookie', adminToken);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Berhasil!');

            const deletedCar = await prismaClient.car.findUnique({
                where: { id: carId }
            });
            expect(deletedCar).toBeNull();

            const carImages = await prismaClient.carImage.findMany({
                where: { car_id: carId }
            });
            expect(carImages).toHaveLength(0);

            const carCategories = await prismaClient.categoryOnCars.findMany({
                where: { car_id: carId }
            });
            expect(carCategories).toHaveLength(0);

            const carFeatures = await prismaClient.featureOnCars.findMany({
                where: { car_id: carId }
            });
            expect(carFeatures).toHaveLength(0);
        });

        it('should return 401 when not authenticated', async () => {
            const response = await request(app)
                .delete(`/api/cars/${carId}`);

            expect(response.status).toBe(401);
        });
    });
});