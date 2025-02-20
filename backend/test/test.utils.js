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