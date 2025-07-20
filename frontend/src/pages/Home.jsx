import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import portraitImage from "../assets/20230922-1H1A1234.jpg";

function Home() {
  useEffect(() => {
    document.body.className = 'home-page';
    return () => {
      document.body.className = '';
    };
  }, []);

  return (
    <div className="container py-5">
      {/* Hero Section */}
      <div className="text-center mb-5">
        <h1>Capturing Moments That Matter</h1>
        <p className="lead">
          At Kizirian Photography, we believe every family, every face, and every moment tells a story. Our mission is to bring those stories to life through timeless, heartfelt imagery.
        </p>
        <div className="mt-4">
          <Link to="/booking" className="btn btn-primary btn-lg me-3">
            Book Your Session
          </Link>
          <Link to="/gallery" className="btn btn-outline-primary btn-lg">
            View Portfolio
          </Link>
        </div>
      </div>

      {/* Early Bird Promotion Banner */}
      <div className="alert alert-warning text-center mb-5">
        <h4 className="mb-2">🚀 Limited Time: Early Bird Special</h4>
        <p className="mb-0">Book now and save 25% on your session! Only 8 spots remaining.</p>
      </div>

      {/* Services Section */}
      <div className="row mb-5">
        <div className="col-12 text-center mb-4">
          <h2>Our Services</h2>
          <p className="text-muted">Professional photography for every occasion</p>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <h4 className="card-title">📸 Professional Headshots</h4>
              <p className="card-text">Perfect for LinkedIn, corporate websites, and personal branding</p>
              <div className="h5 text-success">$75 - $150/session</div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <h4 className="card-title">👨‍👩‍👧‍👦 Family Portraits</h4>
              <p className="card-text">Capture precious moments with your loved ones</p>
              <div className="h5 text-success">$150 - $300/session</div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <h4 className="card-title">💍 Special Events</h4>
              <p className="card-text">Engagements, couples, baby photos, and more</p>
              <div className="h5 text-success">$100 - $250/session</div>
            </div>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div className="row align-items-center mb-5">
        <div className="col-md-6 mb-4 mb-md-0">
          <img src={portraitImage} alt="Alex Kizirian" className="img-fluid rounded shadow" />
        </div>
        <div className="col-md-6">
          <h2>About Me</h2>
          <p>
            Hi, I'm Alex Kizirian — a Houston-based photographer with a deep love for capturing real people and real moments. Whether it's the joy of a newborn, the pride of graduation, or the confidence of a professional headshot, I strive to create images that last a lifetime.
          </p>
          <p>
            With a background in adventure, nature, and portrait photography, I bring creativity, precision, and warmth to every session. Let's create something beautiful together.
          </p>
          <div className="mt-4">
            <Link to="/contact" className="btn btn-outline-primary">
              Get in Touch
            </Link>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="row mb-5">
        <div className="col-12 text-center mb-4">
          <h2>Why Choose Kizirian Photography?</h2>
        </div>
        <div className="col-md-4 text-center mb-4">
          <div className="display-1 text-warning">⚡</div>
          <h4>Quick Turnaround</h4>
          <p className="text-muted">Receive your edited photos within 48-72 hours</p>
        </div>
        <div className="col-md-4 text-center mb-4">
          <div className="display-1 text-warning">🎯</div>
          <h4>Professional Quality</h4>
          <p className="text-muted">High-resolution images perfect for print and digital use</p>
        </div>
        <div className="col-md-4 text-center mb-4">
          <div className="display-1 text-warning">💫</div>
          <h4>Personalized Experience</h4>
          <p className="text-muted">Every session is tailored to your unique style and needs</p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center cta-section">
        <h3 className="mb-3">Ready to Capture Your Story?</h3>
        <p className="mb-4">Book your session today and let's create something amazing together!</p>
        <div className="mb-3">
          <Link to="/booking" className="btn btn-primary btn-lg me-3">
            Book Now
          </Link>
          <a 
            href="https://instagram.com/kizirian_photography" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-outline-primary btn-lg"
          >
            📷 Follow on Instagram
          </a>
        </div>
        <div className="small">
          Follow <a href="https://instagram.com/kizirian_photography" target="_blank" rel="noopener noreferrer" className="text-decoration-none">@kizirian_photography</a> for latest work and behind-the-scenes content!
        </div>
      </div>
    </div>
  );
}

export default Home;
