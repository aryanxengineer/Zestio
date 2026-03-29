import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { restaurantService } from "../main";

interface IRestaurant {
    _id: string;
    name: string;
    description: string;
    isOpen: boolean;
    image: {
        url: string;
    }
}

interface Props {
    restaurant: IRestaurant | null;
    isSeller: boolean;
    onUpdate: (restaurant: IRestaurant) => void;
}

const RestaurantProfile = ({ restaurant, isSeller, onUpdate }: Props) => {
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState(restaurant?.name || "");
    const [description, setDescription] = useState(restaurant?.description || "");
    const [isOpen, setIsOpen] = useState(restaurant?.isOpen || false);
    const [loading, setLoading] = useState(false);

    const toggleOpenStatus = async () => {
        try {
            const { data } = await axios.put(
                `${restaurantService}/api/v1/restaurants/status`,
                { status: !isOpen },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            onUpdate(data.restaurant);
            setIsOpen(data.restaurant.isOpen);
            toast.success(data.message);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Error");
        }
    };

    const saveChanges = async () => {
        try {
            setLoading(true);
            const { data } = await axios.put(
                `${restaurantService}/api/v1/restaurants/edit`,
                { name, description },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            onUpdate(data.restaurant);
            setEditMode(false);
            toast.success(data.message);
        } catch {
            toast.error("Failed to update");
        } finally {
            setLoading(false);
        }
    };

    if (!restaurant) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
        >


            {/* Image + Header */}
            <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Image */}
                {restaurant?.image?.url && (
                    <div className="w-full md:w-48 h-40 md:h-32 rounded-xl overflow-hidden border bg-gray-100">
                        <img
                            src={restaurant.image.url}
                            alt={restaurant.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    {editMode ? (
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="text-2xl font-semibold border-b border-gray-300 outline-none w-full"
                        />
                    ) : (
                        <h2 className="text-2xl font-semibold text-gray-800">
                            {restaurant.name}
                        </h2>
                    )}
                    <p className="text-sm text-gray-500">Seller Control Panel</p>
                </div>

                {isSeller && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setEditMode(!editMode)}
                            className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-100"
                        >
                            {editMode ? "Cancel" : "Edit"}
                        </button>

                        <button
                            onClick={toggleOpenStatus}
                            className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition ${isOpen
                                    ? "bg-green-500 hover:bg-green-600"
                                    : "bg-red-500 hover:bg-red-600"
                                }`}
                        >
                            {isOpen ? "Live" : "Offline"}
                        </button>
                    </div>
                )}
            </div>

            {/* Description */}
            <div>
                <p className="text-xs uppercase text-gray-400 mb-2">Description</p>

                {editMode ? (
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                        rows={4}
                    />
                ) : (
                    <p className="text-gray-600 text-sm leading-relaxed">
                        {restaurant.description}
                    </p>
                )}
            </div>

            {/* Status Cards */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border bg-gray-50">
                    <p className="text-xs text-gray-400">Current Status</p>
                    <p className="text-lg font-semibold mt-1">
                        {isOpen ? "Accepting Orders" : "Closed"}
                    </p>
                </div>

                <div className="p-4 rounded-xl border bg-gray-50">
                    <p className="text-xs text-gray-400">System Health</p>
                    <p className="text-lg font-semibold mt-1">Optimal</p>
                </div>
            </div>

            {/* Actions */}
            {editMode && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end gap-3"
                >
                    <button
                        onClick={() => setEditMode(false)}
                        className="px-5 py-2 rounded-lg border text-sm"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={saveChanges}
                        disabled={loading}
                        className="px-5 py-2 rounded-lg bg-black text-white text-sm hover:bg-gray-800 disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </motion.div>
            )}
        </motion.div>
    );
};

export default RestaurantProfile;