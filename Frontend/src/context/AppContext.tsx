import axios from "axios";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authService } from "../main";
import type { IAppContext, LocationData, User } from "../types";
import { Toaster } from "react-hot-toast";

interface AppProviderProps {
    children: ReactNode;
}

const AppContext = createContext<IAppContext | undefined>(undefined);

export const AppProvider = ({ children }: AppProviderProps) => {

    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);
    const [user, setUser] = useState<User | null>(null)
    const [location, setLocation] = useState<LocationData | null>(null)
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [city, setCity] = useState("Fetching city...");

    // ---------------------------------------------------------------------------------
    // Fetching user details

    async function fetchUser() {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const { data } = await axios.get(`${authService}/api/v1/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUser(data.user);
            setIsAuth(true);
        } catch (error) {
            console.error("AUTH ERROR:", error);
            localStorage.removeItem("token"); // prevent stale token
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUser();
    }, [])

    // ---------------------------------------------------------------------------------
    // Fetching location using use effect

    useEffect(() => {
        if (!navigator.geolocation) {
            setCity("Not supported");
            return;
        }

        setLoadingLocation(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const controller = new AbortController();
                    setTimeout(() => controller.abort(), 5000);

                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
                        {
                            headers: {
                                "User-Agent": "zestio-app",
                            },
                            signal: controller.signal,
                        }
                    );

                    if (!res.ok) {
                        throw new Error(`HTTP error: ${res.status}`);
                    }

                    const data = await res.json();

                    const address = data?.address || {};

                    const resolvedCity =
                        address.city ||
                        address.town ||
                        address.village ||
                        address.state ||
                        "Your location";

                    setLocation({
                        latitude,
                        longitude,
                        formattedAddress: data?.display_name || "current location",
                    });

                    setCity(resolvedCity);

                    localStorage.setItem("city", resolvedCity);
                } catch (error) {
                    console.error("LOCATION ERROR:", error);

                    setLocation({
                        latitude,
                        longitude,
                        formattedAddress: "current location",
                    });

                    setCity(localStorage.getItem("city") || "Failed to load");
                } finally {
                    setLoadingLocation(false);
                }
            },
            (error) => {
                console.error("GEO ERROR:", error);
                setCity("Permission denied");
                setLoadingLocation(false);
            }
        );
    }, []);


    return <AppContext.Provider value={{ isAuth, loading, setIsAuth, setLoading, setUser, user, location, loadingLocation, city }}>
        {children}
        <Toaster />
    </AppContext.Provider>

};


// custom hook to fetch data inside components
export const useAppData = (): IAppContext => {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error('useAppData must be used within App Provider');
    }

    return context;
}

