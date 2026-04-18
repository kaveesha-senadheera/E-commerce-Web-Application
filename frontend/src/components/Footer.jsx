import React from 'react';
import { FaWhatsapp, FaInstagram, FaFacebookF, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const Footer = () => {
    return (
        <footer>
            <div className="footer-section">
                <div className="footer-brand">
                    <h1 className="footer-logo">E-FARMER</h1>
                    <p className="footer-tagline">Your trusted partner for fresh, organic produce</p>
                    <div className="footer-contact">
                        <div className="contact-item">
                            <FaPhone className="contact-icon" />
                            <div className="contact-details">
                                <span className="contact-label">Call Us:</span>
                                <span className="contact-number">076-3456781</span>
                                <span className="contact-number">078-4567345</span>
                            </div>
                        </div>
                        <div className="contact-item">
                            <FaEnvelope className="contact-icon" />
                            <span className="contact-email">info@efarmer.com</span>
                        </div>
                        <div className="contact-item">
                            <FaMapMarkerAlt className="contact-icon" />
                            <span className="contact-address">Colombo 7, Sri Lanka</span>
                        </div>
                        <div className="contact-item">
                            <FaClock className="contact-icon" />
                            <span className="contact-hours">Mon-Sat: 8AM-6PM</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-section">
                <h3 className="footer-title">Quick Links</h3>
                <ul className="footer-links-list">
                    <li><a href="/deliverys/create" className="footer-link">Shipping & Delivery</a></li>
                    <li><a href="#" className="footer-link">Events</a></li>
                    <li><a href="/feedbacks/full" className="footer-link">Support</a></li>
                    <li><a href="/records" className="footer-link">Return & Refunds</a></li>
                    <li><a href="#" className="footer-link">About Us</a></li>
                    <li><a href="#" className="footer-link">Our Products</a></li>
                </ul>
            </div>

            <div className="footer-section">
                <h3 className="footer-title">Legal</h3>
                <ul className="footer-links-list">
                    <li><a href="#" className="footer-link">Terms of Use</a></li>
                    <li><a href="#" className="footer-link">Privacy Policies</a></li>
                    <li><a href="#" className="footer-link">Cookie Policy</a></li>
                    <li><a href="#" className="footer-link">Disclaimer</a></li>
                </ul>
            </div>

            <div className="footer-section">
                <h3 className="footer-title">Connect With Us</h3>
                <div className="social-media">
                    <a href="#" className="social-link" aria-label="Instagram">
                        <FaInstagram className='social-media-icons' />
                    </a>
                    <a href="#" className="social-link" aria-label="Facebook">
                        <FaFacebookF className='social-media-icons' />
                    </a>
                    <a href="#" className="social-link" aria-label="WhatsApp">
                        <FaWhatsapp className='social-media-icons' />
                    </a>
                </div>
                <div className="newsletter">
                    <p className="newsletter-text">Subscribe for updates</p>
                    <div className="newsletter-form">
                        <input type="email" placeholder="Your email" className="newsletter-input" />
                        <button className="newsletter-btn">Subscribe</button>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <p className="powered-by">E-Farmer powered by 100% renewable electricity</p>
                    <p className="copyright"> 2024 E-Farmer. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;