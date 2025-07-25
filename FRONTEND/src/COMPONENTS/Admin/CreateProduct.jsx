import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { createProduct } from "../../../redux/slices/adminProductSlice";

export const CreateProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    images: [],
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setProductData((prev) => ({
        ...prev,
        images: [...prev.images, { url: data.imageUrl, altText: "" }],
      }));
      setUploading(false);
    } catch (error) {
      console.error("Image upload error:", error);
      setUploading(false);
    }
  };

  const handleDeleteImage = (url) => {
    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.url !== url),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createProduct(productData));
    navigate("/admin/products");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-green-600">Add New Product</h2>
      <form onSubmit={handleSubmit}>

        {/* Name */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
            rows={4}
          />
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            min="0"
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Count In Stock */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Count In Stock</label>
          <input
            type="number"
            name="countInStock"
            value={productData.countInStock}
            onChange={handleChange}
            min="0"
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* SKU */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">SKU</label>
          <input
            type="text"
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={productData.category}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Images Upload */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Upload Images</label>
          <input type="file" onChange={handleImageUpload} />
          {uploading && <p>Uploading...</p>}
          <div className="flex gap-4 mt-4">
            {productData.images.map((img, i) => (
              <div key={i} className="relative w-24 h-24">
                <img
                  src={img.url}
                  alt={img.altText || `Product Image ${i + 1}`}
                  className="w-full h-full object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(img.url)}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-1 text-sm"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};
