import { NavLink } from "react-router-dom";
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import imageRight from "../Layout/IMAGES/right-img.jpg";
import associationImg  from "../Layout/IMAGES/association-img.jpg";
import fssaiImg from "../Layout/IMAGES/fssai.jpg";

export const AboutInfo = () => {
    useEffect(() => {
        // Initialize AOS
        AOS.init();
      }, []);
    return (
        <div className="aboutinfo-main-container">
            {/* Left Container */}
            <div className="aboutinfo-container left" data-aos="fade-up">
                <img src={imageRight} alt="Left Image" className="aboutinfo-image" />
                <h2>Who are we?</h2>
                <p>We are HOME ALONE PRODUCTS PVT LDT(HAPPL).</p>
                <p>A premium healthy snacks , beverages and multi-cuisine food catering company.</p>
                <p>Our company offers a diverse range of high-quality products to meet the needs of our customers.Life Alone offers a wide range of nutritious and delicious healthy snacks, perfect for any lifestyle</p>
                <button className="about-info-btn"><NavLink to="/">Contact US</NavLink></button>
            </div>

            {/* Middle Container */}
            <div className="aboutinfo-container middle py-2" data-aos="fade-up">
                <img src={associationImg} alt="Middle Image" className="aboutinfo-image" />
                <h2 className="p-3">Associations</h2>
                <img src={fssaiImg} alt="Middle Image" className="aboutinfo-image" />
                <h2 className="p-3">Fssai</h2>
                {/* <p>This is the middle container .</p> */}
                
            </div>

            {/* Right Container */}
            <div className="aboutinfo-container right" data-aos="fade-up">
                <img src={imageRight} alt="Right Image" className="aboutinfo-image" />
                <h2>What we do?</h2>
                <p>The Snacks Division, currently, deals in a wide range a Healthy snacks & Food items .</p>
                <h3>125+SKUs</h3>
                <p>Sales footprint spans across omni-channels GENERAL RETAIL,MODERN TRADE,HORECA,INSTITUTIONAL & CORPORATE,E-COMMERCE & E-MARKETPLACE.</p>
                <button className="about-info-btn"><NavLink to="/"> Shop Now</NavLink></button>
            </div>
        </div>
    )
}