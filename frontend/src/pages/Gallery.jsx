import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

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

const mainCategories = [
  { name: "Portfolio", description: "Professional portrait work and session examples" },
  { name: "Print Shop", description: "Fine art prints available for purchase" }
];

const portfolioCategories = [
  { name: "All Portfolio", description: "All professional portrait work" },
  { name: "Headshots", description: "Corporate and personal headshots" },
  { name: "Family", description: "Family portrait sessions" },
  { name: "Couples", description: "Couple portrait sessions" },
  { name: "Pet Photos", description: "Pet and animal photography" }
];

const printCategories = [
  { name: "All Prints", description: "All available prints" },
  { name: "Landscapes", description: "Nature & scenery prints" },
  { name: "Wildlife", description: "Animal & nature prints" }
];

function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedOrientation, setSelectedOrientation] = useState("landscape");
  const [activeMainCategory, setActiveMainCategory] = useState("Portfolio");
  const [activeSubCategory, setActiveSubCategory] = useState("All Portfolio");
  const [viewCounts, setViewCounts] = useState({});
  const [orientationMap, setOrientationMap] = useState({});
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

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

  // Filter images based on main category and sub-category
  const getFilteredImages = () => {
    if (activeMainCategory === "Portfolio") {
      if (activeSubCategory === "All Portfolio") {
        return images.filter(img => 
          img.category === "Headshots" || 
          img.category === "Family" || 
          img.category === "Couples" ||
          img.category === "Pet Photos"
        );
      } else {
        return images.filter(img => img.category === activeSubCategory);
      }
    } else { // Print Shop
      if (activeSubCategory === "All Prints") {
        return images.filter(img => img.category === "Landscapes" || img.category === "Wildlife");
      } else {
        return images.filter(img => img.category === activeSubCategory);
      }
    }
  };

  const filtered = getFilteredImages();

  // Handle main category changes
  const handleMainCategoryChange = (category) => {
    setActiveMainCategory(category);
    if (category === "Portfolio") {
      setActiveSubCategory("All Portfolio");
    } else {
      setActiveSubCategory("All Prints");
    }
  };

  const handleImageClick = (img) => {
    setSelectedImage(img);
    setViewCounts((prev) => ({
      ...prev,
      [img.src]: (prev[img.src] || 0) + 1,
    }));
    setSelectedOrientation(orientationMap[img.src] || "landscape");
  };

  const handlePurchaseClick = (e) => {
    e.stopPropagation();
    setShowPurchaseModal(true);
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
    <div className="container py-5 gallery-page">
      {/* Hero Section */}
      <div className="text-center mb-5">
        <h1>Photography Gallery</h1>
        <p className="lead">
          Explore our portfolio of portraits, breathtaking landscapes, and wildlife photography
        </p>
      </div>

      {/* Main Category Tabs */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-center mb-4">
            <div className="btn-group btn-group-lg" role="group">
              {mainCategories.map((cat) => (
                <button
                  key={cat.name}
                  className={`btn btn-outline-primary ${activeMainCategory === cat.name ? "active" : ""}`}
                  onClick={() => handleMainCategoryChange(cat.name)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Conditional Banner Based on Active Tab */}
          {activeMainCategory === "Portfolio" ? (
            <div className="alert alert-info text-center mb-4">
              <h5 className="mb-2">Professional Portfolio</h5>
              <p className="mb-0">Examples of our portrait work and session styles. Ready to book your own session?</p>
              <Link to="/booking" className="btn btn-primary btn-sm mt-2">
                Book Your Session
              </Link>
            </div>
          ) : (
            <div className="alert alert-info text-center mb-4">
              <h5 className="mb-2">Fine Art Print Shop</h5>
              <p className="mb-0">Professional landscape and wildlife photography available for purchase.</p>
              <small className="text-muted d-block mt-1">
                <strong>Available formats:</strong> Digital downloads, Canvas prints, Metal prints, Traditional prints
                <br />
                <strong>Shipping:</strong> Included in print prices • Digital downloads instant
              </small>
            </div>
          )}
        </div>
      </div>

      {/* Sub-Category Filters - Professional Style */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="filter-buttons">
            {(activeMainCategory === "Portfolio" ? portfolioCategories : printCategories).map((cat) => (
              <button
                key={cat.name}
                className={`filter-btn ${activeSubCategory === cat.name ? "active" : ""}`}
                onClick={() => setActiveSubCategory(cat.name)}
              >
                {cat.name.replace("All Portfolio", "All").replace("All Prints", "All")}
                <span className="badge ms-2">
                  {activeMainCategory === "Portfolio" ? 
                    (cat.name === "All Portfolio" ? images.filter(img => 
                      img.category === "Headshots" || 
                      img.category === "Family" || 
                      img.category === "Couples" ||
                      img.category === "Pet Photos"
                    ).length :
                     images.filter(img => img.category === cat.name).length) :
                    (cat.name === "All Prints" ? images.filter(img => img.category === "Landscapes" || img.category === "Wildlife").length :
                     images.filter(img => img.category === cat.name).length)
                  }
                </span>
              </button>
            ))}
          </div>
          <div className="text-center text-muted">
            {(activeMainCategory === "Portfolio" ? portfolioCategories : printCategories)
              .find(cat => cat.name === activeSubCategory)?.description}
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
                  className="card-img-top img-fluid rounded"
                  style={{ height: "200px", objectFit: "cover" }}
                  loading="lazy"
                  decoding="async"
                />
                <div className="watermark">© Kizirian Photography</div>
                
                {/* Purchase Button for Available Images */}
                {img.available && (
                  <div className="position-absolute top-0 end-0 m-2">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={handlePurchaseClick}
                      style={{ fontSize: "0.75rem" }}
                      aria-label={`Purchase print of ${img.filename}`}
                    >
                      Buy Print
                    </button>
                  </div>
                )}
                
                {/* Category Badge */}
                <div className="position-absolute bottom-0 start-0 m-2">
                  <span className="badge bg-primary">{img.category}</span>
                </div>
              </div>
              
              <div className="card-footer text-muted small">
                <div className="d-flex justify-content-between align-items-center">
                  <span>Views: {viewCounts[img.src] || 0}</span>
                  {img.available && (
                    <span className="text-success">
                      <small>From $15</small>
                    </span>
                  )}
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
              <div className="d-flex justify-content-center gap-2 mb-2">
                <span className="badge bg-primary">{selectedImage.category}</span>
                {selectedImage.available && (
                  <span className="badge bg-success">Available for Purchase</span>
                )}
              </div>
              
              {/* Purchase Options - Desktop View */}
              {selectedImage.available && (
                <div className="mt-2 d-none d-md-block">
                  <h6 className="text-muted mb-2 small">Available Formats:</h6>
                  <div className="d-flex flex-wrap justify-content-center gap-1">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => sendPurchaseInquiry(selectedImage, "Digital Download")}
                      style={{ fontSize: "0.8rem", padding: "0.25rem 0.5rem" }}
                    >
                      Digital - $15
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => sendPurchaseInquiry(selectedImage, "8x10 Print")}
                      style={{ fontSize: "0.8rem", padding: "0.25rem 0.5rem" }}
                    >
                      8x10 - $33 (inc. shipping)
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => sendPurchaseInquiry(selectedImage, "11x14 Print")}
                      style={{ fontSize: "0.8rem", padding: "0.25rem 0.5rem" }}
                    >
                      11x14 - $45 (inc. shipping)
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => sendPurchaseInquiry(selectedImage, "16x20 Print")}
                      style={{ fontSize: "0.8rem", padding: "0.25rem 0.5rem" }}
                    >
                      16x20 - $70 (inc. shipping)
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => sendPurchaseInquiry(selectedImage, "Canvas Print")}
                      style={{ fontSize: "0.8rem", padding: "0.25rem 0.5rem" }}
                    >
                      Canvas - $105 (inc. shipping)
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => sendPurchaseInquiry(selectedImage, "Metal Print")}
                      style={{ fontSize: "0.8rem", padding: "0.25rem 0.5rem" }}
                    >
                      Metal - $120 (inc. shipping)
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => sendPurchaseInquiry(selectedImage, "Commercial License")}
                      style={{ fontSize: "0.8rem", padding: "0.25rem 0.5rem" }}
                    >
                      License - $150
                    </button>
                  </div>
                </div>
              )}

              {/* Purchase Options - Mobile View */}
              {selectedImage.available && (
                <div className="mobile-purchase-options d-md-none">
                  <h6 className="text-muted mb-2 small">Available Formats:</h6>
                  <div className="mobile-purchase-grid">
                    <button
                      className="btn btn-outline-primary btn-sm mobile-purchase-btn"
                      onClick={() => window.location.href = `/purchase?item=${encodeURIComponent(selectedImage.filename)}&type=digital&price=15`}
                    >
                      Digital - $15
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm mobile-purchase-btn"
                      onClick={() => window.location.href = `/purchase?item=${encodeURIComponent(selectedImage.filename)}&type=8x10&price=33`}
                    >
                      8x10 - $33
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm mobile-purchase-btn"
                      onClick={() => window.location.href = `/purchase?item=${encodeURIComponent(selectedImage.filename)}&type=11x14&price=45`}
                    >
                      11x14 - $45
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm mobile-purchase-btn"
                      onClick={() => window.location.href = `/purchase?item=${encodeURIComponent(selectedImage.filename)}&type=16x20&price=70`}
                    >
                      16x20 - $70
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm mobile-purchase-btn"
                      onClick={() => window.location.href = `/purchase?item=${encodeURIComponent(selectedImage.filename)}&type=canvas&price=105`}
                    >
                      Canvas - $105
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm mobile-purchase-btn"
                      onClick={() => window.location.href = `/purchase?item=${encodeURIComponent(selectedImage.filename)}&type=metal&price=120`}
                    >
                      Metal - $120
                    </button>
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
