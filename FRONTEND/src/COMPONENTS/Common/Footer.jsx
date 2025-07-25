import { NavLink } from "react-router-dom";
import logo from "../../../public/logo.png";
import { FaLocationDot, FaPhone } from "react-icons/fa6";
import { RiInstagramFill, RiFacebookBoxFill } from "react-icons/ri";
// import { MdEmail } from "react-icons/md";

export const Footer = () => {
    return (
        <>
            <footer className="border-t py-12 footer-section">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-5 px-4 lg:px-0">
                    <div>
                        <img src={logo} alt="Company Logo" className="footer-logo" />
                        <h4>Home Alone Products PVT LTD</h4>
                        <h3>
                            <FaLocationDot color={"#c95b0c"} /> Office Address
                            <p>D-15/1 Okhla Industrial Area Phase 2, New Delhi 110020</p>
                        </h3>
                        <h3>
                            <FaPhone color={"#c95b0c"} /> Call Us
                            <p>
                                <NavLink to="tel:+919899086669" className="phone-link">
                                    (+91) 98-990-86669 , 011-4056-3078
                                </NavLink>
                            </p>
                        </h3>
                    </div>

                    {/* Flex container for "Company", "Support", and "Follow Us" */}
                    <div className="flex flex-col items-center md:flex-row justify-between items-start gap-8">
                        <div className="flex justify-center items-center flex-col footer-section-text">
                            <h3 className="text-lg mb-2">Company</h3>
                            <ul className="space-y-2 text-center">
                                <li><NavLink to="/about">About Us</NavLink></li>
                                {/* <li><NavLink to="/careers">Careers</NavLink></li>
                                <li><NavLink to="/privacy-policy">Privacy Policy</NavLink></li> */}
                            </ul>
                        </div>

                        <div className="flex justify-center items-center flex-col footer-section-text">
                            <h3 className="text-lg mb-4">Support</h3>
                            {/* <li><NavLink to="/faq">FAQ</NavLink></li> */}
                            <li><NavLink to="/contact">Contact Us</NavLink></li>
                            {/* <li><NavLink to="/contact">Help Center</NavLink></li> */}
                        </div>

                        {/* "Follow Us" section */}
                        <div className="flex justify-center items-center flex-col footer-section-text">
                            <h3 className="text-lg mb-4 text-red-500">Follow Us</h3>
                            <div className="flex items-center space-x-4 mb-6">
                                <NavLink to="https://www.instagram.com/life.homealone?igsh=czNxM2x4enJwbWx4" rel="noopener noreferrer" target="_blank">
                                    <RiInstagramFill size={28} color={"orangered"} />
                                </NavLink>
                                <NavLink to="https://m.facebook.com/home.alone.products/">
                                    <RiFacebookBoxFill size={28} color={"orangered"} />
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto mt-12 px-4 lg:px-0 border-t">
                    <p className="text-gray-500 text-sm tracking-tighter text-center">&copy; 2025 Home Alone Products PVT LTD. All rights reserved.</p>
                </div>
            </footer>
        </>
    );
};
