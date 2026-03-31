import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2, UploadCloud } from "lucide-react";
import { restaurantService } from "../main";

export const AddMenuItem = ({ onItemAdded }: { onItemAdded: () => void }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setImage(null);
    setPreview(null);
  };

  const handleImageChange = (file: File | null) => {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!name || !image || !price) {
      toast.error("Name, price and image are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image);

    try {
      setLoading(true);

      await axios.post(`${restaurantService}/api/v1/items/new-item`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Item added successfully");
      resetForm();
      onItemAdded();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white shadow-xl rounded-2xl p-6 space-y-6">
        <h2 className="text-2xl font-semibold">Add Menu Item</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Item Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
              placeholder="e.g. Paneer Butter Masala"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
              placeholder="Short description..."
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
              placeholder="₹"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload Image
            </label>

            <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl h-40 cursor-pointer hover:bg-gray-50 transition">
              <UploadCloud className="w-8 h-8 mb-2" />
              <span className="text-sm">Click to upload</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
                className="hidden"
              />
            </label>

            {preview && (
              <img
                src={preview}
                alt="preview"
                className="mt-3 w-full h-40 object-cover rounded-lg"
              />
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded-lg hover:opacity-90 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" /> Adding...
              </>
            ) : (
              "Add Item"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
