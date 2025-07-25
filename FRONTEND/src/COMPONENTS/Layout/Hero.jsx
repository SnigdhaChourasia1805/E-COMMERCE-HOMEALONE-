// Import the CSS file for styling
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import logo from "../../../public/hero-page-image.png"
export const HomeContainerHero = () => {

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: true, // Animation will happen only once
    });
  }, []);
  return (
    <div className="home-container">
      <div className="text-section" data-aos="zoom-in">
        <h1 className="title"> Home Alone Products</h1>
        <p className="description">
          A premium healthy snacks , beverages and multi-cuisine food catering company .
        </p>
        <div className="home-btn">
          <button className="btn"><NavLink to="/about">Know More</NavLink></button>
          <button className="btn"><NavLink to="/collections/all">Shop Now</NavLink></button>
        </div>

      </div>
      <div className="image-section" data-aos="zoom-in">
        <img
          src={logo}
          alt="Product image"
          className="image"
        />
      </div>


    </div>
  );
};


