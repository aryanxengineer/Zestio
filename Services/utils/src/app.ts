import express, { type Express } from "express";
import cors from 'cors';

import { PORT } from "./config/dotenv.js";

const app: Express = express();

import '../src/config/cloudinary.js';
import cloudinaryRouter from "./routes/cloudinary.routes.js";

app.use(cors({
  origin: "http://localhost:5173",
}))

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.use('/api/v1/cloudinary', cloudinaryRouter);

app.listen(PORT, () => {
  console.log(`Utils service is running on port ${PORT}`);
});
