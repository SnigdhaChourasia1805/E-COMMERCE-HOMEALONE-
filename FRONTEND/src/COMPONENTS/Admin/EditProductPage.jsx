import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { fetchProductDetails } from "../../../redux/slices/productsSlice";
import { updateProduct } from "../../../redux/slices/adminProductSlice";

export const EditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedProducts, loading, error } = useSelector((state) => state.products);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    images: [],
    isFeatured: false,
  });

  const [uploading, setUploading] = useState(false);

  // Fetch product details
  useEffect(() => {
    if (id) dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  // Set form data once product is fetched
  useEffect(() => {
    if (selectedProducts && selectedProducts._id === id) {
      setProductData((prevData) => ({
        ...prevData,
        ...selectedProducts,
      }));
    }
  }, [selectedProducts, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
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
      setProductData((prevData) => ({
        ...prevData,
        images: [...(prevData.images || []), { url: data.imageUrl, altText: "" }],
      }));
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = (imageUrl) => {
    const newImages = productData.images.filter((image) => image.url !== imageUrl);
    setProductData((prevData) => ({
      ...prevData,
      images: newImages,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProduct({ id, productData }))
      .unwrap()
      .then(() => navigate("/admin/products"))
      .catch((err) => console.error("Update failed:", err));
  };

  if (loading || !selectedProducts || selectedProducts._id !== id) return <p>Loading product...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6 text-red-500">Edit Product</h2>
      <form onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            className="w-full border border-gray-300 rounded-md p-2"
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={productData.description}
            className="w-full border border-gray-300 rounded-md p-2"
            rows={4}
            onChange={handleChange}
            required
          />
        </div>

        {/* Price */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Count in Stock */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Count in Stock</label>
          <input
            type="number"
            name="countInStock"
            value={productData.countInStock}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* SKU */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">SKU</label>
          <input
            type="text"
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={productData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Is Featured Checkbox */}
        <div className="mb-6">
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              name="isFeatured"
              checked={productData.isFeatured}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-green-600"
            />
            <span className="text-gray-700 font-semibold">Is Featured?</span>
          </label>
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Upload Image</label>
          <input type="file" onChange={handleImageUpload} />
          {uploading && <p>Uploading image...</p>}
          <div className="flex gap-4 mt-4">
            {productData.images && productData.images.length > 0 ? (
              productData.images.map((image, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img
                    src={image.url}
                    alt={`Product Image ${index + 1}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteImage(image.url);
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                  >
                    X
                  </button>
                </div>
              ))
            ) : (
              <p>No images uploaded yet</p>
            )}
          </div>
        </div>

        {/* Update Product Button */}
        <button
          className="w-full rounded-md bg-green-500 hover:bg-green-600 text-white px-2 py-3"
          type="submit"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};
