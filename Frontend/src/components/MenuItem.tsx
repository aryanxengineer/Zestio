import axios from "axios";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { restaurantService } from "../main";
import type { IMenuItems } from "../types";
import { useState } from "react";

interface MenuItemsProps {
  items: IMenuItems[];
  onItemDeleted: () => void;
  isSeller: boolean;
}

const MenuItem = ({ items, onItemDeleted, isSeller }: MenuItemsProps) => {
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setLoadingItemId(id);

      await axios.delete(`${restaurantService}/api/v1/items/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Item deleted");
      onItemDeleted(id);
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    } finally {
      setLoadingItemId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div
          key={item._id}
          className="bg-white rounded-2xl shadow-md overflow-hidden"
        >
          <img src={item.image.url} className="h-44 w-full object-cover" />

          <div className="p-4">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.description}</p>

            <div className="flex justify-between mt-2">
              <span>₹{item.price}</span>

              {isSeller && (
                <button
                  onClick={() => handleDelete(item._id)}
                  disabled={loadingItemId === item._id}
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuItem;
