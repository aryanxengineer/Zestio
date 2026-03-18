import axios from "axios";
import { createContext, useEffect, useState, type ReactNode } from "react";
import { authService } from "../main";

interface AppProviderProps {
    children: ReactNode;
}

const AppContext = createContext(undefined);

export const AppProvider = ({ children }: AppProviderProps) => {
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);
    const [user, setUser] = useState(null)

    const [location, setLocation] = useState(null)
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [city, setCity] = useState("Fetching city...");

    async function fetchUser() {
        
        const token = localStorage.getItem('token');

        try {
            const { data } = await axios.get(`${authService}/api/v1/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUser(data.user);
            setIsAuth(true);

        } catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUser();
    }, [])

    return <AppContext.Provider value={{ a: 12 }}>{children}</AppContext.Provider>

};




