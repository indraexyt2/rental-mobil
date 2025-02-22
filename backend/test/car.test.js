import supertest from "supertest";
import {app} from "../src/app.js";
import {
    removeTestCarFeatures,
    removeTestCarImage,
    removeTestCars,
    removeTestCategory,
    removeTestUser
} from "./test.utils.js";
import fs from "fs/promises";
import path from "path";
import * as http from "node:http";

describe("POST /api/cars", () => {
    let adminCookie;
    let userCookie;
    let imageTest;

    const userData = {
        brand: 'Toyota',
        model: 'Camry',
        year: 2022,
        transmission: 'Automatic',
        capacity: 5,
        fuel_type: 'Bensin',
        price_per_day: 500000,
        description: 'Lorem ipsum dolor sit amet',
        mileage: 10000,
        features: JSON.stringify(['AC', 'GPS']),
        category: JSON.stringify(['Sedan']),
    };

    beforeAll(async () => {
        const uploadDir = 'uploads/test';
        await fs.mkdir(uploadDir, {recursive: true});
        imageTest = path.join(uploadDir, 'test.png');
        const imageBuffer = Buffer.from("Buffer test");
        await fs.writeFile(imageTest, imageBuffer)
    })

    beforeEach(async () => {
        let response = await supertest(app)
            .post('/api/users/register')
            .send({
                "email": "admin@test.com",
                "password": "rahasiasekalia",
                "full_name": "Admin",
                "role": "ADMIN"
            });

        expect(response.status).toBe(200);
        expect(response.body.data.email).toBe("admin@test.com")

        response = await supertest(app)
            .post('/api/users/email-verification')
            .send({
                "token": response.body.data.token
            });

        adminCookie = response.header['set-cookie'];
        expect(response.status).toBe(200);
        expect(response.body.data.token).toBeDefined();

        let userResponse = await supertest(app)
            .post('/api/users/register')
            .send({
                "email": "user@test.com",
                "password": "rahasiasekalia",
                "full_name": "User",
                "role": "USER"
            });

        expect(userResponse.status).toBe(200);
        expect(userResponse.body.data.email).toBe("user@test.com");

        userResponse = await supertest(app)
            .post('/api/users/email-verification')
            .send({
                "token": userResponse.body.data.token
            });

        userCookie = userResponse.header['set-cookie'];
        expect(userResponse.status).toBe(200);
        expect(userResponse.body.data.token).toBeDefined();
    });

    afterEach(async () => {
        await removeTestUser();
        await removeTestCarImage();
        await removeTestCarFeatures();
        await removeTestCategory();
        await removeTestCars();
    });

    afterAll(async () => {
        await fs.rm('uploads/test', { recursive: true });
    });

    it('should can add new car', async() => {
       try {
           const agent = new http.Agent({
               keepAlive: true,
               maxSockets: Infinity,
               timeout: 10000,

           });

           const response = await supertest(app)
               .post('/api/cars')
               .type('form')
               .attach('car', imageTest)
               .field(userData)
               .agent(agent)
               .set('Cookie', adminCookie)

           expect(response.status).toBe(200);
           expect(response.body.data.brand).toEqual("Toyota");
           expect(response.body.data.model).toEqual("Camry");
       } catch (err) {
           throw err;
       }
    });

    it('should reject if role is not ADMIN', async () => {
        try {
            const response = await supertest(app)
                .post('/api/cars')
                .set('Cookie', userCookie)

            expect(response.status).toBe(401);
        } catch (err) {
            console.log(err)
        }
    });

    it('should reject when multiple required fields are empty', async () => {
        const invalidData = {
            brand: '',
            model: '',
            year: '',
            transmission: '',
            capacity: '',
            fuel_type: '',
            price_per_day: '',
            description: '',
            mileage: '',
            features: JSON.stringify([]),
            category: JSON.stringify([])
        };

        const response = await supertest(app)
            .post('/api/cars')
            .type('form')
            .attach('car', imageTest)
            .field(invalidData)
            .set('Cookie', adminCookie);

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();

        expect(response.body.errors).toContain('Brand tidak boleh kosong!');
        expect(response.body.errors).toContain('Model tidak boleh kosong!');
        expect(response.body.errors).toContain('Tahun harus berupa angka!');
        expect(response.body.errors).toContain('Transmission harus Manual atau Automatic!');
        expect(response.body.errors).toContain('Kapasitas harus berupa angka!');
        expect(response.body.errors).toContain('Fuel type harus Bensin, Solar, atau Listrik!');
        expect(response.body.errors).toContain('Harga harus berupa angka!');
        expect(response.body.errors).toContain('Deskripsi tidak boleh kosong!');
        expect(response.body.errors).toContain('Mileage harus berupa angka!');
        expect(response.body.errors).toContain('Minimal harus ada 1 fitur!');
        expect(response.body.errors).toContain('Category harus diisi!');
    });

})