import { useDispatch, useSelector } from "react-redux";
import { MyOrder } from "./MyOrder";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { logout } from "../../redux/slices/authSlice";
import { clearCart } from "../../redux/slices/cartSlice";

export const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redirect if no user is found in Redux state
  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redirect to login page if no user data
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action
    dispatch(clearCart()); // Clear cart items
    navigate("/login"); // Redirect to login page after logout
  };

  if (!user) {
    return <div>Loading...</div>; // Show loading until user data is available
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          {/* Left Section: Profile Information */}
          <div className="w-full md:w-1/3 lg:w-1/4 shadow-md rounded-lg p-6 bg-white">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{user?.name}</h1>
            <p className="text-lg mb-4 text-gray-700">{user?.email}</p>

            {/* Profile Picture */}
            {user?.avatar && (
              <img
                src={user.avatar}
                alt="User Avatar"
                className="w-20 h-20 rounded-full mb-4 mx-auto"
              />
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
            >
              Logout
            </button>
          </div>

          {/* Right Section: Orders */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <MyOrder />
          </div>
        </div>
      </div>
    </div>
  );
};
