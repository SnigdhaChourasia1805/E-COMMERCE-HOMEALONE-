import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { fetchProductDetails } from "../../../redux/slices/productsSlice";
import { addToCart } from "../../../redux/slices/cartSlice";
import { ProductGrid } from "./ProductGrid"; // Import ProductGrid correctly

export const ProductDetails = ({ productId }) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedProduct, loading, error, similarProducts } = useSelector((state) => state.products);
    const { user, guestId } = useSelector((state) => state.auth);
    const [mainImage, setMainImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isButtonDisabled, setISButtonDisabled] = useState(false);

    const productFetchId = productId || id;

    useEffect(() => {
        if (productFetchId) {
            dispatch(fetchProductDetails(productFetchId)); // Removed the duplicated dispatch
        }
    }, [dispatch, productFetchId]);

    useEffect(() => {
        if (selectedProduct?.images?.length > 0) {
            setMainImage(selectedProduct.images[0].url);
        }
    }, [selectedProduct]);

    const handleQuantityChange = (action) => {
        if (action === "plus") setQuantity((prev) => prev + 1);
        if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
    };

    const handleAddToCart = () => {
        setISButtonDisabled(true);
        dispatch(
            addToCart({
                productId: productFetchId,
                quantity,
                guestId,
                userId: user?._id,
            })
        )
            .then(() => {
                toast.success("Product added to the cart!", {
                    duration: 1000,
                });
            })
            .finally(() => {
                setISButtonDisabled(false);
            });
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <>
            <div className="p-6">
                {selectedProduct && (
                    <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
                        <div className="flex flex-col md:flex-row">
                            {/* Left thumbnails */}
                            <div className="hidden md:flex flex-col space-y-4 mr-6">
                                {selectedProduct.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image.url}
                                        alt={image.altText || `Thumbnail ${index}`}
                                        className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                                            mainImage === image.url ? "border-black" : "border-gray-300"
                                        }`}
                                        onClick={() => setMainImage(image.url)}
                                    />
                                ))}
                            </div>
                            {/* Main Image */}
                            <div className="md:w-1/2">
                                <div className="mb-4">
                                    <img
                                        src={mainImage}
                                        alt="Main Product"
                                        className="w-full h-auto object-cover rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Mobile Thumbnail */}
                        <div className="md:hidden flex overscroll-x-scroll space-x-4 mb-4">
                            {selectedProduct.images.map((image, index) => {
                                return (
                                    <img
                                        key={index}
                                        src={image.url}
                                        alt={image.altText || `Thumbnail ${index}`}
                                        className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                                            mainImage === image.url ? "border-black" : "border-gray-300"
                                        }`}
                                        onClick={() => setMainImage(image.url)}
                                    />
                                );
                            })}
                        </div>

                        {/* Product Details */}
                        <div className="md:w-1/2 md:ml-10">
                            <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                                {selectedProduct.name}
                            </h1>

                            <p className="text-lg text-gray-500 mb-1 line-through">
                                {selectedProduct.originalPrice && `${selectedProduct.originalPrice}`}
                            </p>
                            <p className="text-xl text-gray-500 mb-2">
                                &#8377;{selectedProduct.price}
                            </p>
                            <p className="text-gray-600 mb-4">{selectedProduct.description}</p>

                            <div className="mb-4">
                                <p className="text-gray-700">Quantity:</p>
                                <div className="flex items-center space-x-4 mt-2">
                                    <button onClick={() => handleQuantityChange("minus")} className="px-2 py-1 bg-gray-200">
                                        -
                                    </button>
                                    <span className="text-lg">{quantity}</span>
                                    <button onClick={() => handleQuantityChange("plus")} className="px-2 py-1 bg-gray-200">
                                        +
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={isButtonDisabled}
                                className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${
                                    isButtonDisabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-900"
                                }`}
                            >
                                {isButtonDisabled ? "Adding..." : "Add to Cart"}
                            </button>
                        </div>

                        <div className="mt-20">
                            <h2 className="text-2xl text-center font-medium mb-4">You May Also Like:</h2>
                            <ProductGrid products={similarProducts} loading={loading} error={error} />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ProductDetails;
