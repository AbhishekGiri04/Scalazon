import {React,useState, useEffect, useRef} from "react";
import "./home.css";
import "./modern-layout.css";
import Delivery from "../imgs/delivery.png";
import Popular from "./Category/Popular";
import Navbar from './Navbar';

function Home({ user, onLogout }) {
  document.title = "Scalazon - Your Shopping Destination"

  const handleScroll = () => {
    setTimeout(() => {
      const popularSection = document.querySelector('.popular');
      if (popularSection) {
        popularSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({
          top: window.innerHeight,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  return (
    <>
    <Navbar/>
        <div className="content">
          <div className="poster-area fade-in-up">
            <div className="poster-data">
              <h1 className="poster-head">Scalazon</h1>
              <h2 style={{ color: 'white', fontSize: '24px', margin: '10px 0' }}>Your Shopping Destination</h2>
              <p className="poster-desc">
                Experience seamless online shopping with{" "}
                <b style={{ fontSize: "20px" }}>Best Deals</b>. Browse, compare,
                shop with confidence.
              </p>
            </div>
            <div className="hero-buttons-left">
              <button 
                onClick={handleScroll}
                className="browse-btn-hero"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '2px solid rgba(255, 149, 0, 0.3)',
                  color: '#ff6b35',
                  padding: '18px 35px',
                  fontSize: '16px',
                  fontWeight: '700',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.3s ease',
                  textTransform: 'none',
                  letterSpacing: '0.5px',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.2)';
                  e.target.style.background = 'rgba(255, 255, 255, 1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.95)';
                }}
              >
                Discover Premium Collections
              </button>
            </div>
          </div>
          <img src={Delivery} className="delivery" />

          <div className="fade-in-up popular-section" style={{ animationDelay: '0.2s' }}>
            <Popular />
          </div>
        </div>
    </>
  );
}

export default Home;