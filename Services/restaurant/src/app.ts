import express, { type Express } from "express";
import cors from 'cors';

import { PORT } from "./config/dotenv.js";
import connectToDB from "./config/mongodb.js";

const app: Express = express();

app.use(cors({
  origin: "http://localhost:5173",
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  connectToDB();
  console.log(`Restaurant service is running on port ${PORT}`);
});
