import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaTractor, FaShoppingCart, FaCheckCircle, FaRocket, FaStar, FaSeedling, FaHandHoldingWater, FaHeart } from 'react-icons/fa';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="home-container">
      {/* Animated Background Elements */}
      <div className="animated-background">
        <div className="floating-leaves">
          {[...Array(6)].map((_, i) => (
            <FaLeaf key={i} className="floating-leaf" style={{ 
              left: `${Math.random() * 100}%`, 
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${15 + i * 2}s`
            }} />
          ))}
        </div>
        <div className="gradient-orb" style={{
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
        }} />
      </div>

      {/* Hero Section */}
      <section className={`hero-section ${isVisible ? 'animate-fade-in' : ''}`}>
        <div className="hero-content">
          <div className="hero-text animate-slide-in-from-left">
            <div className="hero-title-container">
              <h1 className="hero-title animate-glow">
                <FaLeaf className="hero-icon" />
                <div className="welcome-text">
                  <span className="welcome-letter animate-letter-fade" style={{ animationDelay: '0.2s' }}>W</span>
                  <span className="welcome-letter animate-letter-fade" style={{ animationDelay: '0.3s' }}>e</span>
                  <span className="welcome-letter animate-letter-fade" style={{ animationDelay: '0.4s' }}>l</span>
                  <span className="welcome-letter animate-letter-fade" style={{ animationDelay: '0.5s' }}>c</span>
                  <span className="welcome-letter animate-letter-fade" style={{ animationDelay: '0.6s' }}>o</span>
                  <span className="welcome-letter animate-letter-fade" style={{ animationDelay: '0.7s' }}>m</span>
                  <span className="welcome-letter animate-letter-fade" style={{ animationDelay: '0.8s' }}>e</span>
                  <span className="welcome-space"></span>
                  <span className="welcome-letter animate-letter-fade" style={{ animationDelay: '0.9s' }}>t</span>
                  <span className="welcome-letter animate-letter-fade" style={{ animationDelay: '1.0s' }}>o</span>
                  <span className="welcome-space"></span>
                </div>
                <span className="brand-name">E-FARMER</span>
              </h1>
            </div>
            <p className="hero-subtitle animate-slide-in-from-top animate-pulse">Your trusted partner for fresh, organic produce</p>
            <p className="hero-description animate-slide-in-from-right">
              <span className="animate-fade-in">Connecting farmers directly with consumers</span>
              <span className="animate-slide-in-from-left">for the freshest produce,</span>
              <span className="animate-slide-in-from-right">fair prices,</span>
              <span className="animate-fade-in">and sustainable agriculture.</span>
            </p>
            <div className="hero-buttons">
              <Link to="/store" className="btn btn-primary animate-bounce animate-shimmer animate-glow">
                <FaShoppingCart className="animate-pulse" /> 
                <span className="animate-slide-in-from-left">Shop Now</span>
              </Link>
              <Link to="/about" className="btn btn-secondary animate-pulse animate-glow">
                <FaCheckCircle className="animate-spin" /> 
                <span className="animate-slide-in-from-right">Learn More</span>
              </Link>
            </div>
          </div>
          <div className="hero-image animate-slide-in-from-right">
            <div className="floating-card animate-float animate-glow">
              <FaRocket className="tractor-icon animate-spin" />
              <span className="animate-pulse">Fresh from Farm</span>
              <div className="card-decoration">
                <FaSeedling className="decoration-icon" />
                <FaHeart className="decoration-icon" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header animate-slide-in">
            <h2 className="section-title">Why Choose E-FARMER?</h2>
            <p className="section-subtitle">Experience the difference with our premium farm-fresh products</p>
          </div>
          <div className="features-grid">
            <div className="feature-card animate-scale-up animate-glow">
              <div className="feature-icon-wrapper">
                <FaLeaf className="feature-icon animate-pulse" />
                <div className="icon-bg animate-rotate"></div>
              </div>
              <h3 className="animate-slide-in-from-top">100% Organic</h3>
              <p className="animate-slide-in-from-left">All our produce is certified organic and grown with sustainable farming practices.</p>
              <div className="feature-features">
                <span className="feature-tag">Certified</span>
                <span className="feature-tag">Natural</span>
              </div>
            </div>
            <div className="feature-card animate-scale-up animate-glow" style={{ animationDelay: '0.2s' }}>
              <div className="feature-icon-wrapper">
                <FaTractor className="feature-icon animate-spin" />
                <div className="icon-bg animate-rotate"></div>
              </div>
              <h3 className="animate-slide-in-from-top">Farm Fresh</h3>
              <p className="animate-slide-in-from-right">Direct from farm to your table, ensuring maximum freshness and nutrition.</p>
              <div className="feature-features">
                <span className="feature-tag">Fresh</span>
                <span className="feature-tag">Daily</span>
              </div>
            </div>
            <div className="feature-card animate-scale-up animate-glow" style={{ animationDelay: '0.4s' }}>
              <div className="feature-icon-wrapper">
                <FaCheckCircle className="feature-icon animate-bounce" />
                <div className="icon-bg animate-rotate"></div>
              </div>
              <h3 className="animate-slide-in-from-top">Quality Assured</h3>
              <p className="animate-slide-in-from-left">We maintain strict quality standards from farm to delivery.</p>
              <div className="feature-features">
                <span className="feature-tag">Premium</span>
                <span className="feature-tag">Tested</span>
              </div>
            </div>
            <div className="feature-card animate-scale-up animate-glow" style={{ animationDelay: '0.6s' }}>
              <div className="feature-icon-wrapper">
                <FaStar className="feature-icon animate-spin" />
                <div className="icon-bg animate-rotate"></div>
              </div>
              <h3 className="animate-slide-in-from-top">Customer First</h3>
              <p className="animate-slide-in-from-right">Your satisfaction is our top priority with dedicated support.</p>
              <div className="feature-features">
                <span className="feature-tag">Support</span>
                <span className="feature-tag">Care</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <div className="container">
          <div className="section-header animate-slide-in">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">From farm to your table in simple steps</p>
          </div>
          <div className="process-timeline">
            <div className="process-step animate-slide-in-from-left">
              <div className="step-number animate-bounce">1</div>
              <div className="step-content">
                <FaSeedling className="step-icon animate-pulse" />
                <h3>Farm Sourcing</h3>
                <p>We partner with local farmers who share our commitment to quality</p>
              </div>
            </div>
            <div className="process-step animate-slide-in-from-left" style={{ animationDelay: '0.3s' }}>
              <div className="step-number animate-bounce">2</div>
              <div className="step-content">
                <FaHandHoldingWater className="step-icon animate-pulse" />
                <h3>Quality Check</h3>
                <p>Every product undergoes rigorous quality testing and certification</p>
              </div>
            </div>
            <div className="process-step animate-slide-in-from-left" style={{ animationDelay: '0.6s' }}>
              <div className="step-number animate-bounce">3</div>
              <div className="step-content">
                <FaShoppingCart className="step-icon animate-pulse" />
                <h3>Fast Delivery</h3>
                <p>Fresh produce delivered to your doorstep within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section animate-fade-in">
        <div className="container">
          <div className="cta-content">
            <div className="cta-badge animate-bounce-in">
              <FaHeart className="badge-icon" />
              <span>Join Our Community</span>
            </div>
            <h2>Ready to Experience Freshness?</h2>
            <p>Join thousands of satisfied customers who choose E-FARMER for their daily needs.</p>
            <div className="cta-buttons">
              <Link to="/store" className="btn btn-large btn-primary animate-glow">
                <FaShoppingCart /> Start Shopping
              </Link>
              <Link to="/contact" className="btn btn-large btn-secondary animate-glow">
                <FaCheckCircle /> Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Add CSS animations */}
      <style>{`
        /* Global styles to prevent any overflow */
        html, body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          width: 100%;
        }

        /* Custom scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #60A5FA, #3B82F6);
          border-radius: 10px;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #3B82F6, #2563EB);
        }

        /* Firefox scrollbar */
        * {
          scrollbar-width: thin;
          scrollbar-color: #60A5FA #1e293b;
        }

        /* Animated Background */
        .animated-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: -1;
          overflow: hidden;
        }

        .floating-leaves {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .floating-leaf {
          position: absolute;
          color: rgba(96, 165, 250, 0.1);
          font-size: 2rem;
          animation: floatLeaf linear infinite;
          transform-origin: center;
        }

        @keyframes floatLeaf {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(calc(100vh + 100px)) rotate(360deg);
            opacity: 0;
          }
        }

        .gradient-orb {
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(96, 165, 250, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          filter: blur(40px);
          transition: transform 0.3s ease-out;
        }

        /* Hero Badge */
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(96, 165, 250, 0.1);
          border: 1px solid rgba(96, 165, 250, 0.3);
          border-radius: 50px;
          padding: 8px 16px;
          margin-bottom: 20px;
          color: #60A5FA;
          font-size: 0.9rem;
          font-weight: 600;
          backdrop-filter: blur(10px);
          transform: scale(0) rotateY(180deg);
          opacity: 0;
          animation: badgeEntrance 1s ease-out 0.1s forwards;
        }

        .badge-icon {
          font-size: 1rem;
          color: #60A5FA;
        }

        @keyframes badgeEntrance {
          0% {
            transform: scale(0) rotateY(180deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.1) rotateY(90deg);
            opacity: 0.8;
          }
          100% {
            transform: scale(1) rotateY(0deg);
            opacity: 1;
          }
        }

        /* Card Decoration */
        .card-decoration {
          display: flex;
          justify-content: space-around;
          margin-top: 15px;
        }

        .decoration-icon {
          color: rgba(96, 165, 250, 0.6);
          font-size: 1.2rem;
          animation: pulse 2s infinite;
        }

        /* Section Headers */
        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-subtitle {
          font-size: 1.2rem;
          color: #94A3B8;
          margin-top: 15px;
          opacity: 0.8;
        }

        /* Enhanced Feature Cards */
        .feature-icon-wrapper {
          position: relative;
          display: inline-block;
          margin-bottom: 25px;
        }

        .icon-bg {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, rgba(96, 165, 250, 0.1), rgba(59, 130, 246, 0.1));
          border-radius: 50%;
          transform: translate(-50%, -50%);
          z-index: -1;
        }

        .feature-features {
          display: flex;
          gap: 8px;
          margin-top: 20px;
          flex-wrap: wrap;
        }

        .feature-tag {
          background: rgba(96, 165, 250, 0.1);
          border: 1px solid rgba(96, 165, 250, 0.2);
          border-radius: 20px;
          padding: 4px 12px;
          font-size: 0.8rem;
          color: #60A5FA;
          font-weight: 500;
        }

        /* Process Section */
        .process-section {
          padding: 100px 20px;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          position: relative;
        }

        .process-timeline {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
          max-width: 1000px;
          margin: 0 auto;
          position: relative;
        }

        .process-step {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          position: relative;
        }

        .step-number {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #60A5FA, #3B82F6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 1.2rem;
          flex-shrink: 0;
          box-shadow: 0 10px 25px rgba(96, 165, 250, 0.3);
        }

        .step-content {
          flex: 1;
        }

        .step-icon {
          color: #60A5FA;
          font-size: 2rem;
          margin-bottom: 15px;
          display: block;
        }

        .step-content h3 {
          color: #60A5FA;
          font-size: 1.3rem;
          margin-bottom: 10px;
        }

        .step-content p {
          color: #94A3B8;
          line-height: 1.6;
        }

        /* Enhanced CTA Section */
        .cta-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(96, 165, 250, 0.1);
          border: 1px solid rgba(96, 165, 250, 0.3);
          border-radius: 50px;
          padding: 8px 16px;
          margin-bottom: 20px;
          color: #60A5FA;
          font-size: 0.9rem;
          font-weight: 600;
          backdrop-filter: blur(10px);
        }

        .cta-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 30px;
        }

        /* Enhanced Animations */
        .animate-bounce-in {
          animation: bounceIn 1s ease-out;
        }

        .animate-rotate {
          animation: rotate 10s linear infinite;
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes rotate {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        .home-container {
          background: linear-gradient(135deg, #021259b1 0%, #03115122 100%);
          position: relative;
          overflow-x: hidden;
        }

        .hero-section {
          padding: 40px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }

        .hero-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          gap: 40px;
        }

        .hero-text {
          color: white;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          color: #60A5FA;
        }

        .hero-icon {
          color: #60A5FA;
          font-size: 3rem;
        }

        .hero-subtitle {
          font-size: 1.5rem;
          margin-bottom: 15px;
          color: #94A3B8;
        }

        .hero-description {
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 30px;
          color: rgba(255, 255, 255, 0.9);
        }

        .hero-buttons {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .hero-image {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .floating-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 20px;
          text-align: center;
          color: white;
          font-weight: 600;
        }

        .tractor-icon {
          font-size: 4rem;
          color: #4CAF50;
          margin-bottom: 15px;
        }

        .features-section {
          padding: 20px 20px;
          background: #0f172a;
        }

        .section-title {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 30px;
          color: #60A5FA;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .feature-card {
          text-align: center;
          padding: 20px 20px;
          background: #1e293b;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(96, 165, 250, 0.3);
        }

        .feature-icon {
          font-size: 3rem;
          color: #60A5FA;
          margin-bottom: 20px;
        }

        .feature-card h3 {
          font-size: 1.5rem;
          margin-bottom: 15px;
          color: #60A5FA;
        }

        .feature-card p {
          color: #94A3B8;
          line-height: 1.6;
        }

        .cta-section {
          padding: 20px 20px;
          background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);
          color: white;
          text-align: center;
        }

        .cta-content h2 {
          font-size: 2.5rem;
          margin-bottom: 15px;
        }

        .cta-content p {
          font-size: 1.2rem;
          margin-bottom: 15px;
          opacity: 0.9;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 24px;
          font-size: 1.1rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: #60A5FA;
          color: white;
        }

        .btn-primary:hover {
          background: #3B82F6;
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: transparent;
          color: white;
        }

        .btn-secondary:hover {
          background: #60A5FA;
          color: #0f172a;
        }

        .btn-large {
          padding: 20px 40px;
          font-size: 1.2rem;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Enhanced Title Animations */
        .welcome-text {
          display: inline-block;
          margin-right: 15px;
        }

        .welcome-letter {
          display: inline-block;
          color: #60A5FA;
          font-weight: 800;
          font-size: 3.5rem;
          text-shadow: 0 0 20px rgba(96, 165, 250, 0.5);
          transform: translateY(50px);
          opacity: 0;
        }

        .welcome-space {
          display: inline-block;
          width: 10px;
        }

        .brand-name {
          display: block;
          margin-top: 10px;
          font-size: 4rem;
          font-weight: 900;
          background: linear-gradient(135deg, #60A5FA, #3B82F6, #2563EB);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% 200%;
          animation: shimmer 3s ease-in-out infinite, brandEntrance 1.2s ease-out 1.1s forwards;
          transform: scale(0) rotateY(180deg);
          opacity: 0;
        }

        /* Enhanced Hero Icon */
        .hero-icon {
          color: #60A5FA;
          font-size: 3rem;
          animation: spin 3s linear infinite, iconEntrance 1s ease-out forwards;
          transform: scale(0) rotate(-180deg);
          opacity: 0;
        }

        /* Letter Animation Classes */
        .animate-letter-fade {
          animation: letterFade 0.8s ease-out forwards;
        }

        .animate-letter-wave {
          animation: letterWave 2s ease-in-out infinite;
        }

        .animate-icon-entrance {
          animation: iconEntrance 1s ease-out forwards;
        }

        .animate-brand-entrance {
          animation: brandEntrance 1.2s ease-out 1.1s forwards;
        }

        @keyframes letterFade {
          0% {
            transform: translateY(50px) rotateX(90deg);
            opacity: 0;
          }
          50% {
            transform: translateY(-10px) rotateX(0deg);
            opacity: 0.8;
          }
          100% {
            transform: translateY(0) rotateX(0deg);
            opacity: 1;
          }
        }

        @keyframes letterWave {
          0%, 100% {
            transform: translateY(0);
          }
          25% {
            transform: translateY(-5px);
          }
          75% {
            transform: translateY(5px);
          }
        }

        @keyframes iconEntrance {
          0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(90deg);
            opacity: 0.8;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes brandEntrance {
          0% {
            transform: scale(0) rotateY(180deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.1) rotateY(90deg);
            opacity: 0.8;
          }
          100% {
            transform: scale(1) rotateY(0deg);
            opacity: 1;
          }
        }

        /* Enhanced Hero Title */
        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          color: #60A5FA;
          flex-wrap: wrap;
        }

        /* Enhanced animations */
        .animate-slide-in-from-left { animation: slideInFromLeft 1s ease-out; }
        .animate-slide-in-from-right { animation: slideInFromRight 1s ease-out; }
        .animate-slide-in-from-top { animation: slideInFromTop 1s ease-out; }
        .animate-shimmer { animation: shimmer 2s linear infinite; }

        .animate-fade-in { animation: fadeIn 1s ease-out; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-bounce { animation: bounce 2s infinite; }
        .animate-pulse { animation: pulse 2s infinite; }
        .animate-scale-up { animation: scaleUp 0.6s ease-out; }
        .animate-slide-in { animation: slideIn 0.8s ease-out; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }

        @media (max-width: 768px) {
          .hero-content {
            flex-direction: column;
            text-align: center;
            gap: 30px;
          }
          
          .hero-title {
            font-size: 2.5rem;
            justify-content: center;
            flex-direction: column;
          }
          
          .welcome-letter {
            font-size: 2.5rem;
          }
          
          .brand-name {
            font-size: 3rem;
          }
          
          .hero-buttons {
            justify-content: center;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .process-timeline {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          
          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .section-title {
            font-size: 2rem;
          }
          
          .floating-leaf {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }
          
          .welcome-letter {
            font-size: 2rem;
          }
          
          .brand-name {
            font-size: 2.5rem;
          }
          
          .process-step {
            flex-direction: column;
            text-align: center;
            gap: 15px;
          }
          
          .gradient-orb {
            width: 400px;
            height: 400px;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
