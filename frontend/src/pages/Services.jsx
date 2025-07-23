import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import portraitImage from "../assets/20230922-1H1A1234.jpg";

function Services() {
  useEffect(() => {
    document.body.className = 'services-page';
    return () => {
      document.body.className = '';
    };
  }, []);

  return (
    <div className="container py-5">
      <Breadcrumbs />
      
      {/* Header Section */}
      <div className="text-center mb-5">
        <h1>Photography Services</h1>
        <p className="lead">
          Professional photography services tailored to capture your most important moments. 
          From intimate portraits to grand celebrations, we bring artistry and expertise to every session.
        </p>
      </div>

      {/* Main Services */}
      <div className="row mb-5">
        <div className="col-12 text-center mb-4">
          <h2>Session Packages</h2>
          <p className="text-muted">Comprehensive photography packages designed for your unique needs</p>
        </div>
        
        {/* Professional Headshots */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="row g-0">
              <div className="col-md-4">
                <img src={portraitImage} className="img-fluid rounded-start h-100" alt="Professional Headshots" style={{objectFit: 'cover'}} />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h4 className="card-title">Professional Headshots</h4>
                  <div className="h5 text-success mb-3">Starting at $115</div>
                  <ul className="list-unstyled mb-3">
                    <li>✓ 1-hour studio or outdoor session</li>
                    <li>✓ 3-5 outfit changes</li>
                    <li>✓ Professional retouching</li>
                    <li>✓ 10+ high-resolution images</li>
                    <li>✓ 48-hour delivery</li>
                    <li>✓ Print release included</li>
                  </ul>
                  <p className="card-text small text-muted">Perfect for LinkedIn profiles, corporate websites, personal branding, and professional marketing materials.</p>
                  <Link to="/booking" className="btn btn-primary btn-sm">Book Session</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Family Portraits */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100 border-primary">
            <div className="row g-0">
              <div className="col-md-4">
                <img src={portraitImage} className="img-fluid rounded-start h-100" alt="Family Portraits" style={{objectFit: 'cover'}} />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h4 className="card-title">Family Portraits <small className="badge bg-primary ms-2">Most Popular</small></h4>
                  <div className="h5 text-success mb-3">Starting at $225</div>
                  <ul className="list-unstyled mb-3">
                    <li>✓ 1.5-hour session</li>
                    <li>✓ Multiple locations/poses</li>
                    <li>✓ Professional editing</li>
                    <li>✓ 25+ high-resolution images</li>
                    <li>✓ Online gallery access</li>
                    <li>✓ 72-hour delivery</li>
                  </ul>
                  <p className="card-text small text-muted">Capture precious moments with your loved ones. Perfect for holiday cards, wall art, and family memories.</p>
                  <Link to="/booking" className="btn btn-primary btn-sm">Book Session</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Couples & Engagement */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="row g-0">
              <div className="col-md-4">
                <img src={portraitImage} className="img-fluid rounded-start h-100" alt="Couples Photography" style={{objectFit: 'cover'}} />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h4 className="card-title">Couples & Engagement</h4>
                  <div className="h5 text-success mb-3">Starting at $190</div>
                  <ul className="list-unstyled mb-3">
                    <li>✓ 1-hour romantic session</li>
                    <li>✓ Multiple outfit options</li>
                    <li>✓ Creative poses and locations</li>
                    <li>✓ 20+ edited images</li>
                    <li>✓ Print release included</li>
                    <li>✓ 48-hour delivery</li>
                  </ul>
                  <p className="card-text small text-muted">Perfect for engagements, anniversaries, save-the-dates, and romantic couple portraits.</p>
                  <Link to="/booking" className="btn btn-primary btn-sm">Book Session</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wedding Photography */}
        <div className="col-lg-6 mb-4" id="wedding">
          <div className="card h-100 border-warning">
            <div className="row g-0">
              <div className="col-md-4">
                <img src={portraitImage} className="img-fluid rounded-start h-100" alt="Wedding Photography" style={{objectFit: 'cover'}} />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h4 className="card-title">Wedding Photography <small className="badge bg-warning text-dark ms-2">Premium</small></h4>
                  <div className="h5 text-success mb-3">Custom Packages</div>
                  <ul className="list-unstyled mb-3">
                    <li>✓ Full day coverage (8+ hours)</li>
                    <li>✓ Engagement session included</li>
                    <li>✓ 500+ edited images</li>
                    <li>✓ Online gallery for sharing</li>
                    <li>✓ Print release & USB delivery</li>
                    <li>✓ 2-week delivery timeline</li>
                  </ul>
                  <p className="card-text small text-muted">Comprehensive wedding photography documenting every moment of your special day with artistic storytelling.</p>
                  <Link to="/contact" className="btn btn-warning btn-sm">Request Quote</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Services */}
      <div className="row mb-5">
        <div className="col-12 text-center mb-4">
          <h2>Specialized Sessions</h2>
          <p className="text-muted">Additional photography services for unique occasions</p>
        </div>
        
        <div className="col-md-3 mb-4">
          <div className="card text-center h-100">
            <div className="card-body">
              <h5 className="card-title">Senior Portraits</h5>
              <div className="h6 text-success mb-2">$115</div>
              <p className="card-text small">Celebrating your graduate with professional senior portraits</p>
              <Link to="/booking" className="btn btn-outline-primary btn-sm">Book Now</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-4">
          <div className="card text-center h-100">
            <div className="card-body">
              <h5 className="card-title">Pet Photography</h5>
              <div className="h6 text-success mb-2">$150</div>
              <p className="card-text small">Professional portraits of your furry family members</p>
              <Link to="/booking" className="btn btn-outline-primary btn-sm">Book Now</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-4">
          <div className="card text-center h-100">
            <div className="card-body">
              <h5 className="card-title">Holiday Mini Sessions</h5>
              <div className="h6 text-success mb-2">$90</div>
              <p className="card-text small">Quick 30-minute sessions perfect for holiday cards</p>
              <Link to="/booking" className="btn btn-outline-primary btn-sm">Book Now</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-4">
          <div className="card text-center h-100">
            <div className="card-body">
              <h5 className="card-title">Event Photography</h5>
              <div className="h6 text-success mb-2">Contact for pricing</div>
              <p className="card-text small">Corporate events, parties, and special occasions</p>
              <Link to="/contact" className="btn btn-outline-primary btn-sm">Get Quote</Link>
            </div>
          </div>
        </div>
      </div>

      {/* What's Included */}
      <div className="alert alert-light mb-5">
        <h4 className="alert-heading">What's Included in Every Session</h4>
        <div className="row">
          <div className="col-md-4">
            <ul className="list-unstyled">
              <li>✓ Professional consultation</li>
              <li>✓ Creative direction and posing</li>
              <li>✓ High-resolution digital images</li>
            </ul>
          </div>
          <div className="col-md-4">
            <ul className="list-unstyled">
              <li>✓ Professional editing and retouching</li>
              <li>✓ Online gallery for easy sharing</li>
              <li>✓ Print release for personal use</li>
            </ul>
          </div>
          <div className="col-md-4">
            <ul className="list-unstyled">
              <li>✓ Quick turnaround (48-72 hours)</li>
              <li>✓ Personalized customer service</li>
              <li>✓ Satisfaction guarantee</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Booking CTA */}
      <div className="text-center">
        <h3 className="mb-3">Ready to Book Your Session?</h3>
        <p className="mb-4">Let's create beautiful memories together. Choose your session type and schedule today.</p>
        <div className="mb-4">
          <Link to="/booking" className="btn btn-primary btn-lg me-3">
            Book Your Session
          </Link>
          <Link to="/contact" className="btn btn-outline-primary btn-lg">
            Ask Questions
          </Link>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-info">
              <small>
                <strong>Booking Requirements:</strong> All sessions require a 50% deposit to secure your date. 
                Email verification is required for all bookings. Sessions must be booked at least 48 hours in advance.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;