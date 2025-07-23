import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";

// Dynamically import all images from these folders
const landscapeImports = import.meta.glob("../assets/Landscapes/*.{jpg,jpeg,png}", { eager: true });
const wildlifeImports = import.meta.glob("../assets/Wildlife/*.{jpg,jpeg,png}", { eager: true });
const headshotsImports = import.meta.glob("../assets/Headshots/*.{jpg,jpeg,png}", { eager: true });
const familyImports = import.meta.glob("../assets/Family/*.{jpg,jpeg,png}", { eager: true });
const petsImports = import.meta.glob("../assets/Pets/*.{jpg,jpeg,png}", { eager: true });
const couplesImports = import.meta.glob("../assets/Couples/*.{jpg,jpeg,png}", { eager: true });

// Convert imports into structured image objects with pricing info
const toImageObjects = (importObj, category) =>
  Object.entries(importObj).map(([path, mod]) => ({
    src: mod.default,
    filename: path.split("/").pop(),
    category,
    // Add pricing based on category - only nature photos are for sale
    prints: (category === "Landscapes" || category === "Wildlife") ? {
      digital: { price: 15, shipping: 0, description: "Instant download" },
      print8x10: { price: 25, shipping: 8, description: "8x10 Professional Print" },
      print11x14: { price: 35, shipping: 10, description: "11x14 Professional Print" },
      print16x20: { price: 55, shipping: 15, description: "16x20 Professional Print" },
      canvas: { price: 85, shipping: 20, description: "Canvas Gallery Wrap" },
      metal: { price: 95, shipping: 25, description: "Metal Print with Float Mount" },
      licensing: { price: 150, shipping: 0, description: "Commercial License" }
    } : null,
    available: category === "Landscapes" || category === "Wildlife" // Only landscapes and wildlife are for sale
  }));

const images = [
  ...toImageObjects(landscapeImports, "Landscapes"),
  ...toImageObjects(wildlifeImports, "Wildlife"),
  ...toImageObjects(headshotsImports, "Headshots"),
  ...toImageObjects(familyImports, "Family"),
  ...toImageObjects(petsImports, "Pet Photos"),
  ...toImageObjects(couplesImports, "Couples"),
];

const galleryCategories = [
  { name: "All", description: "All photography work" },
  { name: "Headshots", description: "Corporate and personal headshots" },
  { name: "Family", description: "Family portrait sessions" },
  { name: "Couples", description: "Couple portrait sessions" },
  { name: "Pet Photos", description: "Pet and animal photography" },
  { name: "Landscapes", description: "Nature & scenery photography" },
  { name: "Wildlife", description: "Animal & nature photography" }
];

