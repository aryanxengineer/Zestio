import axios from "axios";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authService } from "../main";
import type { IAppContext, User } from "../types";

interface AppProviderProps {
    children: ReactNode;
}

const AppContext = createContext<IAppContext | undefined>(undefined);

export const AppProvider = ({ children }: AppProviderProps) => {
    
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);
    const [user, setUser] = useState<User | null>(null)
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

    return <AppContext.Provider value={{ isAuth, loading, setIsAuth, setLoading, setUser, user }}>{children}</AppContext.Provider>

};


export const useAppData = (): IAppContext => {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error('useAppData must be used within App Provider');
    }

    return context;
}

