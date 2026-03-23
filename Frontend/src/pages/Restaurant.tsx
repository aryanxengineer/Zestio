import { useEffect, useState } from "react";
import type { IRestaurant } from "../types";
import axios from "axios";
import { restaurantService } from "../main";
import AddRestaurant from "../components/AddRestaurant";

const Restaurant = () => {

    const [Restaurant, setRestaurant] = useState<IRestaurant | null>(null)
    const [loading, setLoading] = useState<boolean>(true);


    const fetchMyRestaurant = async () => {
        try {
            const { data } = await axios.get(`${restaurantService}/api/v1/restaurant/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setRestaurant(data.restaurant || null);

            if (data.token) localStorage.setItem('token', data.token);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMyRestaurant();
    }, []);

    if (loading) return <div className="flex min-h-screen items-center justify-center">
        <p className="text-grey-500">Loading your restaurant...</p>
    </div>

    if (!Restaurant) {
        return <AddRestaurant />
    }

    return (
        <div>Restaurant</div>
    )
}

export default Restaurant;