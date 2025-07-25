import { useEffect } from "react";
import { FindUs } from "../COMPONENTS/Layout/FindUs";
import { HomeContainerHero } from "../COMPONENTS/Layout/Hero";
import { ProductCategory } from "../COMPONENTS/Products/ProductCategory";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../../redux/slices/productsSlice";

export const Home = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    // Dispatch the action to fetch products when the component mounts
    dispatch(
      fetchProductsByFilters({
        collection: "", // Optionally add filters here
        minPrice: null,
        maxPrice: null,
        sortBy: null,
        search: "",
        category: "",
        limit: 10,
      })
    );
  }, [dispatch]); // Adding dependency array to prevent infinite loop

  return (
    <>
      <HomeContainerHero />

      {/* Product category component */}
      <ProductCategory products={products} />

      <FindUs />
    </>
  );
};
