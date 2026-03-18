import express, { type Express } from "express";
import cors from 'cors';

import { PORT } from "./config/dotenv.js";
import connectToDB from "./config/mongodb.js";

import authRouter from "./routes/auth.routes.js";

const app: Express = express();

app.use(cors({
  origin: "http://localhost:5173",
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRouter);

app.listen(PORT, () => {
  connectToDB();
  console.log(`Auth service is running on port ${PORT}`);
});
