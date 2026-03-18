import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../main";
import toast from "react-hot-toast";
import { useGoogleLogin } from '@react-oauth/google';


const Login = () => {

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
        <div>
            <button className="border-2 px-4 py-2 rounded bg-green-600 text-xs text-white" onClick={googleLogin}>Login</button>
        </div>
    )
}

export default Login