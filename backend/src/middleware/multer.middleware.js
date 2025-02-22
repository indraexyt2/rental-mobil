import multer from "multer";
import { ResponseError } from "../error/response.error.js";
import path from 'path';
import fs from 'fs/promises'

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const fieldName = file.fieldname;
        const destinationDir = `uploads/${fieldName}`;

        await fs.mkdir(destinationDir, {recursive: true})
        cb(null, destinationDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const limits = {
    fileSize: 5 * 1024 * 1024
};

const allowedFileTypes = ["image/jpeg", "image/png", "image/webp"];

const fileFilter = (req, file, cb) => {
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new ResponseError(400, "File tidak valid"));
    }
};

const upload = multer({
    storage,
    limits,
    fileFilter
}).fields([
    { name: 'sim_image', maxCount: 1 },
    { name: 'avatar', maxCount: 1 }
]);

export default upload;