import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from react-router-dom
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaSearch } from "react-icons/fa";
import chipsImage from "./Images/chips.jpg";
import theplaImage from "./Images/thepla.jpg";
import makhanaImage from "./Images/makhana.jpg";
import puffsImage from "./Images/puffs.jpg";
import roastedseedsImage from "./Images/seeds.jpg";
import digestiveproductImage from "./Images/digestive.jpg";
import mouthfreshnerProduct from "./Images/mouthfreshner.jpg";
import allProducts from "./IMAGES/allproducts.jpg";

export const ProductCategory = () => {
  useEffect(() => {
    // Initialize AOS
    AOS.init();
  }, []);

  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const categories = [
    { title: "Chips", imageUrl: chipsImage },
    { title: "Thepla", imageUrl: theplaImage },
    { title: "Makhana", imageUrl: makhanaImage },
    { title: "Puffs", imageUrl: puffsImage },
    { title: "Roasted Seeds", imageUrl: roastedseedsImage },
    { title: "Digestive Products", imageUrl: digestiveproductImage },
    { title: "Mouth Freshener", imageUrl: mouthfreshnerProduct },
    { title: "All Products", imageUrl: allProducts },
  ];

  const [filteredCategories, setFilteredCategories] = useState(categories); // State for filtered categories

  const navigate = useNavigate(); // Hook to navigate to different routes

  // Update search query as user types
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // If the search query is empty, show all categories
    if (query === "") {
      setFilteredCategories(categories);
    } else {
      // Otherwise, filter the categories based on the search query
      const filtered = categories.filter((category) =>
        category.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  };

  // Navigate to Product Grid when Shop Now is clicked
  const handleShopNowClick = (categoryTitle) => {
    navigate(`/collections/${categoryTitle.toLowerCase()}`); // Navigate to the product grid with category as a parameter
  };

  return (
    <div className="categories-container">
      {/* Search Section */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={handleSearchChange} // Update search query as user types
        />
        <button><FaSearch /></button>
      </div>

      <h2>Shop by Category</h2>

      <div className="categories">
        {filteredCategories.map((category, index) => (
          <div key={index} className="category-card" data-aos="fade-up">
            <img src={category.imageUrl} alt={category.title} />
            <h3>{category.title}</h3>
            <button onClick={() => handleShopNowClick(category.title)}>Shop Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};
