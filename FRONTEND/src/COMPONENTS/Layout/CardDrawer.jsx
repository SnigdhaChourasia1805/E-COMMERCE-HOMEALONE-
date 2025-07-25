import { IoMdClose } from "react-icons/io";
import { CartContents } from "../Cart/CartContent";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const CardDrawer = ({ drawerOpen, toggleCartDrawer }) => {
    const navigate = useNavigate();
    const { user, guestId } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart)
    const userId = user ? user._id : null;
    const handleCheckout = () => {
        toggleCartDrawer();
        if (!user) {
            navigate("/login?redirect=checkout");
        }
        else {
            navigate("/checkout");
        }

    };


    return (
        <>
            <div className={` card-drawer fixed top-0 right-0 w-3/4 md:w[30rem] sm:w-1/2 md:w-1/4 h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}>
                <div className="flex justify-end p-4">
                    <button onClick={toggleCartDrawer}> <IoMdClose className="h-6 w-6 text-red-500" /></button>
                </div>

                {/* Cart Container with scrollable area */}
                <div className="flex-grow p-4 overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
                    {cart && cart?.products?.length > 0 ? (<CartContents cart={cart} userId={userId} guestId={guestId}  /> ) : (
                        <p>Your cart is empty</p>
                    )}
                    {/* Card content */}
                    <CartContents />
                </div>

                {/* Checkout button */}
                <div className="p-4 border-t p-4 sticky bottom-0">
                {cart && cart?.products?.length > 0  && (
                    <>
                    <button onClick={handleCheckout}
                        className="checkout-btn w-full font-semibold ">
                        CheckOut
                    </button>
                    </>
                ) }
                    
                </div>
            </div>
        </>
    )
}
