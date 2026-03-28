import { Document, Schema, Types, model } from "mongoose";

export interface IMenuItems extends Document {
  restaurantId: Types.ObjectId;
  name: string;
  description: string;
  image: {
    url: string;
    publicId: string;
  };
  price: number;
  isAvailable: boolean;
  updatedAt: Date;
  createdAt: Date;
}

const menuItmeSchema: Schema<IMenuItems> = new Schema(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },
    name: {
      types: String,
      required: true,
      trim: true,
    },
    description: {
      types: String,
      trim: true,
    },
    price: {
      types: Number,
      required: true,
      trim: true,
    },
    image: {
      url: {
        types: String,
        required: true,
      },
      publicId: {
        types: String,
        required: true,
      },
      required: true,
    },
    isAvailable: {
      types: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true },
);

export const MenuItemModel = model<IMenuItems>("MenuItem", menuItmeSchema);
