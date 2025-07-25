import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { removeFromCart, updateCartItemQuantity } from "../../../redux/slices/cartSlice"; // Assuming removeCartItem is a Redux action

export const CartContents = ({ cart = [], userId, guestId }) => { // Default cart to empty array
    const dispatch = useDispatch();

    // handle adding or subtracting to cart
    const handleAddToCart = (productId, quantity, delta) => {
        // Only update if the quantity is valid and >= 1
        const newQuantity = quantity + delta;
        if (newQuantity >= 1) {
            dispatch(
                updateCartItemQuantity({
                    productId,
                    quantity: newQuantity,
                    guestId,
                    userId,
                })
            );
        }
    };

    // Handle removing item from cart
    const handleRemoveItem = (productId) => {
        dispatch(removeFromCart({ productId, guestId, userId }));
    };


    return (
        <>
            <div>
                {cart.map((product, index) => (
                    <div key={index} className="flex items-start justify-between py-4 border-b">
                        <div className="flex items-start">
                            <img
                                src={product.image || "/default-image.jpg"} // Fallback image if not provided
                                alt={product.name || "Product Image"} // Fallback alt text
                                className="w-20 h-24 object-cover mr-4 rounded"
                            />
                            <div>
                                <h3>{product.name || "Unnamed Product"}</h3> {/* Fallback for product name */}
                                <div className="flex items-center mt-2">
                                    <button
                                        className="border rounded px-2 py-1 text-xl font-medium"
                                        onClick={() => handleAddToCart(product.id, product.quantity, -1)}
                                    >
                                        -
                                    </button>
                                    <span className="mx-4">{product.quantity}</span>
                                    <button
                                        className="border rounded px-2 py-1 text-xl font-medium"
                                        onClick={() => handleAddToCart(product.id, product.quantity, 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div>
                                {/* Handle price formatting gracefully */}
                                <p>{product.price ? product.price.toLocaleString() : "Price Unavailable"}</p>
                                <button onClick={() => handleRemoveItem(product.id)}>
                                    <RiDeleteBin3Line className="h-6 w-6 mt-2 text-red-900" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};
