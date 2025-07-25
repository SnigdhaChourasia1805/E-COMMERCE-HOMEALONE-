import { NavLink } from "react-router-dom";
import { FaAmazon } from "react-icons/fa";
import { FaCircleArrowRight } from "react-icons/fa6";
import { SiBigbasket , SiFlipkart ,SiRelianceindustrieslimited  } from "react-icons/si";

import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';


export const FindUs = () => {
     useEffect(() => {
        // Initialize AOS
        AOS.init();
      }, []);
    return (
        <div className="findus-main-container">
            <h1 className="heading">Available On</h1>

            <div className="inner-container">
                <div className="content-box" data-aos="fade-up">
                    <div className="logo">
                        <h2><FaAmazon size={50} color="white"  /></h2>
                    </div>
                    <h3>Amazon</h3>
                    <button className="btn">
                         <NavLink> <FaCircleArrowRight color="white" size={30} /></NavLink></button>
                </div>

                <div className="content-box" data-aos="fade-up">
                    <div className="logo">
                        <h2><SiBigbasket color="white" size={53}/></h2>
                    </div>
                    <h3>bigbasket</h3>
                    <button className="btn">
                    <NavLink> <FaCircleArrowRight color="white" size={30} /></NavLink>
                    </button>
                </div>

                <div className="content-box" data-aos="fade-up">
                    <div className="logo">
                        <h2><SiFlipkart color="white" size={53}/></h2>
                    </div>
                    <h3>Flipkart</h3>
                    <button className="btn"> <NavLink> <FaCircleArrowRight color="white" size={30} /></NavLink></button>
                </div>

                <div className="content-box" data-aos="fade-up">
                    <div className="logo">
                    <h2><SiRelianceindustrieslimited color="white" size={53} /></h2>
                    </div>
                    <h3>Jio Mart</h3>
                    <button className="btn"> <NavLink> <FaCircleArrowRight color="white" size={30} /></NavLink></button>
                </div>
                </div>
                </div>
    );
}

