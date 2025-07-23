import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import portraitImage from "../assets/20230922-1H1A1234.jpg";

function Blog() {
  useEffect(() => {
    document.body.className = 'blog-page';
    return () => {
      document.body.className = '';
    };
  }, []);

  const blogPosts = [
    {
      id: 1,
      title: "5 Tips for Perfect Family Portrait Sessions",
      excerpt: "Learn how to prepare for your family photography session and get the most natural, beautiful photos of your loved ones.",
      date: "January 15, 2025",
      category: "Family Photography",
      image: portraitImage,
      featured: true
    },
    {
      id: 2,
      title: "Professional Headshot Guide: What to Wear and How to Prepare",
      excerpt: "Everything you need to know about preparing for professional headshots that will make you stand out.",
      date: "January 10, 2025",
      category: "Professional Photography",
      image: portraitImage,
      featured: false
    },
    {
      id: 3,
      title: "Houston's Best Photography Locations for Couples",
      excerpt: "Discover the most romantic and picturesque spots around Houston for your engagement or couples photography session.",
      date: "January 5, 2025",
      category: "Couples Photography",
      image: portraitImage,
      featured: false
    },
    {
      id: 4,
      title: "Behind the Scenes: Wedding Photography at Hermann Park",
      excerpt: "A look behind the scenes of a beautiful Houston wedding, from ceremony to reception.",
      date: "December 28, 2024",
      category: "Wedding Photography",
      image: portraitImage,
      featured: true
    },
    {
      id: 5,
      title: "The Art of Natural Light Photography",
      excerpt: "How we use natural light to create stunning portraits that capture authentic emotions and beautiful moments.",
      date: "December 20, 2024",
      category: "Photography Tips",
      image: portraitImage,
      featured: false
    },
    {
      id: 6,
      title: "Holiday Photography: Capturing the Magic of the Season",
      excerpt: "Tips and ideas for creating memorable holiday photos with your family, from decorations to outfits.",
      date: "December 15, 2024",
      category: "Holiday Photography",
      image: portraitImage,
      featured: false
    }
  ];

  const categories = ["All", "Family Photography", "Professional Photography", "Couples Photography", "Wedding Photography", "Photography Tips", "Holiday Photography"];
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="container py-5">
      <Breadcrumbs />
      
      {/* Header Section */}
      <div className="text-center mb-5">
        <h1>Photography Blog & Recent Work</h1>
        <p className="lead">
          Stay updated with our latest photography sessions, tips, and behind-the-scenes stories. 
          Get inspired and learn more about the art of photography.
        </p>
      </div>

      {/* Category Filter */}
      <div className="text-center mb-5">
        <div className="btn-group flex-wrap" role="group" aria-label="Category filter">
          {categories.map(category => (
            <button
              key={category}
              type="button"
              className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-outline-primary'} m-1`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Posts */}
      {selectedCategory === "All" && (
        <div className="mb-5">
          <h2 className="mb-4">Featured Posts</h2>
          <div className="row">
            {blogPosts.filter(post => post.featured).map(post => (
              <div key={post.id} className="col-md-6 mb-4">
                <div className="card h-100 border-warning">
                  <img src={post.image} className="card-img-top" alt={post.title} style={{height: '250px', objectFit: 'cover'}} />
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="badge bg-warning text-dark">{post.category}</small>
                      <small className="text-muted">{post.date}</small>
                    </div>
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text">{post.excerpt}</p>
                    <div className="mt-auto">
                      <Link to={`/blog/${post.id}`} className="btn btn-outline-primary btn-sm">Read More</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Posts */}
      <div className="mb-5">
        <h2 className="mb-4">{selectedCategory === "All" ? "Recent Posts" : `${selectedCategory} Posts`}</h2>
        <div className="row">
          {filteredPosts.map(post => (
            <div key={post.id} className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100">
                <img src={post.image} className="card-img-top" alt={post.title} style={{height: '200px', objectFit: 'cover'}} />
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="badge bg-primary">{post.category}</small>
                    <small className="text-muted">{post.date}</small>
                  </div>
                  <h6 className="card-title">{post.title}</h6>
                  <p className="card-text flex-grow-1">{post.excerpt}</p>
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <Link to={`/blog/${post.id}`} className="btn btn-outline-primary btn-sm">Read More</Link>
                    {post.featured && <small className="badge bg-warning text-dark">Featured</small>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="alert alert-primary mb-5">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h5 className="mb-2">Stay Updated</h5>
            <p className="mb-0">Subscribe to our newsletter for photography tips, latest work, and special offers.</p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <div className="input-group">
              <input type="email" className="form-control" placeholder="Your email" />
              <button className="btn btn-light" type="button">Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      {/* Photography Tips Section */}
      <div className="row mb-5">
        <div className="col-12 mb-4">
          <h2>Quick Photography Tips</h2>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body">
              <h6 className="card-title">Golden Hour Magic</h6>
              <p className="card-text small">Schedule outdoor sessions 1-2 hours before sunset for the most flattering natural light.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body">
              <h6 className="card-title">What to Wear</h6>
              <p className="card-text small">Choose solid colors and avoid busy patterns. Coordinate as a family but don't match exactly.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body">
              <h6 className="card-title">Be Yourself</h6>
              <p className="card-text small">The best photos happen when you're relaxed and having fun. Trust your photographer's guidance.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Client Features */}
      <div className="mb-5">
        <h2 className="mb-4">Recent Client Features</h2>
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="row g-0">
                <div className="col-md-4">
                  <img src={portraitImage} className="img-fluid rounded-start h-100" alt="Client Feature" style={{objectFit: 'cover'}} />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h6 className="card-title">The Johnson Family</h6>
                    <p className="card-text small">A beautiful family session at Hermann Park capturing three generations together.</p>
                    <small className="text-muted">Family Portrait Session</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="row g-0">
                <div className="col-md-4">
                  <img src={portraitImage} className="img-fluid rounded-start h-100" alt="Client Feature" style={{objectFit: 'cover'}} />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h6 className="card-title">Sarah & Michael's Engagement</h6>
                    <p className="card-text small">A romantic sunset engagement session at Buffalo Bayou Park.</p>
                    <small className="text-muted">Engagement Photography</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h3>Inspired by Our Work?</h3>
        <p className="mb-4">Let's create beautiful memories together. Browse our services or book your session today.</p>
        <div className="mb-4">
          <Link to="/services" className="btn btn-primary btn-lg me-3">
            View Services
          </Link>
          <Link to="/booking" className="btn btn-outline-primary btn-lg">
            Book Your Session
          </Link>
        </div>
        <div className="small text-muted">
          Follow us on <a href="https://instagram.com/kizirian_photography" target="_blank" rel="noopener noreferrer">Instagram @kizirian_photography</a> for daily updates and behind-the-scenes content!
        </div>
      </div>
    </div>
  );
}

export default Blog;