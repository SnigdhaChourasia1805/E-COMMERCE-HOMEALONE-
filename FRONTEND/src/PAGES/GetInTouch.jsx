import 'aos/dist/aos.css';
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaLocationDot, FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';  
// Importing the marker icon images explicitly
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { NavLink } from 'react-router-dom';

// Coordinates for the office location in New Delhi
const position = { lat: 28.5610, lng: 77.2601 }; // D-15/1 Okhla Industrial Area Phase 2

const containerStyle = {
  width: '100%',
  height: '500px'
};

export const GetInTouch = () => {
    useEffect(() => {
        // Initialize AOS
        AOS.init();
      }, []);
  // Fix for missing marker icon issue by explicitly defining it
  if (typeof window !== 'undefined') {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: markerIcon,
      iconRetinaUrl: markerIcon2x,
      shadowUrl: markerShadow,
    });
  }

  return (
    <div className="app">
      {/* Background Section */}
      <div className="background">
        <div className="overlay">
          <h1>Welcome to Our Office</h1>
          <p>We're here to assist you with any queries or support you need.</p>
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="contact-section">
        <div className="contact-left" data-aos="fade-up">
          <h2>Contact Us</h2>
          <p>If you have any questions, feel free to reach out.</p>

          <div className="contact-details">
            <div className="contact-item">
              <h3><FaLocationDot color={"#c95b0c"} /> Office Address</h3>
              <p>D-15/1 Okhla Industrial Area Phase 2, New Delhi 110020</p>
            </div>
            <div className="contact-item">
              <h3><MdEmail color={"#c95b0c"} /> Email</h3>
              <p> <NavLink to="mailto:info@company.com" className="email-link">info@lifesnacks.com</NavLink></p>
            </div>
            <div className="contact-item">
              <h3><FaPhone color={"#c95b0c"} /> Call Us</h3>
              <p> <NavLink to="tel:+919899086669" className="phone-link">(+91) 98-990-86669 , 011-4056-3078</NavLink></p>
            </div>
          </div>
        </div>

        {/* OpenStreetMap Section (Leaflet) */}
        <div className="contact-right" data-aos="fade-up">
          <h1>Our Office Location</h1>
          <MapContainer center={position} zoom={15} style={containerStyle}>
            {/* OpenStreetMap TileLayer */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            />
            {/* Marker at the specified position */}
            <Marker position={position}>
              <Popup>Our office is located here!</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};
