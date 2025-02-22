import {prismaClient} from "../src/config/database.config";

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