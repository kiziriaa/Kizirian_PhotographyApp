import React from 'react'
import { NavLink, Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light sticky-top shadow-lg">
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <span className="d-none d-sm-inline">Kizirian Photography</span>
          <span className="d-inline d-sm-none">Kizirian</span>
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
                  `nav-link px-3 py-2 rounded-pill mx-1 ${isActive ? 'active' : ''}`
                } 
                end
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/gallery" 
                className={({ isActive }) => 
                  `nav-link px-3 py-2 rounded-pill mx-1 ${isActive ? 'active' : ''}`
                }
              >
                Gallery
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/booking" 
                className={({ isActive }) => 
                  `nav-link px-3 py-2 rounded-pill mx-1 btn-primary text-white ${isActive ? 'active' : ''}`
                }
              >
                Book Now
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/contact" 
                className={({ isActive }) => 
                  `nav-link px-3 py-2 rounded-pill mx-1 ${isActive ? 'active' : ''}`
                }
              >
                Contact
              </NavLink>
            </li>
            <li className="nav-item">
              <a 
                href="https://instagram.com/kizirian_photography" 
                target="_blank" 
                rel="noopener noreferrer"
                className="nav-link px-3 py-2 rounded-pill mx-1"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
