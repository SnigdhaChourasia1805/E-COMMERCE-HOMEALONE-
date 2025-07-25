import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { fetchAdminProducts } from "../../redux/slices/adminProductSlice";
import { fetchAllOrders } from "../../redux/slices/adminOrderSlice";

export const AdminHomePage = () => {
  const dispatch = useDispatch();

  const adminProducts = useSelector((state) => state.adminProducts) || {};
  const { products = [], loading: productsLoading, error: productsError } = adminProducts;

  const adminOrders = useSelector((state) => state.adminOrders) || {};
  const {
    orders = [],
    totalOrders = 0,
    totalSales = 0,
    loading: ordersLoading,
    error: ordersError,
  } = adminOrders;

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-red-500">Admin Dashboard</h1>

      {(productsLoading || ordersLoading) && <p>Loading...</p>}

      {productsError && <p className="text-red-500">Error Fetching Products: {productsError}</p>}

      {ordersError && <p className="text-red-500">Error Fetching Orders: {ordersError}</p>}

      {!productsLoading && !ordersLoading && !productsError && !ordersError && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 shadow-md rounded-lg">
              <h2 className="text-xl font-semibold">Revenue</h2>
              <p className="text-2xl">&#8377;{totalSales.toFixed(2)}</p>
            </div>

            <div className="p-4 shadow-md rounded-lg">
              <h2 className="text-xl font-semibold">Total Orders</h2>
              <p className="text-2xl">{totalOrders}</p>
              <NavLink to="/admin/orders" className="text-blue-500 hover:underline">
                Manage Orders
              </NavLink>
            </div>
          </div>

          <div className="p-4 shadow-md rounded-lg mt-6">
            <h2 className="text-xl font-semibold">Total Products</h2>
            <p className="text-2xl">{products.length}</p>
            <NavLink to="/admin/products" className="text-blue-500 hover:underline">
              Manage Products
            </NavLink>
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-gray-700">
                <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Total Price</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order._id} className="border-b hover:bg-gray-50 cursor-pointer">
                        <td className="py-2 px-4">{order._id}</td>
                        <td className="py-2 px-4">{order.user.name}</td>
                        <td className="py-2 px-4">&#8377;{order.totalPrice.toFixed(2)}</td>
                        <td className="py-2 px-4">{order.status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 px-4 text-center text-gray-500">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
