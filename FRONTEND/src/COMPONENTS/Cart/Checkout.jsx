import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createCheckout } from "../../../redux/slices/checkoutSlice";
import axios from 'axios';

export const CheckOut = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cart, loading, error } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);

    const [shippingAddress, setShippingAddress] = useState({
        firstName: " ",
        lastName: " ",
        address: " ",
        city: " ",
        postalCode: " ",
        country: " ",
        phone: " ",
        email: " ",
    });
    const [checkoutId, setCheckId] = useState(null);

    // Ensure cart is loaded before processing
    useEffect(() => {
        if (!cart || !cart.products || cart.products.length === 0) {
            navigate("/");
        }
    }, [cart, navigate]);

    const handleCreateCheckout = async (e) => {
        e.preventDefault();
        if (cart && cart.products.length > 0) {
            const res = await dispatch(
                createCheckout({
                    checkoutItems: cart.products,
                    shippingAddress,
                    paymentMethod: "Cash on Delivery",
                    totalPrice: cart.totalPrice,
                })
            );
            if (res.payload && res.payload._id) {
                setCheckId(res.payload._id);
            }
        }
    };

    // Dynamically calculate total price of the cart
    const totalPrice = cart.products.reduce((total, product) => {
        return total + parseFloat(product.price);
    }, 0);

    // Finalize Checkout and Redirect to Order Confirmation
    const handleFinalizeCheckout = async () => {
        if (!checkoutId) return; // Ensure checkoutId exists before proceeding

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                },
            });
            if (response.status === 200) {
                navigate("/order-confirmation"); // Redirect to order confirmation page
            }
        } catch (error) {
            console.log("Error finalizing checkout:", error);
        }
    };

    // Call finalizeCheckout after checkoutId is set
    useEffect(() => {
        if (checkoutId) {
            handleFinalizeCheckout();
        }
    }, [checkoutId]);

    if (loading) return <p>Loading Cart...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!cart || !cart.products || cart.products.length === 0) {
        return <p>Your cart is empty!</p>;
    }

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
                {/* Left Section */}
                <div className="bg-white rounded-lg p-6">
                    <h2 className="text-2xl uppercase mb-6 text-red-500">CheckOut</h2>
                    <form onSubmit={handleCreateCheckout}>
                        <h3 className="text-lg text-red-600 mb-4 ">Contact Details</h3>
                        <div className="mb-4">
                            <label htmlFor="" className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                value={user ? user.email : ""}
                                className="w-full p-2 border rounded"
                                onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                            />
                        </div>
                        <h3 className="text-lg mb-4 text-red-600">Delivery</h3>
                        <div className="mb-4 grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="" className="block text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    value={shippingAddress.firstName}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="" className="block text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    value={shippingAddress.lastName}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="" className="block text-gray-700">Address</label>
                            <input
                                type="text"
                                required
                                value={shippingAddress.address}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div className="mb-4 grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="" className="block text-gray-700">City</label>
                                <input
                                    type="text"
                                    value={shippingAddress.city}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="" className="block text-gray-700">Postal Code</label>
                                <input
                                    type="text"
                                    value={shippingAddress.postalCode}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="" className="block text-gray-700">Country</label>
                            <input
                                type="text"
                                value={shippingAddress.country}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="" className="block text-gray-700">Phone</label>
                            <input
                                type="tel"
                                className="w-full p-2 border rounded"
                                value={shippingAddress.phone}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                                required
                            />
                        </div>

                        {/* Payment Method Section */}
                        <h3 className="text-lg mb-4 mt-6 text-red-600">Payment Method</h3>
                        <div className="mb-4">
                            <div>
                                <input
                                    type="radio"
                                    id="cod"
                                    name="paymentMethod"
                                    value="cod"
                                    checked
                                    disabled
                                />
                                <label htmlFor="cod" className="ml-2 text-gray-700">Cash on Delivery (COD)</label>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button type="submit" className="checkout-btn w-full">
                                Place Order
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg mb-4">Order Summary</h3>
                    <div className="border-t py-4 mb-4">
                        {cart.products.map((product, index) => (
                            <div key={index} className="flex items-start justify-between py-2 border-b">
                                <div className="flex items-start">
                                    <img src={product.image} alt={product.name} className="w-20 h-24 object-cover mr-4" />
                                    <div>
                                        <h3 className="text-md">{product.name}</h3>
                                        <p className="text-gray-500">Description: {product.description}</p>
                                    </div>
                                </div>
                                <p className="text-xl">&#8377;{parseFloat(product.price).toLocaleString("en-IN")}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between items-center text-lg mb-4">
                        <p>Subtotal</p>
                        <p>&#8377;{totalPrice.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </>
    );
};
