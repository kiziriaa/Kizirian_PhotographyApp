import React, { useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import Logo from './Logo'

function Navbar() {
  useEffect(() => {
    // Auto-collapse navbar on mobile when navigation links are clicked
    const navbarCollapse = document.getElementById('navbarNav');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .dropdown-item');
    
    const handleNavLinkClick = () => {
      if (window.innerWidth < 992) { // Bootstrap lg breakpoint
        const bsCollapse = new window.bootstrap.Collapse(navbarCollapse, {
          toggle: false
        });
        bsCollapse.hide();
      }
    };

    navLinks.forEach(link => {
      link.addEventListener('click', handleNavLinkClick);
    });

    return () => {
      navLinks.forEach(link => {
        link.removeEventListener('click', handleNavLinkClick);
      });
    };
  }, []);
  return (
    <nav className="navbar navbar-expand-lg navbar-light sticky-top shadow-lg">
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/" aria-label="Go to home page">
          <Logo size="small" className="me-2" />
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink 
                to="/services" 
                className={({ isActive }) => 
                  `nav-link px-3 py-2 rounded mx-1 ${isActive ? 'active' : ''}`
                }
                aria-label="Photography services and packages"
              >
                Services
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/gallery" 
                className={({ isActive }) => 
                  `nav-link px-3 py-2 rounded mx-1 ${isActive ? 'active' : ''}`
                }
                aria-label="View photography gallery"
              >
                Portfolio
              </NavLink>
            </li>
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle px-3 py-2 rounded mx-1" 
                href="#" 
                id="navbarDropdown" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
                aria-label="More pages and resources"
              >
                Info
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <NavLink 
                    to="/about" 
                    className="dropdown-item"
                    aria-label="About Alex Kizirian Photography"
                  >
                    About Alex
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/blog" 
                    className="dropdown-item"
                    aria-label="Photography blog and recent work"
                  >
                    Recent Work
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/faq" 
                    className="dropdown-item"
                    aria-label="Frequently asked questions"
                  >
                    FAQ
                  </NavLink>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <a 
                    className="dropdown-item" 
                    href="https://instagram.com/kizirian_photography" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="Follow us on Instagram (opens in new tab)"
                  >
                    <i className="fab fa-instagram me-2"></i>Instagram
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/contact" 
                className={({ isActive }) => 
                  `nav-link px-3 py-2 rounded mx-1 ${isActive ? 'active' : ''}`
                }
                aria-label="Contact information and form"
              >
                Contact
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/booking" 
                className={({ isActive }) =>
                  `nav-link px-3 py-2 rounded mx-1 fw-bold ${
                    isActive
                      ? 'bg-primary text-white border border-primary'
                      : 'bg-primary text-white border border-primary'
                  }`
                }
                aria-label="Book a photography session"
                style={{ whiteSpace: 'nowrap' }}
              >
                Book Session
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
