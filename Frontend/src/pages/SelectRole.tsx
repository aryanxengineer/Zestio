import { useState } from "react";
import { useAppData } from "../context/AppContext";
import axios from "axios";
import { authService } from "../main";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

type Role = "customer" | "rider" | "seller" | null;

const SelectRole = () => {
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAppData();
  const navigate = useNavigate();

  const roles: Role[] = ["customer", "rider", "seller"];

  const addRole = async () => {
    if (!role) return;

    setLoading(true);
    try {
      const { data } = await axios.put(
        `${authService}/api/v1/auth/add/role`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      localStorage.setItem("token", data.token);
      setUser(data.user);

      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-gray-900 to-gray-800 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Heading */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold text-white">
              Choose Your Role
            </h1>
            <p className="text-sm text-gray-400">
              Select how you want to use the platform
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {roles.map((r) => (
              <motion.div
                key={r}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setRole(r)}
                className={`cursor-pointer rounded-xl p-4 border text-center transition-all
                  ${
                    role === r
                      ? "bg-white text-black border-white"
                      : "bg-transparent text-gray-300 border-gray-600 hover:border-gray-400"
                  }`}
              >
                <p className="capitalize font-medium">{r}</p>
              </motion.div>
            ))}
          </div>

          {/* Continue Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: role ? 1.02 : 1 }}
            onClick={addRole}
            disabled={!role || loading}
            className="w-full py-3 rounded-xl font-medium bg-white text-black hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Continue"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default SelectRole;