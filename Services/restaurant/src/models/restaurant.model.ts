import { Schema, Document, model } from "mongoose";

export interface IRestaurant extends Document {
  name: string;
  description?: string;
  image: {
    url: string;
    publicId: string;
  };
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
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
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
      formattedAddress: {
        type: String,
      },
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

restaurantSchema.index({ ownerId: 1 }, { unique: true });

export const RestaurantModel = model<IRestaurant>(
  "Restaurant",
  restaurantSchema,
);
