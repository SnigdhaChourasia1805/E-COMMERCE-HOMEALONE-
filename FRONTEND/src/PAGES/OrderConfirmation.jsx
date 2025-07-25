import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../../redux/slices/cartSlice";
import { useEffect } from "react";

export const OrderConfirmation = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { checkout } = useSelector((state) => state.checkout);

    // clear the cart when the order is confirmed
    useEffect(() => {
        if (checkout && checkout._id) {
            dispatch(clearCart());
            localStorage.removeItem("cart");
        }
        else {
            navigate("/my-orders")
        }
    }, [checkout, dispatch, navigate]);




    const calculateEstimatedDelivery = (createdAt) => {
        const orderDate = new Date(createdAt);
        orderDate.setDate(orderDate.getDate() + 5);
        return orderDate.toLocaleDateString();
    }
    return (
        <>
            <div className="max-w-4xl mx-auto p-6 bg-white">
                <h1 className="text-4xl font-bold text-center text-red-700 mb-8">
                    Thank You for Your Order!
                </h1>
                {checkout && (
                    <div className="p-6 rounded-lg border">
                        <div className="flex justify-between mb-20">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Order ID: {checkout._id}
                                </h2>
                                <p className="text-gray-500">Order date: {new Date(checkout.createdAt).toLocaleDateString()}</p>
                            </div>

                            {/* Estimated delivery */}
                            <div>
                                <p className="text-sm text-red-700">Estimated Delivery:{calculateEstimatedDelivery(checkout.createdAt)}</p>
                            </div>
                        </div>

                        {/* ordered items */}
                        <div className="mb-20">
                            {checkout.checkoutItems.map((item) => (
                                <div
                                    key={item.productId}
                                    className="flex items-center mb-4">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                                    <div>
                                        <h4 className="text-md font-semibold">{item.name}</h4>
                                        <p className="text-sm text-gray-500">
                                            {item.description}
                                        </p>
                                    </div>
                                    <div className="ml-auto text-right">
                                        <p className="text-md">&#8377;{item.price}</p>
                                        <p className="text-sm text-gray-500">Qty:{item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* payment and delivery info */}
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-lg font-semibold mb-2">Payment</h4>
                                <p className="text-gray-600"></p>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-2">Delivery</h4>
                                <p className="text-gray-600">{checkout.shippingAddress.address}</p>
                                <p className="text-gray-600">{checkout.shippingAddress.city},{" "}
                                    {checkout.shippingAddress.country}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}