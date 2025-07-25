import { useState } from "react"
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProductsByFilters, setFilters } from "../../../redux/slices/productsSlice";

export const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSearchToggle = ()=>{
        setIsOpen(!isOpen);
    }

    const handleSearch = (e) =>{
        e.preventDefault();
        // console.log("Search Term:", searchTerm);
        dispatch(setFilters({search:searchTerm}));
        dispatch(fetchProductsByFilters({search:searchTerm}));
        navigate(`collections/all?search=${searchTerm}`);
        setIsOpen(false);  
    }
    return (
        <>
            <div className={`flex items-center justify-center w-full transition-all duration-300 ${isOpen ? "absolute top-11 left-0 w-full bg-white h-24 z-50":"w-auto"}`}>
                {isOpen ? (<form onSubmit={handleSearch} className="relative flex items-center justify-center w-full">
                    <div className="relative w-1/2 ">
                    <input type="text" 
                    placeholder="Search" 
                    value={searchTerm} 
                    onChange={(e)=>setSearchTerm(e.target.value)}
                    className="bg-gray-100 px-4 py-2 pl-2 pr-12 rounded-lg focus:outline-none w-full placeholder:text-gray-700" />
                    <button type="submit" className="absolute right-2 top-1/4 transform-translate-y-1/2 text-red-900 hover:text-red-500">
                        <HiMagnifyingGlass className="h-6 w-6 text-red-500" />
                    </button>
                    </div>
                    <button type="button" onClick={handleSearchToggle}>
                        <HiMiniXMark className="h-6 w-6 absolute right-15 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-500 " />
                    </button>
                    
                </form>) : (
                    <button onClick={handleSearchToggle}> <HiMagnifyingGlass className="h-6 w-6 text-red-500" /></button>
                )}
            </div>
        </>
    )
}