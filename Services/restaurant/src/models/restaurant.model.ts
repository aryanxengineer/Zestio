import { Schema, Document, model } from "mongoose";

export interface IRestaurant extends Document {
  name: string;
  description?: string;
  image: string;
  ownerId: string;
  phone: number;
  isVerified: boolean;
  autoLocation: {
    type: "Point";
    coordinates: [number, number]; // [ Latitude, Longitude ]
    formattedAddrss: string;
  };
  isOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const restaurantSchema: Schema<IRestaurant> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      min: 2,
    },
    description: String,
    image: {
      url: String,
      publicId: String,
    },
    ownerId: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    autoLocation: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      formattedAddrss: {
        type: String,
        // required: true,
      },
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

restaurantSchema.index({ autoLocation: "2dsphere" });

export const RestaurantModel = model<IRestaurant>(
  "Restaurant",
  restaurantSchema,
);
