import { useEffect, useState } from "react";
import { restaurantService } from "../main";
import { AddMenuItem } from "../components/AddMenuItem";
import { motion } from "framer-motion";

import type { IRestaurant } from "../types";
import type { Variants } from "framer-motion";

import axios from "axios";
import MenuItem from "../components/MenuItem";
import AddRestaurant from "../components/AddRestaurant";
import RestaurantProfile from "../components/RestaurantProfile";

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

type SellerTab = "menu" | "add-item" | "sales";

const Restaurant = () => {
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tab, setTab] = useState<SellerTab>("menu");

  const fetchMyRestaurant = async () => {
    try {
      const { data } = await axios.get(
        `${restaurantService}/api/v1/restaurants/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setRestaurant(data.restaurant || null);

      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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
    </motion.div>;
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
          <motion.div variants={itemVariants} className="mb-8 text-center">
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

        {/* Tabs Section */}
        <motion.div
          variants={itemVariants}
          className="mt-6 rounded-2xl bg-white shadow-lg p-4"
        >
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200">
            {[
              { key: "menu", label: "Menu Items" },
              { key: "add-item", label: "Add Item" },
              { key: "sales", label: "Sales" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key as SellerTab)}
                className={`relative px-6 py-3 text-sm font-medium transition-colors ${
                  tab === t.key
                    ? "text-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t.label}

                {/* Active Indicator */}
                {tab === t.key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-4">
            {tab === "menu" && (
              <motion.div
                key="menu"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <MenuItem />
              </motion.div>
            )}

            {tab === "add-item" && (
              <motion.div
                key="add-item"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AddMenuItem
                  onItemAdded={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </motion.div>
            )}

            {tab === "sales" && (
              <motion.div
                key="sales"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-gray-600 text-sm">
                  Sales analytics will appear here.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Restaurant;
