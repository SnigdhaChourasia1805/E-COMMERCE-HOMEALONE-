import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { Toaster } from 'sonner';

// Redux
import { Provider } from "react-redux";
import store from "../redux/store";

// Layouts
import UserLayout from './COMPONENTS/Layout/UserLayout';
import AdminLayout from './COMPONENTS/Admin/AdminLayout';

// Pages (User)
import { Home } from './PAGES/HomePage';
import { Login } from './PAGES/Login';
import { SignUp } from './PAGES/SignUp';
import { Profile } from './PAGES/Profile';
import { About } from './PAGES/AboutUs';
import { ContactUs } from './COMPONENTS/Layout/ContactPage';
import { ProductPage } from './PAGES/ProductPage';
import { ProductDetails } from './COMPONENTS/Products/ProductDetails';
import { CheckOut } from './COMPONENTS/Cart/Checkout';
import { OrderConfirmation } from './PAGES/OrderConfirmation';
import { OrderDetailsPage } from './PAGES/OrderDetailsPage';
import { MyOrder } from './PAGES/MyOrder';

// Admin Pages
import { AdminHomePage } from './PAGES/AdminHomePage';
import { UserManagement } from './COMPONENTS/Admin/UserManagement';
import { ProductManagement } from './COMPONENTS/Admin/ProductManagement';
import { EditProductPage } from './COMPONENTS/Admin/EditProductPage';
import { OrderManagement } from './COMPONENTS/Admin/OrderManagement';
import { ProductGrid } from './COMPONENTS/Products/ProductGrid';
import ProtectedRoute from './COMPONENTS/Common/ProtectedRoute';
import ErrorBoundary from './COMPONENTS/ErrorBoundary';
import { CreateProductPage } from './COMPONENTS/Admin/CreateProduct';

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <ErrorBoundary >
          <Routes>
            {/* User Routes */}
            <Route path="/" element={<UserLayout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<SignUp />} />
              <Route path="profile" element={<Profile />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<ContactUs />} />
              <Route path="collections/:collection" element={<ProductPage />} />
              <Route path="products/:id" element={<ProductDetails />} />
              <Route path="products/category/:category" element={<ProductGrid />} />  {/* Changed route */}
              <Route path="checkout" element={<CheckOut />} />
              <Route path="order-confirmation" element={<OrderConfirmation />} />
              <Route path="order/:id" element={<OrderDetailsPage />} />
              <Route path="my-orders" element={<MyOrder />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute role="admin" />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminHomePage />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="products/:id/edit" element={<EditProductPage />} />
                <Route path="products/new" element={<CreateProductPage />} />
                <Route path="orders" element={<OrderManagement />} />
              </Route>
            </Route>

          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
