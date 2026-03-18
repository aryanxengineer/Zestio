import mongoose from "mongoose";
import { MONGO_URI } from "./dotenv.js";

if (!MONGO_URI) {
  console.log("MONGODB url is not avaialable");
  process.exit(1);
}

const connectToDB = async () => {
  try {
    await mongoose.connect(MONGO_URI as string, {
      dbName: "Zestio_db"
    });
    console.log("Connected to DB");
  } catch (error) {
    console.log("MongoDB error", error);
    process.exit(1);
  }
};

export default connectToDB;
