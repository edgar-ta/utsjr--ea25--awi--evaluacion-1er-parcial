import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDb } from "./db/db.js";

import cors from 'cors';
import cookieParser from 'cookie-parser';

import userRoutes from './routes/userRoutes.js';
import { configDotenv } from 'dotenv';

const app = express();

configDotenv();

await (
    connectDb()
        .then((message) => {
            console.log("Successfully connected to MongoDB");
            console.log(message);
        })
        .catch(error => {
            console.error(error);
        })
);

const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(userRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
