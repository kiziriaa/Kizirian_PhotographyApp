import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import portraitImage from "../assets/20230922-1H1A1234.jpg";

function About() {
  useEffect(() => {
    document.body.className = 'about-page';
    return () => {
      document.body.className = '';
    };
  }, []);

  return (
    <div className="container py-5">
      <Breadcrumbs />
      {/* Hero Section */}
      <div className="text-center mb-5">
        <h1>About Kizirian Photography</h1>
        <p className="lead">
          Professional photography services in Houston, Texas
        </p>
      </div>

      {/* Main About Content */}
      <div className="row align-items-center mb-5">
        <div className="col-md-6 mb-4 mb-md-0">
          <img src={portraitImage} alt="Alex Kizirian, Professional Photographer" className="img-fluid rounded shadow" />
        </div>
        <div className="col-md-6">
          <h2>Meet Alex Kizirian</h2>
          <p>
            Hi, I'm Alex Kizirian — a Houston-based photographer specializing in portraits, family photography, and professional headshots. With experience in adventure, nature, and portrait photography, I bring technical expertise and creative vision to every session.
          </p>
          <p>
            My approach focuses on capturing authentic moments and genuine expressions. I work closely with each client to understand their vision and deliver high-quality images that exceed expectations.
          </p>
          <p>
            Whether you need corporate headshots that convey professionalism, family portraits that capture precious moments, or creative sessions that showcase your personality, I'm here to help bring your vision to life.
          </p>
          <div className="mt-4">
            <Link to="/contact" className="btn btn-primary me-3">
              Get in Touch
            </Link>
            <Link to="/booking" className="btn btn-outline-primary">
              Book a Session
            </Link>
          </div>
        </div>
      </div>

      {/* Experience & Approach */}
      <div className="row mb-5">
        <div className="col-12">
          <h2 className="text-center mb-4">Photography Philosophy</h2>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <h4 className="card-title">Authentic Moments</h4>
              <p className="card-text">I believe the best photographs capture genuine emotions and natural interactions. My goal is to make you feel comfortable so your true personality shines through.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <h4 className="card-title">Technical Excellence</h4>
              <p className="card-text">With experience across multiple photography disciplines, I bring professional-grade equipment and technical knowledge to every session.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <h4 className="card-title">Client-Focused Service</h4>
              <p className="card-text">Every session is tailored to your specific needs and preferences. From initial consultation to final delivery, your satisfaction is my priority.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Overview */}
      <div className="row mb-5">
        <div className="col-12">
          <h2 className="text-center mb-4">Specializations</h2>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Portrait Photography</h5>
            </div>
            <div className="card-body">
              <ul className="list-unstyled">
                <li>• Professional headshots for business and LinkedIn</li>
                <li>• Family portrait sessions</li>
                <li>• Couple and engagement photography</li>
                <li>• Senior portrait sessions</li>
                <li>• Pet and animal photography</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Nature & Landscape</h5>
            </div>
            <div className="card-body">
              <ul className="list-unstyled">
                <li>• Landscape and scenic photography</li>
                <li>• Wildlife and nature documentation</li>
                <li>• Adventure and outdoor photography</li>
                <li>• Fine art prints available for purchase</li>
                <li>• Custom nature photography commissions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment & Process */}
      <div className="row mb-5">
        <div className="col-md-6 mb-4">
          <h3>Professional Equipment</h3>
          <p>
            I use professional-grade cameras and lenses to ensure the highest quality results. All sessions include professional editing and color correction to deliver images that meet commercial standards.
          </p>
          <p>
            High-resolution files are provided for all portrait sessions, with various print sizes and digital formats available.
          </p>
        </div>
        <div className="col-md-6 mb-4">
          <h3>Session Process</h3>
          <p>
            Each session begins with a consultation to understand your goals and preferences. During the shoot, I provide gentle direction while capturing both posed and candid moments.
          </p>
          <p>
            Edited photos are typically delivered within 48-72 hours, allowing you to quickly share and use your images.
          </p>
        </div>
      </div>

      {/* Service Area */}
      <div className="alert alert-info text-center">
        <h5 className="mb-2">Service Area</h5>
        <p className="mb-0">
          Based in Houston, Texas, serving the entire Houston Metropolitan Area including Sugar Land, The Woodlands, Katy, and surrounding communities.
        </p>
        <small className="text-muted d-block mt-2">
          Travel fees may apply for locations outside the immediate Houston area
        </small>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-5">
        <h3 className="mb-3">Ready to Work Together?</h3>
        <p className="mb-4">Let's discuss your photography needs and create something beautiful together.</p>
        <Link to="/contact" className="btn btn-primary btn-lg me-3">
          Contact Me
        </Link>
        <Link to="/gallery" className="btn btn-outline-primary btn-lg">
          View My Work
        </Link>
      </div>
    </div>
  );
}

export default About;