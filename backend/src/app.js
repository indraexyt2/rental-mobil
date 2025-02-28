import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import {logger} from "./utils/logger.js";
import userRoute from "./routes/user.route.js";
import carRoute from "./routes/car.route.js"
import rentalRoute from "./routes/rental.route.js";
import paymentRoute from "./routes/payment.route.js";
import {errorMiddleware} from "./middleware/error.middleware.js";
import {connectRedis} from "./config/redis.config.js";
import {connectRabbitMq} from "./utils/rabbitmq.js";
import {startWorkers} from "./workers/payment.worker.js";

export const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use(cors({
    origin: 'http://localhost:5173',
}));

(async () => {
    await connectRedis();
    await connectRabbitMq();

    await startWorkers();
})();

app.use('/api/users', userRoute);
app.use('/api/cars', carRoute);
app.use('/api/rentals', rentalRoute);
app.use('/api/payments', paymentRoute);

app.use(errorMiddleware);

const PORT = process.env.APP_PORT;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
});
