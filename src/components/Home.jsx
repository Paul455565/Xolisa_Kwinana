import React from "react";
import "./Home.css"; // Link to your CSS file
import xolisaImage from './xolisa.jpg';
import Navbar from "./Navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="home-wrapper">
          <header className="home-header">
            <h1 className="home-title">Xolisa Kwinana</h1>
            <p className="home-subtitle">
              South African Gospel Artist | Uplifting Souls Through Music
            </p>
          </header>

          <section className="home-about-section">
            <img
              src={xolisaImage}
              alt="Xolisa Kwinana"
              className="rounded-xl shadow-lg"
            />

            <div className="home-about-text">
              <h2>About Xolisa</h2>
              <p>
                Xolisa Kwinana is a passionate gospel artist based in South Africa who
                has touched lives through soulful music and deep spiritual connection.
                With performances in churches, live recordings, and national tours,
                Xolisa brings uplifting messages and inspiration through song.
              </p>
              <p>
                Explore upcoming events, book Xolisa for your next gathering, or purchase
                tickets to experience the power of gospel music.
              </p>
              <a href="/signup-login" className="home-button">
                Get Started
              </a>
            </div>
          </section>

          <section className="home-social">
            <h3>Follow on Social Media</h3>
            <div className="home-social-icons">
              <a href="https://www.facebook.com/XKwinana" target="_blank" rel="noreferrer">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://www.instagram.com/xolisakwinana/?hl=en" target="_blank" rel="noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="http://www.youtube.com/@xolisakwinana1974" target="_blank" rel="noreferrer">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Home;
