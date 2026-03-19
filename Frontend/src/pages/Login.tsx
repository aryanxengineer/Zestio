import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../main";
import toast from "react-hot-toast";
import { useGoogleLogin } from '@react-oauth/google';
import { motion } from "framer-motion";
import { useAppData } from "../context/AppContext";


const Login = () => {

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { setUser, setIsAuth } = useAppData();

    const responseGoogle = async (authResult: any) => {
        if (!authResult?.code) {
            toast.error("Authorization code not received");
            return;
        }

        setLoading(true);
        try {
            const result = await axios.post(`${authService}/api/v1/auth/login`, {
                code: authResult.code,
            });

            localStorage.setItem('token', result.data.token);
            toast.success(result.data.message);

            setUser(result.data.user);
            setIsAuth(true);

            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error("Problem while login");
        } finally {
            setLoading(false);
        }
    }

    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: (error) => {
            console.error("Google Login Failed:", error);
            toast.error("Google login failed");
        },
        flow: 'auth-code'
    })

    return (
       <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-800 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-gray-700 bg-white/5 backdrop-blur-xl shadow-2xl p-8 space-y-6">
          {/* Heading */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold text-white">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-400">
              Continue with your Google account
            </p>
          </div>

          {/* Google Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            onClick={googleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-gray-200 rounded-xl py-4 text-sm font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5 h-5"
            />
            {loading ? "Signing in..." : "Continue with Google"}
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-gray-700" />
            <span className="text-xs text-gray-500">secure login</span>
            <div className="flex-1 h-px bg-gray-700" />
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
    )
}

export default Login