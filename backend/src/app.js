import express from 'express';
import 'dotenv/config';

import { logger } from "./utils/logger.js";

const app = express();
app.use(express.json())

const PORT = process.env.APP_PORT;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
});
