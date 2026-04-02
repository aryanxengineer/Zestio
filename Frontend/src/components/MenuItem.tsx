import axios from "axios";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import { restaurantService } from "../main";
import type { IMenuItems } from "../types";

interface Props {
  items: IMenuItems[];
  isSeller: boolean;
  onItemsUpdated: () => void;
}

const MenuItem = ({ items, isSeller, onItemsUpdated }: Props) => {
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

  const getAuthHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  // ================= API =================

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      setLoadingItemId(id);

      await axios.delete(`${restaurantService}/api/v1/items/${id}`, {
        headers: getAuthHeader(),
      });

      toast.success("Item deleted");
      onItemsUpdated();
    } catch (err) {
      console.error(err);
      toast.error("Deletion failed");
    } finally {
      setLoadingItemId(null);
    }
  };

  const toggleAvailability = async (id: string) => {
    try {
      setLoadingItemId(id);

      const res = await axios.put(
        `${restaurantService}/api/v1/items/status/${id}`,
        {},
        { headers: getAuthHeader() },
      );

      toast.success(res.data?.message || "Updated");
      onItemsUpdated();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setLoadingItemId(null);
    }
  };

  // ================= UI =================

  const AvailabilityBadge = ({ isAvailable }: { isAvailable: boolean }) => (
    <span
      className={`text-xs px-2 py-1 rounded-full font-medium shadow-sm ${
        isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
      }`}
    >
      {isAvailable ? "Available" : "Unavailable"}
    </span>
  );

  const ItemActions = ({
    itemId,
    isLoading,
  }: {
    itemId: string;
    isLoading: boolean;
  }) => {
    if (!isSeller) return null;

    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => toggleAvailability(itemId)}
          disabled={isLoading}
          className="text-xs bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
        >
          {isLoading ? "..." : "Toggle"}
        </button>

        <button
          onClick={() => handleDelete(itemId)}
          disabled={isLoading}
          className="p-1 rounded hover:bg-red-50 transition disabled:opacity-50"
        >
          <Trash2 size={18} className="text-red-500" />
        </button>
      </div>
    );
  };

  const MenuCard = (item: IMenuItems) => {
    const isLoading = loadingItemId === item._id;

    return (
      <div
        key={item._id}
        className="
          bg-white rounded-2xl border shadow-sm 
          hover:shadow-lg transition-all duration-200 
          overflow-hidden
          min-w-[250px]
        "
      >
        {/* Image */}
        <div className="relative">
          <img
            src={item.image?.url}
            alt={item.name}
            className="h-48 w-full object-cover"
          />

          <div className="absolute top-2 right-2">
            <AvailabilityBadge isAvailable={item.isAvailable} />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2">
          <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>

          <p className="text-sm text-gray-500 line-clamp-2">
            {item.description}
          </p>

          <div className="flex justify-between items-center mt-2">
            <span className="font-semibold text-gray-800">₹{item.price}</span>

            <ItemActions itemId={item._id} isLoading={isLoading} />
          </div>
        </div>
      </div>
    );
  };

  // ================= MAIN =================

  return (
    <div className="w-full px-4 md:px-6 lg:px-8">
      <div
        className="
          grid
          gap-6
          [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]
        "
      >
        {items.map((item) => MenuCard(item))}
      </div>
    </div>
  );
};

export default MenuItem;
