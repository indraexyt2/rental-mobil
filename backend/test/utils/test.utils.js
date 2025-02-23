import {prismaClient} from "../../src/config/database.config.js";
import request from "supertest";
import {app} from "../../src/app.js";

export const removeTestUser = async () => {
    await prismaClient.user.deleteMany({
        where: {
            email: {
                contains: "test"
            }
        }
    })
}

export const removeTestCars = async () => {
    await prismaClient.car.deleteMany()
}

export const removeTestCategory = async () => {
    await prismaClient.category.deleteMany()
}

export const removeTestCarImage = async () => {
    await prismaClient.carImage.deleteMany()
}

export const removeTestCarFeatures = async () => {
    await prismaClient.features.deleteMany()
}

export const setupTestDb = async () => {
    await prismaClient.$transaction([
        prismaClient.featureOnCars.deleteMany(),
        prismaClient.categoryOnCars.deleteMany(),
        prismaClient.carImage.deleteMany(),
        prismaClient.car.deleteMany(),
        prismaClient.features.deleteMany(),
        prismaClient.category.deleteMany(),
    ]);
};

export const seedTestData = async () => {
    const category = await prismaClient.category.create({
        data: { category_name: 'SUV' },
        select: {
            id: true
        }
    });

    const feature = await prismaClient.features.create({
        data: { feature: 'AC' },
        select: {
            id: true
        }
    });
    return { category, feature };
};

export const registerAdmin = async () => {
    let response = await request(app)
        .post('/api/users/register')
        .send({
            "email": "admin@test.com",
            "password": "123456789",
            "full_name": "Admin",
            "role": "ADMIN"
        });

    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe("admin@test.com");

    response = await request(app)
        .post('/api/users/email-verification')
        .send({
            "token": response.body.data.token
        });

    expect(response.body.data.token).toBeDefined();
    expect(response.headers['set-cookie']).toBeDefined()
    return response.headers['set-cookie'];
}