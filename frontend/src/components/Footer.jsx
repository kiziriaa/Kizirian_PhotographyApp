import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer mt-5 py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-6 mb-3 mb-md-0">
            <h5>Kizirian Photography</h5>
            <p className="text-muted mb-2">Professional photography services in Houston, Texas</p>
            <div className="mb-2">
              <small className="text-muted">
                <strong>Email:</strong> kizirianphotography@gmail.com
              </small>
            </div>
            <div className="mb-2">
              <small className="text-muted">
                <strong>Service Area:</strong> Houston Metropolitan Area
              </small>
            </div>
          </div>
          
          <div className="col-md-3 mb-3 mb-md-0">
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
              <li><Link to="/gallery" className="text-decoration-none text-muted">Gallery</Link></li>
              <li><Link to="/booking" className="text-decoration-none text-muted">Book Session</Link></li>
              <li><Link to="/contact" className="text-decoration-none text-muted">Contact</Link></li>
            </ul>
          </div>
          
          <div className="col-md-3">
            <h6>Connect</h6>
            <div className="mb-2">
              <a 
                href="https://instagram.com/kizirian_photography" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-decoration-none text-muted"
              >
                Instagram
              </a>
            </div>
            <div className="mb-2">
              <small className="text-muted">Response within 24 hours</small>
            </div>
          </div>
        </div>
        
        <hr className="my-4" />
        
        <div className="row align-items-center">
          <div className="col-md-6">
            <small className="text-muted">
              © {currentYear} Kizirian Photography. All rights reserved.
            </small>
          </div>
          <div className="col-md-6 text-md-end">
            <small className="text-muted">
              Professional Photography Services | Houston, TX
            </small>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;