import { useEffect, useState } from "react";
import type { IRestaurant } from "../types";
import axios from "axios";
import { restaurantService } from "../main";
import { motion } from "framer-motion";
import AddRestaurant from "../components/AddRestaurant";
import RestaurantProfile from "../components/RestaurantProfile";
import { type Variants } from "framer-motion";


const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 },
    },
};


const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};



const Restaurant = () => {

    const [restaurant, setRestaurant] = useState<IRestaurant | null>(null)
    const [loading, setLoading] = useState<boolean>(true);


    const fetchMyRestaurant = async () => {
        try {
            const { data } = await axios.get(`${restaurantService}/api/v1/restaurant/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setRestaurant(data.restaurant || null);

            if (data.token) {
                localStorage.setItem('token', data.token);
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMyRestaurant();
    }, []);

    if (loading) {
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-4"
        >
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
            <p className="text-gray-500 text-sm tracking-wide">
                Loading your restaurant...
            </p>
        </motion.div>
    }

    if (!restaurant) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 px-4 py-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="mx-auto max-w-3xl"
                >
                    <motion.div
                        variants={itemVariants}
                        className="mb-8 text-center"
                    >
                        <h1 className="text-3xl font-semibold text-gray-800">
                            Create Your Restaurant
                        </h1>
                        <p className="mt-2 text-gray-500 text-sm">
                            Set up your restaurant profile to start managing your business.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="rounded-2xl bg-white p-6 shadow-md"
                    >
                        <AddRestaurant fetchMyRestaurant={fetchMyRestaurant} />
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 px-4 py-8">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto max-w-6xl"
            >
                {/* Header */}
                <motion.div
                    variants={itemVariants}
                    className="mb-6 flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Your Restaurant
                        </h1>
                        <p className="text-sm text-gray-500">
                            Manage and update your restaurant profile
                        </p>
                    </div>
                </motion.div>

                {/* Profile Card */}
                <motion.div
                    variants={itemVariants}
                    className="rounded-2xl bg-white shadow-lg p-6"
                >
                    <RestaurantProfile
                        restaurant={restaurant}
                        onUpdate={setRestaurant}
                        isSeller={true}
                    />
                </motion.div>
            </motion.div>
        </div>
    );
};


export default Restaurant;