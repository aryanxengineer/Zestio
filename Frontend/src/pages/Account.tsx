import { useAppData } from "../context/AppContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, MapPin, LogOut } from "lucide-react";

const AccountPage = () => {
  const { user, setIsAuth, setUser } = useAppData();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    setUser(null);
    navigate("/");
  };

  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

  const menuItems = [
    { label: "My Orders", icon: <ShoppingBag size={18} />, path: "/orders" },
    { label: "My Addresses", icon: <MapPin size={18} />, path: "/addresses" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg p-5 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-5"
        >
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-linear-to-br from-black to-gray-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
            {firstLetter}
          </div>

          {/* User Info */}
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-semibold">
              {user?.name || "User"}
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              {user?.email || "No email"}
            </p>
          </div>
        </motion.div>

        {/* Menu Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {menuItems.map((item, index) => (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={index}
              onClick={() => navigate(item.path)}
              className="bg-white rounded-2xl p-5 shadow-md cursor-pointer flex items-center justify-between hover:shadow-lg transition"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {item.icon}
                </div>
                <span className="font-medium text-sm sm:text-base">
                  {item.label}
                </span>
              </div>
              <span className="text-gray-400">→</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 bg-black text-white rounded-2xl shadow-md hover:opacity-90 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AccountPage;