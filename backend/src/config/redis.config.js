import { createClient } from 'redis';
import {logger} from "../utils/logger.js";

const redisClient = createClient({
    url: 'redis://127.0.0.1:6379'
});

redisClient.on('error', () => {
    logger.error("Gagal terhubung dengan redis!")
});

const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        logger.info("Berhasil terhubung dengan redis")
    }
}

export {
    connectRedis,
    redisClient
}