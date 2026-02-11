import React from 'react'
import './Hero.css'

const Hero = () => {
  return (
    <section className="hero">
      <video autoPlay loop muted playsInline className="hero-video">
        <source src="/videos/13197481_1920_1080_30fps.mp4" type="video/mp4" />
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
  )
}

export default Hero
