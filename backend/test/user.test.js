import supertest from "supertest";
import {logger} from "../src/utils/logger.js";
import {app} from '../src/app'
import {removeTestUser} from "./test.utils";
import {redisClient} from "../src/config/redis.config.js";
import jwt from "jsonwebtoken";
import {response} from "express";
import fs from "fs/promises";
import path from "path";

describe('POST /api/users/register', () => {

    afterEach(async () => {
        await removeTestUser();
    })

    it('should can register new user', async () => {
        const result = await supertest(app)
            .post('/api/users/register')
            .send({
                "email": "test@example.com",
                "password": "rahasia",
                "full_name": "test"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.email).toBe("test@example.com");
        expect(result.body.data.full_name).toBe("test");
        expect(result.body.data.password).toBeUndefined();
    });

    it('should reject if request is invalid', async () => {
        const result = await supertest(app)
            .post('/api/users/register')
            .send({
                username: '',
                password: '',
                name: ''
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if username already registered', async () => {
        let result = await supertest(app)
            .post('/api/users/register')
            .send({
                "email": "test@example.com",
                "password": "rahasia",
                "full_name": "test"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.email).toBe("test@example.com");
        expect(result.body.data.full_name).toBe("test");
        expect(result.body.data.password).toBeUndefined();

        result = await supertest(app)
            .post('/api/users/register')
            .send({
                "email": "test@example.com",
                "password": "rahasia",
                "full_name": "test"
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});

describe('POST /api/users/email-verification', () => {
    afterEach(() => {
        removeTestUser();
    });

    it('should can be verify user email', async () => {
        const result = await supertest(app)
            .post('/api/users/register')
            .send({
                "email": "test@example.com",
                "password": "rahasia",
                "full_name": "test"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.email).toBe("test@example.com");
        expect(result.body.data.full_name).toBe("test");
        expect(result.body.password).toBeUndefined();

        const response = await supertest(app)
            .post('/api/users/email-verification')
            .send({
               "token": result.body.data.token
            });

        const cookies = response.headers['set-cookie'];
        expect(response.status).toBe(200);
        expect(cookies.some(cookie => cookie.includes('token'))).toBe(true);
        expect(response.body.message).toEqual("Berhasil!");
    });

    it('should reject if token undefined', async () => {
        const result = await supertest(app)
            .post('/api/users/register')
            .send({
                "email": "test@example.com",
                "password": "rahasia",
                "full_name": "test"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.email).toBe("test@example.com");
        expect(result.body.data.full_name).toBe("test");
        expect(result.body.password).toBeUndefined();

        const response = await supertest(app)
            .post('/api/users/email-verification')
            .send({
                "token": ''
            });

        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual("Token tidak boleh kosong!");
    });

    it('should reject if token wrong', async () => {
        const result = await supertest(app)
            .post('/api/users/register')
            .send({
                "email": "test@example.com",
                "password": "rahasia",
                "full_name": "test"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.email).toBe("test@example.com");
        expect(result.body.data.full_name).toBe("test");
        expect(result.body.password).toBeUndefined();

        const response = await supertest(app)
            .post('/api/users/email-verification')
            .send({
                "token": '555555'
            });

        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual("Token tidak valid!");
    });
});

describe('POST /api/users/login', () => {
    afterEach(() => {
        removeTestUser();
    });

    it('should be able to login', async () => {
        let response = await supertest(app)
            .post('/api/users/register')
            .send({
                "email": "test@example.com",
                "password": "rahasia",
                "full_name": "test"
            });

        expect(response.status).toBe(200);
        expect(response.body.data.email).toBe("test@example.com");
        expect(response.body.data.full_name).toBe("test");
        expect(response.body.data.password).toBeUndefined();

        response = await supertest(app)
            .post('/api/users/login')
            .send({
                "email": "test@example.com",
                "password": "rahasia"
            });

        const cookies = response.headers['set-cookie'];
        expect(cookies.some(cookie => cookie.includes('token')));
        expect(response.status).toBe(200);
        expect(response.body.data.token).toBeDefined();
    });

    it('should reject if email and password null', async () => {
        const response = await supertest(app)
            .post('/api/users/login')
            .send({
                "email": "",
                "password": ""
            });

        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual("Semua kolom wajib diisi!");
    });
});

describe('GET /api/users/refresh-token', () => {
    beforeEach(async () => {
        let response = await supertest(app)
            .post('/api/users/register')
            .send({
                "email": "test@example.com",
                "password": "rahasia",
                "full_name": "test"
            });

        expect(response.status).toBe(200);
        const verificationToken = response.body.data.token;

        response = await supertest(app)
            .post('/api/users/email-verification')
            .send({
                "token": verificationToken
            });

        expect(response.status).toBe(200);
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should successfully refresh token with valid token', async () => {
        let response = await supertest(app)
            .post('/api/users/login')
            .send({
                "email": "test@example.com",
                "password": "rahasia"
            });

        expect(response.status).toBe(200);
        const cookies = response.headers['set-cookie'];

        const result = await supertest(app)
            .get('/api/users/refresh-token')
            .set('Cookie', cookies);

        expect(result.status).toBe(200);
        expect(result.body.message).toBe("Berhasil!");
        expect(result.body.data.token).toBeDefined();
        expect(result.headers['set-cookie']).toBeDefined();
        expect(result.headers['set-cookie'].some(cookie => cookie.includes('token'))).toBe(true);
    });

    it('should reject if no token provided', async () => {
        const result = await supertest(app)
            .get('/api/users/refresh-token');

        expect(result.status).toBe(401);
        expect(result.body.errors).toBe("Unauthorized");
    });

    it('should reject if token is invalid', async () => {
        const result = await supertest(app)
            .get('/api/users/refresh-token')
            .set('Cookie', ['token=invalid.token.here']);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBe("Unauthorized");
    });

    it('should reject if user session is not found', async () => {
        let response = await supertest(app)
            .post('/api/users/login')
            .send({
                "email": "test@example.com",
                "password": "rahasia"
            });

        const cookies = response.headers['set-cookie'];
        const claimsToken = jwt.decode(response.body.data.token)

        await redisClient.del(`user:session:${claimsToken.id}`)

        const result = await supertest(app)
            .get('/api/users/refresh-token')
            .set('Cookie', cookies);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBe("Unauthorized");
    });
});

describe('DELETE /api/users/logout', () => {
    beforeEach(async () => {
        let response = await supertest(app)
            .post('/api/users/register')
            .send({
                "email": "test@example.com",
                "password": "rahasia",
                "full_name": "test"
            });

        expect(response.status).toBe(200);
        const verificationToken = response.body.data.token;

        response = await supertest(app)
            .post('/api/users/email-verification')
            .send({
                "token": verificationToken
            });

        expect(response.status).toBe(200);
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should successfully logout', async () => {
        let response = await supertest(app)
            .post('/api/users/login')
            .send({
                "email": "test@example.com",
                "password": "rahasia"
            });

        expect(response.status).toBe(200);
        const cookies = response.headers['set-cookie'];

        const result = await supertest(app)
            .delete('/api/users/logout')
            .set('Cookie', cookies);

        expect(result.status).toBe(200);
        expect(result.body.message).toBe("Logout berhasil!");
        expect(result.headers['set-cookie'][0]).toContain('token=;');

        const protectedResponse = await supertest(app)
            .get('/api/users/refresh-token')
            .set('Cookie', cookies);

        expect(protectedResponse.status).toBe(401);
        expect(protectedResponse.body.errors).toBe("Unauthorized");
    });

    it('should reject if no token provided', async () => {
        const result = await supertest(app)
            .delete('/api/users/logout');

        expect(result.status).toBe(401);
        expect(result.body.errors).toBe("Unauthorized");
    });

    it('should reject if token is invalid', async () => {
        const result = await supertest(app)
            .delete('/api/users/logout')
            .set('Cookie', ['token=invalid.token.here']);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBe("Unauthorized");
    });
});

describe('GET /api/users/:id', () => {
    let testUserId;
    let loginCookies;

    beforeEach(async () => {
        let response = await supertest(app)
            .post('/api/users/register')
            .send({
                "email": "test@example.com",
                "password": "rahasia",
                "full_name": "test"
            });

        expect(response.status).toBe(200);
        const verificationToken = response.body.data.token;

        response = await supertest(app)
            .post('/api/users/email-verification')
            .send({
                "token": verificationToken
            });

        expect(response.status).toBe(200);

        response = await supertest(app)
            .post('/api/users/login')
            .send({
                "email": "test@example.com",
                "password": "rahasia"
            });

        expect(response.status).toBe(200);
        loginCookies = response.headers['set-cookie'];
        testUserId = response.body.data.id;
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should successfully get user by id', async () => {
        const result = await supertest(app)
            .get(`/api/users/${testUserId}`)
            .set('Cookie', loginCookies);

        expect(result.status).toBe(200);
        expect(result.body.message).toBe("Berhasil!");
        expect(result.body.data).toBeDefined();
        expect(result.body.data.id).toBe(testUserId);
        expect(result.body.data.email).toBe("test@example.com");
        expect(result.body.data.full_name).toBe("test");
        expect(result.body.data.password).toBeUndefined();
        expect(result.body.data.role).toBeDefined();
        expect(result.body.data.rentals).toBeDefined();
    });

    it('should reject if no token provided', async () => {
        const result = await supertest(app)
            .get(`/api/users/${testUserId}`);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBe("Unauthorized");
    });

    it('should reject if token is invalid', async () => {
        const result = await supertest(app)
            .get(`/api/users/${testUserId}`)
            .set('Cookie', ['token=invalid.token.here']);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBe("Unauthorized");
    });

    it('should reject if user id is not found', async () => {
        const result = await supertest(app)
            .get('/api/users/999999')
            .set('Cookie', loginCookies);

        expect(result.status).toBe(200);
        expect(result.body.data).toBe(null);
    });
});

describe('GET /api/users', () => {
    let adminCookies;
    let userCookies;

    beforeEach(async () => {
        let response = await supertest(app)
            .post('/api/users/register')
            .send({
                "email": "admin@test.com",
                "password": "rahasia",
                "full_name": "admin",
                "role": "ADMIN"
            });

        expect(response.status).toBe(200);
        let verificationToken = response.body.data.token;

        response = await supertest(app)
            .post('/api/users/email-verification')
            .send({
                "token": verificationToken
            });

        expect(response.status).toBe(200);

        response = await supertest(app)
            .post('/api/users/login')
            .send({
                "email": "admin@test.com",
                "password": "rahasia"
            });

        expect(response.status).toBe(200);
        adminCookies = response.headers['set-cookie'];

        response = await supertest(app)
            .post('/api/users/register')
            .send({
                "email": "user@test.com",
                "password": "rahasia",
                "full_name": "user"
            });

        expect(response.status).toBe(200);
        verificationToken = response.body.data.token;

        response = await supertest(app)
            .post('/api/users/email-verification')
            .send({
                "token": verificationToken
            });

        expect(response.status).toBe(200);

        response = await supertest(app)
            .post('/api/users/login')
            .send({
                "email": "user@test.com",
                "password": "rahasia"
            });

        expect(response.status).toBe(200);
        userCookies = response.headers['set-cookie'];
    });

    afterEach(async () => {
        await removeTestUser();
    });


    it('should successfully get all users when admin', async () => {
        const result = await supertest(app)
            .get('/api/users')
            .set('Cookie', adminCookies);

        expect(result.status).toBe(200);
        expect(result.body.message).toBe("Berhasil!");
        expect(Array.isArray(result.body.data)).toBe(true);

        const users = result.body.data;
        users.forEach(user => {
            expect(user.id).toBeDefined();
            expect(user.email).toBeDefined();
            expect(user.full_name).toBeDefined();
            expect(user.role).toBeDefined();
            expect(user.password).toBeUndefined();
        });
    });

    it('should reject if no token provided', async () => {
        const result = await supertest(app)
            .get('/api/users');

        expect(result.status).toBe(401);
        expect(result.body.errors).toBe("Unauthorized");
    });

    it('should reject if token is invalid', async () => {
        const result = await supertest(app)
            .get('/api/users')
            .set('Cookie', ['token=invalid.token.here']);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBe("Unauthorized");
    });

    it('should reject if user is not admin', async () => {
        const result = await supertest(app)
            .get('/api/users')
            .set('Cookie', userCookies);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBe("Unauthorized");
    });
});

describe('PUT /api/users/update', () => {
    let userCookies;
    let testImagePath;

    beforeAll(async () => {
        await removeTestUser();
        const uploadsDir = 'uploads/test';
        await fs.mkdir(uploadsDir, { recursive: true });
        testImagePath = path.join(uploadsDir, 'test.jpg');
        const imageBuffer = Buffer.from('fake image data');
        await fs.writeFile(testImagePath, imageBuffer);
    });

    beforeEach(async () => {
        let response = await supertest(app)
            .post('/api/users/register')
            .send({
                "email": "test@test.com",
                "password": "rahasia",
                "full_name": "test"
            });

        expect(response.status).toBe(200);
        const verificationToken = response.body.data.token;

        response = await supertest(app)
            .post('/api/users/email-verification')
            .send({
                "token": verificationToken
            });

        expect(response.status).toBe(200);

        response = await supertest(app)
            .post('/api/users/login')
            .send({
                "email": "test@test.com",
                "password": "rahasia"
            });

        expect(response.status).toBe(200);
        userCookies = response.headers['set-cookie'];
    });

    afterEach(async () => {
        await removeTestUser();
    });

    afterAll(async () => {
        await removeTestUser();
        await fs.rm('uploads', { recursive: true, force: true });
    });

    it('should successfully update user data with avatar', async () => {
        const result = await supertest(app)
            .put('/api/users/update')
            .set('Cookie', userCookies)
            .field('email', 'test@test.com')
            .field('full_name', 'Updated Name')
            .field('phone', '081234567890')
            .field('address', 'Updated Address')
            .field('sim_number', '123455678')
            .attach('avatar', testImagePath);

        expect(result.status).toBe(200);
        expect(result.body.message).toBe("Berhasil!");

        const userResponse = await supertest(app)
            .get('/api/users/me')
            .set('Cookie', userCookies);

        expect(userResponse.status).toBe(200);
        expect(userResponse.body.data.full_name).toBe('Updated Name');
        expect(userResponse.body.data.phone).toBe('081234567890');
        expect(userResponse.body.data.address).toBe('Updated Address');
        expect(userResponse.body.data.avatar).toBeDefined();
    });

    it('should successfully update user data with sim image', async () => {
        const result = await supertest(app)
            .put('/api/users/update')
            .set('Cookie', userCookies)
            .set('Cookie', userCookies)
            .field('email', 'test@test.com')
            .field('full_name', 'Updated Name')
            .field('phone', '081234567890')
            .field('address', 'Updated Address')
            .field('sim_number', '123455678')
            .attach('sim_image', testImagePath);

        expect(result.status).toBe(200);
        expect(result.body.message).toBe("Berhasil!");
    });

    it('should successfully update user data without files', async () => {
        const result = await supertest(app)
            .put('/api/users/update')
            .set('Cookie', userCookies)
            .field('email', 'test@test.com')
            .field('full_name', 'Updated Name')
            .field('phone', '081234567890')
            .field('address', 'Updated Address')
            .field('sim_number', '123455678')

        expect(result.status).toBe(200);
        expect(result.body.message).toBe("Berhasil!");
    });

    it('should reject if no token provided', async () => {
        const result = await supertest(app)
            .put('/api/users/update')
            .field('full_name', 'Updated Name');

        expect(result.status).toBe(401);
        expect(result.body.errors).toBe("Unauthorized");
    });

    it('should reject if token is invalid', async () => {
        const result = await supertest(app)
            .put('/api/users/update')
            .set('Cookie', ['token=invalid.token.here'])
            .field('full_name', 'Updated Name');

        expect(result.status).toBe(401);
        expect(result.body.errors).toBe("Unauthorized");
    });

    it('should reject if file size exceeds limit', async () => {
        const largeFilePath = path.join('uploads/test', 'large.jpg');
        const largeBuffer = Buffer.alloc(6 * 1024 * 1024);
        await fs.writeFile(largeFilePath, largeBuffer);

        const result = await supertest(app)
            .put('/api/users/update')
            .set('Cookie', userCookies)
            .field('email', 'test@test.com')
            .field('full_name', 'Updated Name')
            .field('phone', '081234567890')
            .field('address', 'Updated Address')
            .field('sim_number', '123455678')
            .attach('avatar', largeFilePath);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();

        await fs.unlink(largeFilePath);
    });
});
