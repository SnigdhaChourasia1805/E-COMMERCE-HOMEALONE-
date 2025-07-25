
import { RiInstagramFill, RiFacebookBoxFill } from "react-icons/ri";

import { NavLink } from "react-router-dom";

const TopBar = () => {
    return (
        <>
            <div className="topbar-container text-white">
                <div className="container mx-auto flex justify-between item-center py-4 px-4">
                    <div className=" hidden md:flex items-center space-x-4">
                        <NavLink to="https://www.instagram.com/life.homealone?igsh=czNxM2x4enJwbWx4" rel="noopener noreferrer" target="_blank"> <RiInstagramFill className="h-5 w-5" /></NavLink>
                        <NavLink to="https://m.facebook.com/home.alone.products/" rel="noopener noreferrer" target="_blank"><RiFacebookBoxFill className="h-5 w-5" /></NavLink>
                    </div>
                    <div className="text-sm text-center flex-grow">
                        <span>Healthy Snacks & Beverages!</span>
                    </div>
                    <div className="text-sm hidden md:block">
                        <NavLink to="tel:+919899086669" className="hover:text-gray-300">(+91) 98-990-86669 , 011-4056-3078</NavLink>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TopBar;