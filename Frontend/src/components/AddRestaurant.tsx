import { useState } from "react";
import { useAppData } from "../context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import { restaurantService } from "../main";
import { motion } from "framer-motion";

const AddRestaurant = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [phone, setPhone] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const { loadingLocation, location } = useAppData();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !image || !location) {
            toast.error("All required fields must be filled");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("latitude", String(location.latitude));
        formData.append("longitude", String(location.longitude));
        formData.append("formattedAddress", location.formattedAddress);
        formData.append("file", image);
        formData.append("phone", phone);

        try {
            setSubmitting(true);

            await axios.post(`${restaurantService}/api/v1/restaurant/new`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "multipart/form-data",
                }
            });

            toast.success("Restaurant added successfully");

            setName("");
            setDescription("");
            setPhone("");
            setImage(null);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-xl bg-white/90 backdrop-blur rounded-2xl shadow-2xl p-6 md:p-8"
            >
                <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6 text-gray-800">
                    Add Restaurant
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <motion.input
                        whileFocus={{ scale: 1.02 }}
                        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="Restaurant Name *"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    {/* Description */}
                    <motion.textarea
                        whileFocus={{ scale: 1.02 }}
                        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 min-h-22.5"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    {/* Phone */}
                    <motion.input
                        whileFocus={{ scale: 1.02 }}
                        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />

                    {/* Image */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-600">
                            Upload Image *
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files?.[0] || null)}
                            className="w-full text-sm"
                        />
                    </div>

                    {/* Location */}
                    <div className="text-sm text-gray-600">
                        {loadingLocation ? (
                            <p>Fetching location...</p>
                        ) : location ? (
                            <p className="truncate">📍 {location.formattedAddress}</p>
                        ) : (
                            <p className="text-red-500">Location not available</p>
                        )}
                    </div>

                    {/* Submit */}
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        disabled={submitting}
                        className="w-full py-3 rounded-lg bg-indigo-600 text-white font-medium shadow-md hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {submitting ? "Submitting..." : "Add Restaurant"}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default AddRestaurant;