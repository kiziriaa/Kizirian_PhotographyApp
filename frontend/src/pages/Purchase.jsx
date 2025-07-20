import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

function Purchase() {
  useEffect(() => {
    document.body.className = 'purchase-page';
    return () => {
      document.body.className = '';
    };
  }, []);

  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState({
    item: '',
    type: '',
    price: 0,
    shipping: 0,
    total: 0
  });
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const item = searchParams.get('item') || '';
    const type = searchParams.get('type') || '';
    const price = parseInt(searchParams.get('price')) || 0;
    
    // Calculate shipping based on type
    let shipping = 0;
    if (type !== 'digital') {
      const shippingRates = {
        '8x10': 8,
        '11x14': 10,
        '16x20': 15,
        'canvas': 20,
        'metal': 25
      };
      shipping = shippingRates[type] || 0;
    }
    
    const total = price + shipping;
    
    setOrderDetails({
      item: item.replace(/\.[^/.]+$/, ""), // Remove file extension
      type: formatProductType(type),
      price,
      shipping,
      total
    });
  }, [searchParams]);

  const formatProductType = (type) => {
    const typeMap = {
      'digital': 'Digital Download',
      '8x10': '8x10 Professional Print',
      '11x14': '11x14 Professional Print', 
      '16x20': '16x20 Professional Print',
      'canvas': 'Canvas Gallery Wrap',
      'metal': 'Metal Print with Float Mount'
    };
    return typeMap[type] || type;
  };

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus('');

    const orderData = {
      ...orderDetails,
      customer: customerInfo,
      orderDate: new Date().toISOString()
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (response.ok) {
        setStatus('Order submitted successfully! We will contact you within 24 hours with payment and delivery details.');
        setCustomerInfo({
          name: '',
          email: '',
          address: '',
          city: '',
          state: '',
          zip: '',
          phone: ''
        });
      } else {
        setStatus(result.error || 'Something went wrong with your order.');
      }
    } catch (error) {
      setStatus('Failed to submit order. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h1>Complete Your Purchase</h1>
        <p className="lead">Review your order details and provide your information</p>
      </div>

      <div className="row">
        {/* Order Summary */}
        <div className="col-lg-5 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <h6>Photograph</h6>
                <p className="text-muted">{orderDetails.item}</p>
              </div>
              <div className="mb-3">
                <h6>Product Type</h6>
                <p className="text-muted">{orderDetails.type}</p>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Product Price:</span>
                <span>${orderDetails.price}</span>
              </div>
              {orderDetails.shipping > 0 && (
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping & Handling:</span>
                  <span>${orderDetails.shipping}</span>
                </div>
              )}
              <hr />
              <div className="d-flex justify-content-between fs-5 fw-bold">
                <span>Total:</span>
                <span className="text-success">${orderDetails.total}</span>
              </div>
              
              <div className="mt-4 p-3 bg-light rounded">
                <h6>What's Included:</h6>
                <ul className="small text-muted mb-0">
                  {orderDetails.type.includes('Digital') ? (
                    <>
                      <li>High-resolution digital file</li>
                      <li>Instant download link</li>
                      <li>Commercial usage rights</li>
                    </>
                  ) : (
                    <>
                      <li>Professional quality print</li>
                      <li>Archival materials</li>
                      <li>Careful packaging</li>
                      <li>Insured shipping</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information Form */}
        <div className="col-lg-7">
          <form onSubmit={handleSubmit}>
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Customer Information</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      required
                      placeholder="John Smith"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      required
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div className="col-12 mb-3">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="(555) 123-4567"
                  />
                </div>

                {orderDetails.shipping > 0 && (
                  <>
                    <h6 className="mt-4 mb-3">Shipping Address</h6>
                    <div className="mb-3">
                      <label className="form-label">Street Address *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={customerInfo.address}
                        onChange={handleInputChange}
                        required
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">City *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="city"
                          value={customerInfo.city}
                          onChange={handleInputChange}
                          required
                          placeholder="Houston"
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">State *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="state"
                          value={customerInfo.state}
                          onChange={handleInputChange}
                          required
                          placeholder="TX"
                          maxLength="2"
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">ZIP Code *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="zip"
                          value={customerInfo.zip}
                          onChange={handleInputChange}
                          required
                          placeholder="77001"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="alert alert-info mt-4">
                  <h6>Payment & Delivery Process:</h6>
                  <ol className="small mb-0">
                    <li>Submit your order information</li>
                    <li>We'll contact you within 24 hours with payment options</li>
                    <li>Available payment methods: PayPal, Venmo, or bank transfer</li>
                    <li>
                      {orderDetails.type.includes('Digital') 
                        ? 'Digital files delivered immediately after payment'
                        : 'Physical prints shipped within 3-5 business days after payment'
                      }
                    </li>
                  </ol>
                </div>

                <button
                  type="submit"
                  className="btn btn-success btn-lg w-100"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Submitting Order...
                    </>
                  ) : (
                    'Submit Order'
                  )}
                </button>

                {status && (
                  <div className={`alert mt-3 ${status.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
                    {status}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Return to Gallery */}
      <div className="text-center mt-5">
        <Link to="/gallery" className="btn btn-outline-primary">
          ← Back to Gallery
        </Link>
      </div>
    </div>
  );
}

export default Purchase;