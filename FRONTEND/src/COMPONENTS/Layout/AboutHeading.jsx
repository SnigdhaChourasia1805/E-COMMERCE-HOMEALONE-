
import image from "/src/COMPONENTS/Layout/IMAGES/about-heading-img.png";
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const AboutHeading = () => {
    useEffect(() => {
            // Initialize AOS
            AOS.init();
          }, []);
    return (
        <div className="aboutheading-container">
            <div className="aboutheading-left">
                <img src={image} alt="Left Image" data-aos="zoom-out" className="aboutheading-image" />
            </div>
            <div className="aboutheading-middle">
            <h1>Home Alone Products PVT LTD</h1>
                <p>A premium healthy snacks, beverages and multi-cuisine food catering company.</p>
            </div>
            <div className="aboutheading-right">
                <img src={image} alt="Right Image" data-aos="zoom-out" className="aboutheading-image" />
            </div>
        </div>
    );
}