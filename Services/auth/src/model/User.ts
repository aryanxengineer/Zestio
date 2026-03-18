import { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  image: string;
  role: string;
}

const schema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const User = model<IUser>("user", schema);
