import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus("Message sent successfully! We'll get back to you within 24 hours.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus(result.error || "Something went wrong.");
      }
    } catch (error) {
      setStatus("Failed to send message.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row">
        {/* Left Column - Contact Form */}
        <div className="col-lg-8">
          <h1 className="mb-4">Get in Touch</h1>
          <p className="text-muted mb-4">
            Have questions about our services, want to discuss your vision, or ready to book? 
            We'd love to hear from you! Send us a message and we'll respond within 24 hours.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Your Name *</label>
              <input
                name="name"
                type="text"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name (e.g., Sarah Johnson)"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email Address *</label>
              <input
                name="email"
                type="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@gmail.com"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Message *</label>
              <textarea
                name="message"
                rows="5"
                className="form-control"
                value={formData.message}
                onChange={handleChange}
                placeholder="Hi Alex! I'm interested in booking a family portrait session. I'd prefer outdoor shots in a park setting, and I'm flexible with dates in the next month. Do you have any availability?"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={submitting}
            >
              {submitting ? "Sending..." : "Send Message"}
            </button>

            {status && (
              <div className={`alert mt-3 ${status.includes("successfully") ? "alert-success" : "alert-danger"}`}>
                {status}
              </div>
            )}
          </form>
        </div>

        {/* Right Column - Contact Info & Quick Actions */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">📞 Contact Information</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <h6>📧 Email</h6>
                <p className="text-muted">kizirianphotography@gmail.com</p>
              </div>
              <div className="mb-3">
                <h6>📷 Instagram</h6>
                <p className="text-muted">
                  <a 
                    href="https://instagram.com/kizirian_photography" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                  >
                    @kizirian_photography
                  </a>
                </p>
              </div>
              <div className="mb-3">
                <h6>📍 Service Area</h6>
                <p className="text-muted">Houston Metropolitan Area</p>
              </div>
              <div className="mb-3">
                <h6>⏰ Response Time</h6>
                <p className="text-muted">Within 24 hours</p>
              </div>
              <hr />
              <div className="text-center">
                <h6 className="mb-3">Ready to Book?</h6>
                <Link to="/booking" className="btn btn-success btn-lg w-100 mb-3">
                  Book Your Session
                </Link>
                <Link to="/gallery" className="btn btn-outline-primary w-100">
                  View Our Work
                </Link>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="card mt-4">
            <div className="card-header">
              <h5 className="mb-0">❓ Quick Questions</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <h6>What's included in a session?</h6>
                <p className="text-muted small">Professional editing, high-resolution images, and personal consultation.</p>
              </div>
              <div className="mb-3">
                <h6>How long is the turnaround?</h6>
                <p className="text-muted small">48-72 hours for edited photos.</p>
              </div>
              <div className="mb-0">
                <h6>Do you travel for sessions?</h6>
                <p className="text-muted small">Yes! We serve the entire Houston metro area.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
