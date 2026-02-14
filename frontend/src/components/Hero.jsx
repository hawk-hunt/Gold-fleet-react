import React, { useState, useEffect } from 'react'
import './Hero.css'

const styles = `
  @keyframes fadeInOut {
    0% { opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { opacity: 0; }
  }
  .hero-video-fade {
    animation: fadeInOut 3s ease-in-out forwards;
  }
`;

const Hero = () => {
  const videos = [
    '/videos/recording3.mp4',
    '/videos/13197481_1920_1080_30fps.mp4',
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(i => (i + 1) % videos.length);
    }, 3000); // three seconds per clip
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{styles}</style>
      <section className="hero">
        <video key={index} autoPlay muted playsInline className="hero-video hero-video-fade">
          <source src={videos[index]} type="video/mp4" />
        </video>

        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">GoldFleet Management Services</h1>
            <p className="hero-sub">Cloud-based vehicle tracking and fleet management software</p>
            <div className="hero-actions">
              <a href="/login" className="hero-cta">Login / Sign up</a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Hero
