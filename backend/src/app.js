import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

import {logger} from "./utils/logger.js";
import userRoute from "./routes/user.route.js";
import {errorMiddleware} from "./middleware/error.middleware.js";
import {connectRedis} from "./config/redis.config.js";

export const app = express();
app.use(express.json());
app.use(cookieParser());

(async () => {
    await connectRedis();
})();

app.use('/api/users', userRoute);

app.use(errorMiddleware);

const PORT = process.env.APP_PORT;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
});
