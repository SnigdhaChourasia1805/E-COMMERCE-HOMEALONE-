import { useEffect, useState } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { registerUser } from "../../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../../redux/slices/cartSlice";

export const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, guestId, loading } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart);

    // get redirect parameter and check if its checkout or something
    const redirect = new URLSearchParams(location.search).get("redirect") || "/";
    const isCheckoutRedirect = redirect.includes("checkout");

    useEffect(() => {
        if (user) {
            if (cart?.products.length > 0 && guestId) {
                dispatch(mergeCart({ guestId, user })).then(() => {
                    navigate(isCheckoutRedirect ? "/checkout" : "/");
                });
            }
            else {
                navigate(isCheckoutRedirect ? "/checkout" : "/");
            }
        }
    }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log("User Registered:",{name,email,password});  
        dispatch(registerUser({ name, email, password }));
    }
    return (
        <>
            <div className=" login-container ">
                <div className="login-content w-full md:w-1/2  p-8 md:p-12">
                    <form onSubmit={handleSubmit} action="" className=" login-form w-full max-w-md bg-white p-8 rounded-lg border shadow-sm">

                        <h2 className="text-2xl font-bold text-center mb-6">Welcome!</h2>
                        <p className="text-center mb-6">
                            Enter your username and password to signup</p>
                        <div className="mb-4 ">
                            <label htmlFor="" className="block text-sm font-semibold mb-2">Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                                className="w-full p-2 border rounded"
                                placeholder="Enter your Name" />
                        </div>
                        <div className="mb-4 ">
                            <label htmlFor="" className="block text-sm font-semibold mb-2">Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2 border rounded"
                                placeholder="Enter your Email address" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="" className="block text-sm font-semibold mb-2">Password</label>
                            <input type="password" value={password}
                                className="w-full p-2 border rounded"
                                placeholder="Enter your Password"
                                onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        <button type="submit" className="w-full p-3">{loading ? "Loading" : "SignUp"}</button>
                        <p className="mt-6 text-center text-sm text-gray-500">Already have an account? {" "}
                            <NavLink to={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-blue-500">Login</NavLink>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}