import { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../../public/logo.png";
import { HiOutlineUser, HiOutlineShoppingBag } from "react-icons/hi";
import { HiBars3 } from "react-icons/hi2";
import { SearchBar } from "./SearchBar";
import { CardDrawer } from "../Layout/CardDrawer";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";

export const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const cartItemCount =
    cart?.products?.reduce((total, product) => total + product.quantity, 0) ||
    0;

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <nav
        className={`container mx-auto flex items-center justify-between py-4 px-6 transition-all duration-300 ${
          navDrawerOpen ? "bg-orange-50" : "" // Apply light orange background when the navDrawer is open
        }`}
      >
        {/* Left Logo */}
        <div>
          <img src={logo} alt="logo-image" className="h-20" />
        </div>

        {/* Center Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <NavLink
            to="/"
            className="nav-link text-sm font-medium uppercase"
            activeClassName="text-red-500 font-bold"
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className="nav-link text-sm font-medium uppercase"
            activeClassName="text-red-500 font-bold"
          >
            About
          </NavLink>
          <NavLink
            to="/collections/all"
            className="nav-link text-sm font-medium uppercase"
            activeClassName="text-red-500 font-bold"
          >
            Products
          </NavLink>
          <NavLink
            to="/contact"
            className="nav-link text-sm font-medium uppercase"
            activeClassName="text-red-500 font-bold"
          >
            Contact
          </NavLink>
        </div>

        {/* Right Section Icons */}
        <div className="flex items-center space-x-4">
          {user && user.role === "admin" && (
            <NavLink
              to="/admin"
              className="rounded-md block bg-red-300 px-2 text-sm text-white"
            >
              Admin
            </NavLink>
          )}

          <NavLink to="/profile" className="nav-link">
            <HiOutlineUser className="h-6 w-6" />
          </NavLink>

          <button
            onClick={toggleCartDrawer}
            className="relative"
            aria-label="Open cart drawer"
          >
            <HiOutlineShoppingBag className="h-6 w-6 text-red-500" />
            <span className="absolute -top-2 -right-2 bg-red-400 text-white text-xs rounded-full px-2 py-0.5">
              {cartItemCount}
            </span>
          </button>

          {/* SearchBar (Now Visible on All Screens) */}
          <div>
            <SearchBar className="bg-red-500" />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleNavDrawer}
            className="md:hidden"
            aria-label="Open mobile menu"
          >
            <HiBars3 className="h-6 w-6 text-red-500" />
          </button>
        </div>
      </nav>

      {/* Cart Drawer */}
      <CardDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full shadow-lg transform transition-transform duration-300 z-50 ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer} aria-label="Close mobile menu">
            <IoMdClose className="h-6 w-6 text-red-900" />
          </button>
        </div>
        <div className="flex flex-col items-center space-y-6 mt-10 p-4">
          <h2 className="text-xl font-semibold mb-4 text-red-900">Menu</h2>
          <NavLink
            to="/"
            className="nav-link text-sm font-medium uppercase"
            onClick={toggleNavDrawer}
            activeClassName="text-red-500 font-bold"
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className="nav-link text-sm font-medium uppercase"
            onClick={toggleNavDrawer}
            activeClassName="text-red-500 font-bold"
          >
            About
          </NavLink>
          <NavLink
            to="/collections/all"
            className="nav-link text-sm font-medium uppercase"
            onClick={toggleNavDrawer}
            activeClassName="text-red-500 font-bold"
          >
            Products
          </NavLink>
          <NavLink
            to="/contact"
            className="nav-link text-sm font-medium uppercase"
            onClick={toggleNavDrawer}
            activeClassName="text-red-500 font-bold"
          >
            Contact
          </NavLink>
        </div>
      </div>
    </>
  );
};
