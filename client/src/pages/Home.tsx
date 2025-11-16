import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2>Live Dry Fruits Auctions</h2>
          <p>
            Participate in live, 10-minute auctions for premium dry fruits.
            Watch prices change in real-time and place your bids before the
            timer runs out.
          </p>

            {/* <div className="hero-actions">
              <button
                className="btn-primary btn-large"
                onClick={() => handleNavigate("/auctions")}
              >
                Browse Auctions
              </button>
              <button
                className="btn-secondary btn-large"
                onClick={() => handleNavigate("/bids")}
              >
                My Bids
              </button>
            </div> */}

            <div className="hero-actions">
              <button
                className="btn-primary btn-large"
                onClick={() => handleNavigate("/login")}
              >
                Login to Bid
              </button>
              <button
                className="btn-secondary btn-large"
                onClick={() => handleNavigate("/signup")}
              >
                Join Now
              </button>
            </div>

        </div>
        <div className="hero-image">
          <div className="image-placeholder">🥜</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h3>Why Choose NutriBid?</h3>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h4>Live Bidding</h4>
            <p>
              Real-time price updates as users bid during 10-minute auctions
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h4>Best Prices</h4>
            <p>Get premium dry fruits at competitive auction prices</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🥜</div>
            <h4>Premium Quality</h4>
            <p>Sourced from trusted vendors with quality assurance</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h4>Fast Delivery</h4>
            <p>Quick shipping to your doorstep after auction ends</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h4>10-Min Alerts</h4>
            <p>Get notified when new auctions start so you never miss out</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h4>Fair & Transparent</h4>
            <p>Transparent bidding process with verified user community</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stat-item">
          <div className="stat-number">5,000+</div>
          <div className="stat-label">Active Bidders</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">500+</div>
          <div className="stat-label">Daily Auctions</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">50+</div>
          <div className="stat-label">Dry Fruits</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">4.9★</div>
          <div className="stat-label">Rating</div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h3>Ready to Bid on Premium Dry Fruits?</h3>
        <p>
          Join thousands of users getting amazing deals through live auctions
        </p>
        <button
          className="btn-primary btn-large"
          onClick={() => handleNavigate("/signup")}
        >
          Create Your Account
        </button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h5>About NutriBid</h5>
            <p>Your trusted platform for live dry fruits auctions</p>
          </div>
          <div className="footer-section">
            <h5>Quick Links</h5>
            <ul>
              <li>
                <a href="#auctions">Active Auctions</a>
              </li>
              <li>
                <a href="#fruits">Dry Fruits</a>
              </li>
              <li>
                <a href="#about">About Us</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h5>Support</h5>
            <ul>
              <li>
                <a href="#help">Help Center</a>
              </li>
              <li>
                <a href="#contact">Contact Us</a>
              </li>
              <li>
                <a href="#privacy">Privacy Policy</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 NutriBid. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
