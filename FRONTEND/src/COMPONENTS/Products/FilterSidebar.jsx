import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const FilterSidebar = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        category: "",
        minPrice: 0,
        maxPrice: 1000,
    });

    const [priceRange, setPriceRange] = useState([0, 1000]);

    const categories = [
        "Chips",
        "Thepla",
        "Makhana",
        "Puffs",
        "Roasted Seeds",
        "Digestive Products",
        "Mouth Freshner",
        "All",
    ];

    useEffect(() => {
        const params = Object.fromEntries([...searchParams]);
        setFilters({
            category: params.category || "",
            minPrice: params.minPrice || 0,
            maxPrice: params.maxPrice || 1000,
        });
        setPriceRange([0, params.maxPrice || 1000]);
    }, [searchParams]);

    const handleCategoryChange = (event) => {
        const selectedCategory = event.target.value;
        setFilters((prevFilters) => ({
            ...prevFilters,
            category: selectedCategory,
        }));

        // Update the search params to reflect the category change
        setSearchParams((prevParams) => {
            prevParams.set("category", selectedCategory);
            return prevParams;
        });
        updatedURLParams(filters);
    };

    const updatedURLParams = (newFilters) => {
        const params = new URLSearchParams();
        Object.keys(newFilters).forEach((key) => {
            if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
                params.append(key, newFilters[key].join(","))
            }
            else if (newFilters[key]) {
                params.append(key, newFilters[key]);
            }
        });
        setSearchParams(params);
        navigate(`?${params.toString()}`);
    };

    const handlePriceChange = (e) => {
        const newPrice = e.target.value;
        setPriceRange([0, newPrice])
        const newFilters = { ...filters, minPrice: 0, maxPrice: newPrice };
        setFilters(filters);
        updatedURLParams(newFilters);
    }

    return (
        <>
            <div className="p-4 filter-container">
                <h3 className="text-xl font-medium text-red-500 mb-4">Filter</h3>

                {/* Categories filter */}
                <div className="mb-6">
                    <label htmlFor="" className="block text-red-600 font-medium mb-2">
                        Category
                    </label>
                    {categories.map((category) => (
                        <div key={category} className="flex items-center mb-1">
                            <input
                                type="radio"
                                className="mr-2 h-4 w-4 text-red-500 focus:ring-red-500 focus:ring-opacity-50 border-gray-300"
                                name="category"
                                value={category}
                                checked={filters.category === category}
                                onChange={handleCategoryChange}
                            />
                            <span className="text-gray-700">{category}</span>
                        </div>
                    ))}
                </div>
                {/* Price range filter */}
                <div className="mb-8">
                    <label htmlFor="" className="block text-red-600 font-medium mb-2">Price Range</label>
                    <input type="range"
                        name="priceRange"
                        min={0}
                        max={1000}
                        value={priceRange[1]}
                        onChange={handlePriceChange}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-300" />
                    <div className="flex justify-between text-gray-600 mt-2">
                        <span>&#8377;0</span>
                        <span>&#8377;{priceRange[1]}</span>
                    </div>
                </div>
            </div>
        </>
    );
};
