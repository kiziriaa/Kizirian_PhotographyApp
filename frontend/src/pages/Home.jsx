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


      {/* Featured Work */}
      <div className="row mb-5">
        <div className="col-12 text-center mb-4">
          <h2>Featured Work</h2>
          <p className="text-muted">Recent sessions showcasing our photography style</p>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <img src={portraitImage} className="card-img-top" alt="Family Portrait" style={{height: '300px', objectFit: 'cover'}} />
            <div className="card-body text-center">
              <h5 className="card-title">Family Portraits</h5>
              <p className="card-text">Capturing natural moments and genuine connections</p>
              <Link to="/gallery?category=Family" className="btn btn-outline-primary btn-sm">View Gallery</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <img src={portraitImage} className="card-img-top" alt="Professional Headshot" style={{height: '300px', objectFit: 'cover'}} />
            <div className="card-body text-center">
              <h5 className="card-title">Professional Headshots</h5>
              <p className="card-text">Corporate and personal branding photography</p>
              <Link to="/gallery?category=Headshots" className="btn btn-outline-primary btn-sm">View Gallery</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <img src={portraitImage} className="card-img-top" alt="Wedding Photography" style={{height: '300px', objectFit: 'cover'}} />
            <div className="card-body text-center">
              <h5 className="card-title">Wedding Photography</h5>
              <p className="card-text">Documenting your most important day</p>
              <Link to="/services#wedding" className="btn btn-outline-primary btn-sm">Learn More</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Services Teaser */}
      <div className="alert alert-light text-center mb-5">
        <h5 className="mb-2">Photography Services</h5>
        <p className="mb-3">Professional photography starting at <strong>$115</strong></p>
        <div className="row text-center">
          <div className="col-md-3 mb-2">
            <strong>Headshots</strong><br/><small className="text-muted">Starting at $115</small>
          </div>
          <div className="col-md-3 mb-2">
            <strong>Family Sessions</strong><br/><small className="text-muted">Starting at $225</small>
          </div>
          <div className="col-md-3 mb-2">
            <strong>Weddings</strong><br/><small className="text-muted">Custom packages</small>
          </div>
          <div className="col-md-3 mb-2">
            <strong>Special Events</strong><br/><small className="text-muted">Contact for pricing</small>
          </div>
        </div>
        <div className="mt-3">
          <Link to="/services" className="btn btn-primary me-2">View All Services</Link>
          <Link to="/booking" className="btn btn-outline-primary">Book Session</Link>
        </div>
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
      <div className="text-center mb-5">
        <h2>About Kizirian Photography</h2>
        <p className="lead">Houston-based photographer specializing in capturing life's most precious moments</p>
        <Link to="/about" className="btn btn-primary">Meet Alex →</Link>
      </div>


      {/* Urgency/Scarcity Section */}
      <div className="alert alert-warning text-center mb-5">
        <h5 className="mb-2">⏰ Limited Availability This Month</h5>
        <p className="mb-3">Only 8 session slots remaining in January 2025. Book now to secure your preferred date!</p>
        <small className="text-muted">New client discount available - 25% off your first session</small>
      </div>

      {/* Trust Signals */}
      <div className="row mb-5 text-center">
        <div className="col-md-3 mb-3">
          <div className="h4 text-primary">500+</div>
          <small className="text-muted">Happy Clients</small>
        </div>
        <div className="col-md-3 mb-3">
          <div className="h4 text-primary">48-72hrs</div>
          <small className="text-muted">Delivery Time</small>
        </div>
        <div className="col-md-3 mb-3">
          <div className="h4 text-primary">5★</div>
          <small className="text-muted">Average Rating</small>
        </div>
        <div className="col-md-3 mb-3">
          <div className="h4 text-primary">3+ Years</div>
          <small className="text-muted">Experience</small>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center cta-section">
        <h3 className="mb-3">Ready to Create Beautiful Memories?</h3>
        <p className="mb-4">Join hundreds of satisfied clients who chose Kizirian Photography for their special moments.</p>
        <div className="mb-4">
          <Link to="/booking" className="btn btn-primary btn-lg me-3">
            Book Your Session Now
          </Link>
          <Link to="/gallery" className="btn btn-outline-primary btn-lg">
            View Our Work
          </Link>
        </div>
        <div className="small text-muted">
          🔒 Secure booking • 📞 Free consultation • 💯 Satisfaction guaranteed<br/>
          Follow <a href="https://instagram.com/kizirian_photography" target="_blank" rel="noopener noreferrer" className="text-decoration-none">@kizirian_photography</a> for daily updates!
        </div>
      </div>
    </div>
  );
}

export default Home;
