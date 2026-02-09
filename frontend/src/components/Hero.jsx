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
          <h1 className="hero-title">Track your company vehicles & save like a Pro</h1>
          <p className="hero-sub">Cloud-based vehicle tracking and fleet management software</p>
          <div className="hero-actions">
            <a href="/login" className="hero-cta">Login</a>
            <button className="hero-secondary">Contact sales →</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
