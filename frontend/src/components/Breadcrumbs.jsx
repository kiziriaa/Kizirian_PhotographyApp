import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbNameMap = {
    '/': 'Home',
    '/about': 'About',
    '/gallery': 'Gallery',
    '/contact': 'Contact',
    '/booking': 'Book Session',
    '/purchase': 'Purchase'
  };

  if (pathnames.length === 0) {
    return null; // Don't show breadcrumbs on home page
  }

  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/" className="text-decoration-none">
            Home
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const breadcrumbName = breadcrumbNameMap[to] || value.charAt(0).toUpperCase() + value.slice(1);

          return last ? (
            <li key={to} className="breadcrumb-item active" aria-current="page">
              {breadcrumbName}
            </li>
          ) : (
            <li key={to} className="breadcrumb-item">
              <Link to={to} className="text-decoration-none">
                {breadcrumbName}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;