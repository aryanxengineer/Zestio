export interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  role: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

export interface IAppContext {
  user: User | null;
  loading: boolean;
  isAuth: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  location: LocationData | null;
  loadingLocation: boolean;
  city: string;
}

export interface IRestaurant {
  _id: string;
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

export interface IMenuItems {
  _id: string;
  restaurantId: string;
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
