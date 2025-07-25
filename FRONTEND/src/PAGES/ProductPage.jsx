

import { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa6";
import { FilterSidebar } from "../COMPONENTS/Products/FilterSidebar";
import { SortOptions } from "../COMPONENTS/Products/SortOptions";
import { ProductGrid } from "../COMPONENTS/Products/ProductGrid";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../../redux/slices/productsSlice";

export const ProductPage = () => {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  // Convert searchParams to object and pass to filter action
  const queryParams = Object.fromEntries([...searchParams]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  // Dispatch action to fetch products when `collection` or `queryParams` change
  useEffect(() => {
    // Ensure the action fetches with both `collection` and `queryParams`
    dispatch(fetchProductsByFilters({ collection, ...queryParams }));
  }, [dispatch, collection, queryParams]); // Run on change of `collection` or `queryParams`

  // Toggle the sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Close the sidebar if clicked outside
  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    // Only add event listener when sidebar is open
    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup event listener on component unmount or sidebar state change
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Mobile filter button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden border p-2 flex justify-center items-center"
      >
        <FaFilter className="mr-2" />
        Filters
      </button>

      {/* Filter sidebar */}
      <div
        ref={sidebarRef}
        className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}
      >
        <FilterSidebar />
      </div>

      <div className="flex-grow p-4">
        <h2 className="text-2xl text-uppercase mb-4">All Products</h2>

        {/* Sort options */}
        <SortOptions />

        {/* Handle loading and error */}
        {loading && <p>Loading products...</p>}
        {error && <p>Error: {error}</p>}

        {/* If no products available */}
        {!loading && products.length === 0 && <p>No products found.</p>}

        {/* Product grid */}
        <ProductGrid products={products} />
      </div>
    </div>
  );
};
