import amqplib from 'amqplib';
import 'dotenv/config.js';
import {logger} from "./logger.js";

let connection;
let channel;

export const connectRabbitMq = async () => {
    try {
        const url = process.env.RABBITMQ_URL;
        connection = await amqplib.connect(url);

        connection.on('error', (err) => {
            logger.error("Gagal terhubung dengan rabbitmq:", err);
            setTimeout(connectRabbitMq, 5000);
        });

        connection.on('close', () => {
            logger.error("Koneksi rabbitMq terputus!");
            setTimeout(connectRabbitMq, 5000);
        });

        channel = await connection.createChannel();

        await channel.assertQueue('new_rental_queue', { durable: true });
        await channel.assertQueue('payment_completed_queue', { durable: true });

        await channel.assertQueue('update_rental_queue', { durable: true });
        await channel.assertQueue('refund_rental_queue', { durable: true });

        logger.info('Successfully connected to RabbitMQ');
        return { connection, channel };
    } catch (e) {
        logger.error("Gagal terhubung dengan rabbitmq!");
        setTimeout(connectRabbitMq, 500);
        throw e;
    }
}

export const publishToQueue = async (queue, message) => {
    try {
        if (!channel) {
            await connectRabbitMq();
        }

        return channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
            persistent: true
        });
    } catch (error) {
        logger.error(`Gagal publish ke queue ${queue}:`, error);
        throw error;
    }
};

export const consumeFromQueue = async (queue, callback) => {
    try {
        if (!channel) {
            await connectRabbitMq();
        }

        await channel.consume(queue, async (msg) => {
            if (msg) {
                try {
                    const content = JSON.parse(msg.content.toString());
                    await callback(content);
                    channel.ack(msg);
                } catch (error) {
                    logger.error(`Gagal proses message dari queue ${queue}:`, error);
                    channel.reject(msg, false);
                }
            }
        });
    } catch (error) {
        logger.error(`Gagal consuming dari queue ${queue}:`, error);
        throw error;
    }
};