function Gallery() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedOrientation, setSelectedOrientation] = useState("landscape");
  const [activeCategory, setActiveCategory] = useState("All");
  const [orientationMap, setOrientationMap] = useState({});
  const [imageLoading, setImageLoading] = useState({});

  useEffect(() => {
    document.body.className = 'gallery-page';
    return () => {
      document.body.className = '';
    };
  }, []);

  useEffect(() => {
    const preloadAndDetect = async () => {
      const map = {};
      for (const img of images) {
        const imageObj = new Image();
        imageObj.src = img.src;
        await new Promise((res) => {
          imageObj.onload = () => {
            map[img.src] =
              imageObj.naturalHeight > imageObj.naturalWidth
                ? "portrait"
                : "landscape";
            res();
          };
        });
      }
      setOrientationMap(map);
    };
    preloadAndDetect();
  }, []);

  // Keyboard and touch navigation for modal
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!selectedImage) return;

      const filtered = getFilteredImages();
      const currentIndex = filtered.findIndex(img => img.src === selectedImage.src);

      if (event.key === 'ArrowLeft') {
        // Navigate to previous image
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : filtered.length - 1;
        const prevImage = filtered[prevIndex];
        if (prevImage) {
          setSelectedImage(prevImage);
          setSelectedOrientation(orientationMap[prevImage.src] || "landscape");
        }
      } else if (event.key === 'ArrowRight') {
        // Navigate to next image
        const nextIndex = currentIndex < filtered.length - 1 ? currentIndex + 1 : 0;
        const nextImage = filtered[nextIndex];
        if (nextImage) {
          setSelectedImage(nextImage);
          setSelectedOrientation(orientationMap[nextImage.src] || "landscape");
        }
      } else if (event.key === 'Escape') {
        // Close modal
        setSelectedImage(null);
      }
    };

    // Touch/swipe navigation
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      if (!selectedImage) return;
      
      const swipeThreshold = 50; // minimum distance for swipe
      const swipeDistance = touchStartX - touchEndX;

      if (Math.abs(swipeDistance) > swipeThreshold) {
        const filtered = getFilteredImages();
        const currentIndex = filtered.findIndex(img => img.src === selectedImage.src);

        if (swipeDistance > 0) {
          // Swiped left - go to next image
          const nextIndex = currentIndex < filtered.length - 1 ? currentIndex + 1 : 0;
          const nextImage = filtered[nextIndex];
          if (nextImage) {
            setSelectedImage(nextImage);
            setSelectedOrientation(orientationMap[nextImage.src] || "landscape");
          }
        } else {
          // Swiped right - go to previous image
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : filtered.length - 1;
          const prevImage = filtered[prevIndex];
          if (prevImage) {
            setSelectedImage(prevImage);
            setSelectedOrientation(orientationMap[prevImage.src] || "landscape");
          }
        }
      }
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleKeyPress);
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [selectedImage, orientationMap]);

  // Filter images based on selected category
  const getFilteredImages = () => {
    if (activeCategory === "All") {
      return images;
    } else {
      return images.filter(img => img.category === activeCategory);
    }
  };

  const filtered = getFilteredImages();


  const handleImageClick = (img) => {
    setSelectedImage(img);
    setSelectedOrientation(orientationMap[img.src] || "landscape");
  };

  const navigateImage = (direction) => {
    if (!selectedImage) return;

    const filtered = getFilteredImages();
    const currentIndex = filtered.findIndex(img => img.src === selectedImage.src);

    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filtered.length - 1;
    } else {
      newIndex = currentIndex < filtered.length - 1 ? currentIndex + 1 : 0;
    }

    const newImage = filtered[newIndex];
    if (newImage) {
      setSelectedImage(newImage);
      setSelectedOrientation(orientationMap[newImage.src] || "landscape");
    }
  };

  const handlePurchaseClick = (e, img) => {
    e.stopPropagation();
    handleContactForPricing(img);
  };

  const handleContactForPricing = (img) => {
    navigate(`/contact?photo=${encodeURIComponent(img.filename)}`);
  };

  const sendPurchaseInquiry = (img, productType) => {
    const subject = `Purchase Inquiry - ${img.filename}`;
    const body = `Hi Alex,

I'm interested in purchasing "${img.filename}" as a ${productType}.

Please let me know about:
- Available sizes and pricing
- Payment methods
- Delivery options
- Any customization options

Thank you!`;
    
    window.location.href = `mailto:kizirianphotography@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="container py-5">
      <Breadcrumbs />
      {/* Hero Section */}
      <div className="text-center mb-5">
        <h1>Photography Gallery</h1>
        <p className="lead">
          Explore our portfolio of portraits, landscapes, and wildlife photography
        </p>
      </div>

      {/* Welcome Banner */}
      <div className="alert alert-info text-center mb-4">
        <h5 className="mb-2">Professional Photography</h5>
        <p className="mb-0">Browse our work and discover the style that's perfect for your needs.</p>
        <Link to="/booking" className="btn btn-primary btn-sm mt-2">
          Book Your Session
        </Link>
      </div>

      {/* Category Filters */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="filter-buttons">
            {galleryCategories.map((cat) => (
              <button
                key={cat.name}
                className={`filter-btn ${activeCategory === cat.name ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.name)}
              >
                {cat.name}
                <span className="badge ms-2">
                  {cat.name === "All" ? 
                    images.length :
                    images.filter(img => img.category === cat.name).length
                  }
                </span>
              </button>
            ))}
          </div>
          <div className="text-center text-muted mt-2">
            {galleryCategories.find(cat => cat.name === activeCategory)?.description}
          </div>
        </div>
      </div>

      {/* Image Grid */}
      <div className="row g-4">
        {filtered.map((img, idx) => (
          <div className="col-6 col-md-4 col-lg-3" key={idx}>
            <div
              className="gallery-card position-relative"
              onClick={() => handleImageClick(img)}
              style={{ cursor: "pointer" }}
            >
              <div className="position-relative">
                <img
                  src={img.src}
                  alt={`${img.category} photography by Kizirian Photography - ${img.filename}`}
                  className={`card-img-top img-fluid rounded ${imageLoading[img.src] ? 'image-loading' : ''}`}
                  style={{ height: "200px", objectFit: "cover" }}
                  loading="lazy"
                  decoding="async"
                  onLoad={() => setImageLoading(prev => ({ ...prev, [img.src]: false }))}
                  onLoadStart={() => setImageLoading(prev => ({ ...prev, [img.src]: true }))}
                />
                
                {/* Action Buttons Overlay */}
                <div className="gallery-overlay position-absolute w-100 h-100 d-flex flex-column justify-content-between p-2" style={{opacity: 0, transition: 'opacity 0.3s ease'}}>
                  <div className="d-flex justify-content-end">
                    {img.available && (
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={(e) => handlePurchaseClick(e, img)}
                        style={{ fontSize: "0.75rem" }}
                        aria-label={`Purchase print of ${img.filename}`}
                      >
                        Buy Print
                      </button>
                    )}
                    <Link
                      to={`/booking?style=${img.category.toLowerCase()}`}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: "0.75rem" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Book This Style
                    </Link>
                  </div>
                  <div className="d-flex justify-content-between align-items-end">
                    <span className="badge bg-primary">{img.category}</span>
                    <small className="text-white bg-dark px-2 py-1 rounded">{img.filename}</small>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Modal View */}
      {selectedImage && (
        <div className="gallery-modal-backdrop" onClick={() => setSelectedImage(null)}>
          <div
            className="gallery-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "95vw",
              height: "95vh",
              maxWidth: "95vw",
              maxHeight: "95vh",
              margin: "0 auto",
              overflow: "hidden"
            }}
          >
            <button 
              className="close-btn" 
              onClick={() => setSelectedImage(null)}
              aria-label="Close image modal"
            >
              ×
            </button>

            {/* Navigation Arrows */}
            <button 
              className="nav-btn nav-btn-prev" 
              onClick={() => navigateImage('prev')}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button 
              className="nav-btn nav-btn-next" 
              onClick={() => navigateImage('next')}
              aria-label="Next image"
            >
              ›
            </button>
            <div 
              className="image-container" 
              style={{ 
                width: "100%", 
                height: "70%", 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center",
                marginBottom: "1rem"
              }}
            >
              <img
                src={selectedImage.src}
                alt={`Full size view of ${selectedImage.category} photography - ${selectedImage.filename}`}
                className="modal-img"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: "8px"
                }}
                loading="eager"
                decoding="sync"
              />
            </div>
            <div className="text-center" style={{ maxHeight: "25%", overflowY: "auto" }}>
              <div className="text-muted small mb-2">
                {selectedImage.filename.replace(/\.[^/.]+$/, "")}
              </div>
              <div className="text-muted small mb-3 d-none d-md-block">
                Use ← → arrow keys or click arrows to navigate • Press Esc to close
              </div>
              <div className="d-flex justify-content-center gap-2 mb-2">
                <span className="badge bg-primary">{selectedImage.category}</span>
                {selectedImage.available && (
                  <span className="badge bg-success">Available for Purchase</span>
                )}
              </div>
              
              {/* Purchase Options - Desktop View */}
              {selectedImage.available && (
                <div className="mt-2 d-none d-md-block">
                  <h6 className="text-muted mb-2 small">Available for Purchase:</h6>
                  <div className="d-flex justify-content-center">
                    <button
                      className="btn btn-primary btn-lg"
                      onClick={() => handleContactForPricing(selectedImage)}
                      style={{ fontSize: "1rem", padding: "0.5rem 1.5rem" }}
                    >
                      Contact for Pricing
                    </button>
                  </div>
                  <div className="mt-2 text-center">
                    <small className="text-muted">
                      Available formats: Digital downloads, prints, canvas, metal prints, and commercial licensing
                    </small>
                  </div>
                </div>
              )}

              {/* Purchase Options - Mobile View */}
              {selectedImage.available && (
                <div className="mobile-purchase-options d-md-none">
                  <h6 className="text-muted mb-2 small">Available for Purchase:</h6>
                  <div className="text-center">
                    <button
                      className="btn btn-primary w-100 mb-2"
                      onClick={() => handleContactForPricing(selectedImage)}
                      style={{ fontSize: "0.9rem", padding: "0.5rem" }}
                    >
                      Contact for Pricing
                    </button>
                    <small className="text-muted d-block">
                      Available formats: Digital downloads, prints, canvas, metal prints, and commercial licensing
                    </small>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Additional Services Section */}
      <div className="mt-5 pt-5 border-top">
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Custom Photography Services</h5>
              </div>
              <div className="card-body">
                <h6>Nature & Wildlife Photography</h6>
                <p className="text-muted small">
                  Need custom nature photography for your business, publication, or personal collection? 
                  I offer specialized nature and wildlife photography services.
                </p>
                <ul className="list-unstyled small text-muted">
                  <li>• Corporate nature photography</li>
                  <li>• Stock photography creation</li>
                  <li>• Custom landscape commissions</li>
                  <li>• Wildlife documentation</li>
                </ul>
                <Link to="/contact" className="btn btn-outline-primary btn-sm">
                  Inquire About Custom Work
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;
