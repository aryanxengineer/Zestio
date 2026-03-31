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

const menuItemSchema: Schema<IMenuItems> = new Schema(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    image: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const MenuItemModel = model<IMenuItems>("MenuItem", menuItemSchema);
