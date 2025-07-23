import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";

function FAQ() {
  useEffect(() => {
    document.body.className = 'faq-page';
    return () => {
      document.body.className = '';
    };
  }, []);

  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqCategories = [
    {
      title: "Booking & Scheduling",
      items: [
        {
          question: "How far in advance should I book my session?",
          answer: "We recommend booking at least 2-3 weeks in advance to ensure your preferred date and time. During peak seasons (spring, fall, and holidays), booking 4-6 weeks ahead is recommended."
        },
        {
          question: "What happens if it rains during my outdoor session?",
          answer: "We monitor weather closely and will reschedule your session if conditions are unsafe. Light rain can sometimes create beautiful, dramatic photos if you're willing to embrace it! We'll work with you to find the best solution."
        },
        {
          question: "Can I reschedule my session?",
          answer: "Yes, you can reschedule up to 48 hours before your session without penalty. Same-day cancellations may forfeit the deposit unless due to weather or emergency circumstances."
        },
        {
          question: "How long does each type of session take?",
          answer: "Headshot sessions: 1 hour | Family sessions: 1.5 hours | Couples sessions: 1 hour | Wedding photography: 8+ hours (customizable). Mini sessions are typically 30 minutes."
        }
      ]
    },
    {
      title: "Pricing & Payments",
      items: [
        {
          question: "What forms of payment do you accept?",
          answer: "We accept all major credit cards, PayPal, and cash. A 50% deposit is required to secure your booking, with the remaining balance due at the session."
        },
        {
          question: "Are there any additional fees I should know about?",
          answer: "Our listed prices include all standard services. Additional fees may apply for travel beyond 20 miles from Houston, rush delivery (under 48 hours), or special requests like extensive retouching."
        },
        {
          question: "Do you offer payment plans?",
          answer: "Yes! For wedding photography and larger packages, we offer flexible payment plans. Contact us to discuss options that work for your budget."
        },
        {
          question: "What's included in the session price?",
          answer: "All sessions include professional consultation, the photo session, professional editing, high-resolution digital images, online gallery access, and print release for personal use."
        }
      ]
    },
    {
      title: "Photos & Delivery",
      items: [
        {
          question: "How many photos will I receive?",
          answer: "This varies by session type: Headshots (10+), Couples (20+), Family (25+), Weddings (500+). You receive all professionally edited images that meet our quality standards."
        },
        {
          question: "How long until I receive my photos?",
          answer: "Standard delivery is 48-72 hours for most sessions. Wedding photos take 2-3 weeks due to the extensive editing involved. Rush delivery is available for an additional fee."
        },
        {
          question: "In what format will I receive my photos?",
          answer: "Photos are delivered via an online gallery where you can download high-resolution JPEGs. You also receive a print release allowing you to make prints for personal use."
        },
        {
          question: "Can I request specific editing styles?",
          answer: "Absolutely! During our consultation, we'll discuss your preferred style. We can accommodate various looks from natural and bright to moody and dramatic."
        }
      ]
    },
    {
      title: "Session Preparation",
      items: [
        {
          question: "What should I wear for my session?",
          answer: "We provide a detailed styling guide after booking, but generally: choose clothes that make you feel confident, avoid busy patterns, and coordinate (don't match exactly) for family sessions."
        },
        {
          question: "Can I bring props or special items?",
          answer: "Yes! Personal props add character to your photos. Popular items include instruments, sports equipment, flowers, or family heirlooms. Just let us know in advance so we can plan accordingly."
        },
        {
          question: "What if my child won't cooperate during the session?",
          answer: "We're experienced with children of all ages! We use games, songs, and patience to capture natural smiles. Sessions with young children are kept flexible and fun-focused."
        },
        {
          question: "Should I wear makeup for my session?",
          answer: "We recommend wearing makeup that makes you feel confident. For headshots and professional portraits, slightly heavier makeup than usual photographs well. We can recommend professional makeup artists if interested."
        }
      ]
    },
    {
      title: "Location & Logistics",
      items: [
        {
          question: "Do you travel for sessions?",
          answer: "Yes! We serve the entire Houston metropolitan area. Travel fees apply for locations beyond 20 miles from central Houston. We're happy to suggest beautiful locations or photograph at your preferred spot."
        },
        {
          question: "Can we do the session at my home?",
          answer: "Absolutely! In-home sessions create intimate, personal photos. We just need good natural light from windows or we can bring professional lighting equipment if needed."
        },
        {
          question: "What are your favorite photo locations in Houston?",
          answer: "Some favorites include Hermann Park, Buffalo Bayou Park, The Heights, Downtown Houston, Rice University campus, and various natural areas. We'll suggest the best location based on your session type and preferences."
        }
      ]
    }
  ];

  return (
    <div className="container py-5">
      <Breadcrumbs />
      
      {/* Header Section */}
      <div className="text-center mb-5">
        <h1>Frequently Asked Questions</h1>
        <p className="lead">
          Find answers to common questions about our photography services, booking process, and what to expect during your session.
        </p>
      </div>

      {/* Quick Contact */}
      <div className="alert alert-primary mb-5">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h5 className="mb-2">Still have questions?</h5>
            <p className="mb-0">We're here to help! Contact us directly for personalized answers about your photography needs.</p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <Link to="/contact" className="btn btn-light me-2">Contact Us</Link>
            <Link to="/booking" className="btn btn-outline-light">Book Now</Link>
          </div>
        </div>
      </div>

      {/* FAQ Categories */}
      {faqCategories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="mb-5">
          <h2 className="mb-4">{category.title}</h2>
          <div className="accordion" id={`faqAccordion${categoryIndex}`}>
            {category.items.map((item, itemIndex) => {
              const itemKey = `${categoryIndex}-${itemIndex}`;
              const isOpen = openItems[itemKey];
              
              return (
                <div key={itemIndex} className="accordion-item mb-3">
                  <h3 className="accordion-header" id={`heading${itemKey}`}>
                    <button
                      className={`accordion-button ${!isOpen ? 'collapsed' : ''}`}
                      type="button"
                      onClick={() => toggleItem(itemKey)}
                      aria-expanded={isOpen}
                      aria-controls={`collapse${itemKey}`}
                    >
                      {item.question}
                    </button>
                  </h3>
                  <div
                    id={`collapse${itemKey}`}
                    className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
                    aria-labelledby={`heading${itemKey}`}
                  >
                    <div className="accordion-body">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Additional Resources */}
      <div className="row mb-5">
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Session Preparation Guide</h5>
              <p className="card-text">Get detailed tips on what to wear, how to prepare, and what to expect during your photography session.</p>
              <Link to="/about" className="btn btn-outline-primary">Learn More</Link>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">View Our Work</h5>
              <p className="card-text">Browse our portfolio to see examples of different session types and photography styles.</p>
              <Link to="/gallery" className="btn btn-outline-primary">View Gallery</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact Info */}
      <div className="alert alert-light">
        <h5>Day-of-Session Emergencies</h5>
        <p className="mb-2">If you need to reach us on the day of your session for emergencies or urgent questions:</p>
        <ul className="mb-3">
          <li><strong>Email:</strong> kizirianphotography@gmail.com (fastest response)</li>
          <li><strong>Response Time:</strong> We typically respond within 1-2 hours during business hours</li>
          <li><strong>Weather Updates:</strong> We'll contact you 24 hours before outdoor sessions if weather is questionable</li>
        </ul>
        <small className="text-muted">
          For non-urgent questions, please use our regular contact form for the most comprehensive response.
        </small>
      </div>

      {/* CTA Section */}
      <div className="text-center mt-5">
        <h3>Ready to Book Your Session?</h3>
        <p className="mb-4">We hope these answers have been helpful. Let's create beautiful memories together!</p>
        <Link to="/booking" className="btn btn-primary btn-lg me-3">
          Book Your Session
        </Link>
        <Link to="/services" className="btn btn-outline-primary btn-lg">
          View All Services
        </Link>
      </div>
    </div>
  );
}

export default FAQ;