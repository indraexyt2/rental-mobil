import supertest from "supertest";
import {logger} from "../src/utils/logger.js";
import {app} from '../src/app'
import {removeTestUser} from "./test.utils";

describe('POST /api/users/register', () => {

    afterEach(async () => {
        await removeTestUser();
    })

    it('should can register new user', async () => {
        const result = await supertest(app)
            .post('/api/auth/register')
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
            .post('/api/auth/register')
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
            .post('/api/auth/register')
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
            .post('/api/auth/register')
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

describe('POST /api/auth/email-verification', () => {
    afterEach(() => {
        removeTestUser();
    });

    it('should can be verify user email', async () => {
        const result = await supertest(app)
            .post('/api/auth/register')
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
            .post('/api/auth/email-verification')
            .send({
               "token": result.body.token
            });

        const cookies = response.headers['set-cookie'];
        expect(response.status).toBe(200);
        expect(cookies.some(cookie => cookie.includes('token'))).toBe(true);
        expect(response.body.message).toEqual("Berhasil!");
    });

    it('should reject if token undefined', async () => {
        const result = await supertest(app)
            .post('/api/auth/register')
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
            .post('/api/auth/email-verification')
            .send({
                "token": ''
            });

        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual("Token tidak boleh kosong!");
    });

    it('should reject if token wrong', async () => {
        const result = await supertest(app)
            .post('/api/auth/register')
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
            .post('/api/auth/email-verification')
            .send({
                "token": '555555'
            });

        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual("Token tidak valid!");
    });
});