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
          At Kizirian Photography, we specialize in creating timeless, heartfelt imagery that tells your unique story. From family portraits to professional headshots, we capture the moments that matter most.
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

      {/* Welcome Message */}
      <div className="alert alert-info text-center mb-5">
        <h4 className="mb-2">Welcome to Kizirian Photography</h4>
        <p className="mb-0">Professional photography services with quick turnaround and personalized attention.</p>
      </div>

      {/* Session Packages */}
      <div className="row mb-5">
        <div className="col-12 text-center mb-4">
          <h2>Session Packages</h2>
          <p className="text-muted">Professional photography packages designed for your needs</p>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-header text-center">
              <h4 className="card-title mb-0">Headshot Session</h4>
            </div>
            <div className="card-body text-center">
              <div className="h3 text-success mb-3">$115</div>
              <ul className="list-unstyled">
                <li>✓ 1-hour studio or outdoor session</li>
                <li>✓ 3-5 outfit changes</li>
                <li>✓ Professional editing</li>
                <li>✓ 10+ high-resolution images</li>
                <li>✓ 48-hour delivery</li>
              </ul>
              <p className="text-muted small">Perfect for LinkedIn, corporate websites, and personal branding</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100 border-primary">
            <div className="card-header text-center bg-primary text-white">
              <h4 className="card-title mb-0">Family Session</h4>
              <small>Most Popular</small>
            </div>
            <div className="card-body text-center">
              <div className="h3 text-success mb-3">$225</div>
              <ul className="list-unstyled">
                <li>✓ 1.5-hour session</li>
                <li>✓ Multiple locations/poses</li>
                <li>✓ Professional editing</li>
                <li>✓ 25+ high-resolution images</li>
                <li>✓ Online gallery access</li>
                <li>✓ 72-hour delivery</li>
              </ul>
              <p className="text-muted small">Capture precious moments with your loved ones</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-header text-center">
              <h4 className="card-title mb-0">Couples Session</h4>
            </div>
            <div className="card-body text-center">
              <div className="h3 text-success mb-3">$190</div>
              <ul className="list-unstyled">
                <li>✓ 1-hour session</li>
                <li>✓ Engagement or couples photos</li>
                <li>✓ Professional editing</li>
                <li>✓ 20+ high-resolution images</li>
                <li>✓ Print release included</li>
                <li>✓ 48-hour delivery</li>
              </ul>
              <p className="text-muted small">Perfect for engagements, anniversaries, and couples portraits</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Services */}
      <div className="alert alert-light text-center mb-5">
        <h5 className="mb-2">Additional Services Available</h5>
        <div className="row">
          <div className="col-md-3 mb-2">
            <strong>Pet Photos:</strong> $150
          </div>
          <div className="col-md-3 mb-2">
            <strong>Senior Photos:</strong> $115
          </div>
          <div className="col-md-3 mb-2">
            <strong>Holiday Mini:</strong> $90
          </div>
          <div className="col-md-3 mb-2">
            <strong>Custom Sessions:</strong> Contact for pricing
          </div>
        </div>
        <small className="text-muted d-block mt-2">
          All sessions include professional editing, high-resolution files, and personal consultation
        </small>
      </div>

      {/* Testimonials Section */}
      <div className="row mb-5">
        <div className="col-12 text-center mb-4">
          <h2>What Clients Say</h2>
          <p className="text-muted">Real feedback from real clients</p>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <div className="mb-3">
                <div className="text-warning">
                  ★★★★★
                </div>
              </div>
              <p className="card-text fst-italic">
                "Alex captured our family perfectly! The photos were natural and beautiful. Professional service from start to finish."
              </p>
              <footer className="blockquote-footer">
                <small>Sarah M., Family Session</small>
              </footer>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <div className="mb-3">
                <div className="text-warning">
                  ★★★★★
                </div>
              </div>
              <p className="card-text fst-italic">
                "Outstanding headshots for my LinkedIn profile. Alex made me feel comfortable and the results exceeded my expectations."
              </p>
              <footer className="blockquote-footer">
                <small>Michael R., Professional Headshots</small>
              </footer>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <div className="mb-3">
                <div className="text-warning">
                  ★★★★★
                </div>
              </div>
              <p className="card-text fst-italic">
                "Quick turnaround and amazing quality. The landscape prints I ordered look incredible in my office."
              </p>
              <footer className="blockquote-footer">
                <small>Jennifer L., Print Purchase</small>
              </footer>
            </div>
          </div>
        </div>
      </div>

      {/* About Preview Section */}
      <div className="row align-items-center mb-5">
        <div className="col-md-6 mb-4 mb-md-0">
          <img src={portraitImage} alt="Alex Kizirian" className="img-fluid rounded shadow" />
        </div>
        <div className="col-md-6">
          <h2>Meet Alex Kizirian</h2>
          <p>
            Houston-based photographer specializing in portraits, family photography, and professional headshots. With experience across multiple photography disciplines, I bring technical expertise and creative vision to every session.
          </p>
          <div className="mt-4">
            <Link to="/about" className="btn btn-primary me-3">
              Learn More
            </Link>
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
          <div className="display-1 text-primary">⏱️</div>
          <h4>Quick Turnaround</h4>
          <p className="text-muted">Receive your edited photos within 48-72 hours</p>
        </div>
        <div className="col-md-4 text-center mb-4">
          <div className="display-1 text-primary">✓</div>
          <h4>Professional Quality</h4>
          <p className="text-muted">High-resolution images perfect for print and digital use</p>
        </div>
        <div className="col-md-4 text-center mb-4">
          <div className="display-1 text-primary">★</div>
          <h4>Personalized Experience</h4>
          <p className="text-muted">Every session is tailored to your unique style and needs</p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center cta-section">
        <h3 className="mb-3">Ready to Schedule Your Session?</h3>
        <p className="mb-4">Contact us to discuss your photography needs and schedule your session.</p>
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
            Follow on Instagram
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
