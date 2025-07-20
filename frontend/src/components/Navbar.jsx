import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

function Navbar() {
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
                to="/" 
                className={({ isActive }) => 
                  `nav-link px-3 py-2 rounded mx-1 ${isActive ? 'active' : ''}`
                } 
                end
                aria-label="Go to home page"
              >
                Home
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
                Gallery
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/booking" 
                className={({ isActive }) =>
                  `nav-link px-3 py-2 rounded mx-1 fw-bold ${
                    isActive
                      ? 'bg-primary text-white border border-primary'
                      : 'bg-white border border-primary text-primary'
                  }`
                }
                aria-label="Book a photography session"
                style={{ whiteSpace: 'nowrap' }} // force one line
              >
                Book Now
              </NavLink>
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
              <a 
                href="https://instagram.com/kizirian_photography" 
                target="_blank" 
                rel="noopener noreferrer"
                className="nav-link px-3 py-2 rounded mx-1"
                aria-label="Follow us on Instagram (opens in new tab)"
              >
                Instagram
              </a>
            </li>
            <li className="nav-item">
              <ThemeToggle />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
