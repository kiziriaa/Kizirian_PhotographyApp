import React, { useState, useEffect } from "react";
import Breadcrumbs from "../components/Breadcrumbs";

function Booking() {
  useEffect(() => {
    document.body.className = 'booking-page';
    return () => {
      document.body.className = '';
    };
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    sessionType: "",
    date: "",
    time: "",
    duration: "1",
    notes: ""
  });

  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [timeSlotAvailability, setTimeSlotAvailability] = useState(new Map());
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [sessionPricing, setSessionPricing] = useState({
    baseRate: 125,
    discountCode: "",
    appliedDiscount: 0,
    finalRate: 125
  });
  const [totalBookings, setTotalBookings] = useState(12); // Mock counter - in production this would come from backend

  useEffect(() => {
    const today = new Date();
    today.setDate(today.getDate() + 2);
    const defaultDate = today.toISOString().split("T")[0];
    setFormData(prev => ({ ...prev, date: defaultDate }));
  }, []);

  // Function to check availability for time slots
  const checkAvailability = async (date, duration) => {
    if (!date || !duration) return;
    
    setCheckingAvailability(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/check-availability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          date: new Date(date + 'T00:00:00').toISOString(),
          duration: parseInt(duration)
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const availabilityMap = new Map();
        result.timeSlots.forEach(slot => {
          availabilityMap.set(slot.time, {
            available: slot.available,
            conflictingEvent: slot.conflictingEvent
          });
        });
        setTimeSlotAvailability(availabilityMap);
      }
    } catch (error) {
      console.error('Error checking availability:', error);
    } finally {
      setCheckingAvailability(false);
    }
  };

  useEffect(() => {
    if (!formData.date) return;
    const selectedDate = new Date(formData.date + 'T00:00:00');
    const day = selectedDate.getDay();
    const dayName = selectedDate.toLocaleDateString("en-US", { weekday: "long" });
    const formatted = `${dayName}, ${formData.date}`;
    setFormData(prev => ({ ...prev, date: formData.date }));

    let times = [];
    const startHour = (day === 6 || day === 0) ? 7 : 17; // Sat/Sun: 7AM, Weekdays: 5PM
    const endHour = 20;

    for (let h = startHour; h <= endHour; h++) {
      [0, 30].forEach(min => {
        if (h === endHour && min > 0) return;
        const hour12 = h % 12 === 0 ? 12 : h % 12;
        const ampm = h < 12 ? "AM" : "PM";
        const label = `${hour12}:${min.toString().padStart(2, '0')} ${ampm}`;
        const value = `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        times.push({ label, value });
      });
    }
    setAvailableTimes(times);
    
    // Check availability for all time slots
    checkAvailability(formData.date, formData.duration);
  }, [formData.date, formData.duration]);

  // Calculate pricing based on session type and discount codes
  const calculatePricing = (sessionType, discountCode) => {
    let baseRate = 125;
    
    // Session-based pricing based on market research
    const sessionRates = {
      "Baby Photos": 150,        // $100-200 per session
      "Bands": 150,              // $100-200 per hour  
      "Couples": 190,            // $125-250 per session
      "Engagements": 190,        // $125-250 per session
      "Family": 225,             // $150-300 per session
      "Professional Headshots": 115,  // $75-150 per session
      "Holiday Photos": 90,      // $50-125 per 30min mini
      "Pet Photos": 150,         // $100-200 per session
      "Senior Photos": 115       // $75-150 per session
    };
    
    baseRate = sessionRates[sessionType] || 125;
    
    // Apply discount codes
    let appliedDiscount = 0;
    if (discountCode.toUpperCase() === "SEMEISTVO") {
      appliedDiscount = 0.75; // 75% off
    } else if (discountCode.toUpperCase() === "PRIATELI") {
      appliedDiscount = 0.50; // 50% off
    }
    
    // Early bird discount (first 20 bookings)
    let earlyBirdDiscount = 0;
    if (totalBookings < 20) {
      earlyBirdDiscount = 0.25; // 25% off
    }
    
    // Apply the better discount (not cumulative)
    const finalDiscount = Math.max(appliedDiscount, earlyBirdDiscount);
    const finalRate = baseRate * (1 - finalDiscount);
    
    return {
      baseRate,
      appliedDiscount: finalDiscount,
      finalRate: Math.round(finalRate)
    };
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Reset email verification if email changes
    if (e.target.name === 'email') {
      setEmailVerified(false);
      setVerificationSent(false);
      setVerificationCode("");
    }
    
    // Update pricing when session type changes
    if (e.target.name === 'sessionType') {
      const pricing = calculatePricing(e.target.value, sessionPricing.discountCode);
      setSessionPricing(prev => ({
        ...prev,
        ...pricing
      }));
    }
  };

  const handleDiscountCodeChange = (e) => {
    const code = e.target.value;
    const pricing = calculatePricing(formData.sessionType, code);
    setSessionPricing(prev => ({
      ...prev,
      discountCode: code,
      ...pricing
    }));
  };

  const sendVerificationCode = async () => {
    if (!formData.email) {
      setStatus("Email address is required");
      return;
    }

    setSendingCode(true);
    setStatus("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const result = await response.json();

      if (response.ok) {
        setVerificationSent(true);
        setStatus("Verification code sent to your email address");
      } else {
        setStatus(result.error || "Failed to send verification code");
      }
    } catch (error) {
      setStatus("Failed to send verification code");
    } finally {
      setSendingCode(false);
    }
  };

  const confirmVerification = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setStatus("Please enter the 6-digit verification code");
      return;
    }

    setSendingCode(true);
    setStatus("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/confirm-email-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, code: verificationCode }),
      });

      const result = await response.json();

      if (response.ok) {
        setEmailVerified(true);
        setStatus("Email address verified successfully!");
      } else {
        setStatus(result.error || "Invalid verification code");
      }
    } catch (error) {
      setStatus("Failed to verify email address");
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus("");

    // Check if email is verified
    if (!emailVerified) {
      setStatus("Please verify your email address before booking");
      setSubmitting(false);
      return;
    }

    // Check if time is selected
    if (!formData.time) {
      setStatus("Please select a preferred time for your session");
      setSubmitting(false);
      return;
    }

    const { date, time } = formData;
    const fullDateTime = new Date(`${date}T${time}`);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, date: fullDateTime.toISOString() }),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus("Booking submitted successfully! Please check your email for a confirmation message. You must confirm your booking via email to complete the process.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          sessionType: "",
          date: "",
          time: "",
          duration: "1",
          notes: "Describe your session preferences: theme, location, props, etc."
        });
      } else {
        console.error("Booking failed:", result);
        setStatus(result.error || "Something went wrong.");
      }
    } catch (error) {
      setStatus("Failed to complete booking.");
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date();
  const minDate = new Date(today.setDate(today.getDate() + 2)).toISOString().split("T")[0];
  const maxDate = new Date(Date.now() + 60 * 86400000).toISOString().split("T")[0];

  const selectedDateDisplay = formData.date
    ? new Date(formData.date + 'T00:00:00').toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "";

  return (
    <div className="container py-5">
      <Breadcrumbs />
      {/* Professional Header */}
      <div className="booking-header text-center mb-5">
        <h1 className="booking-title">Book Your Session</h1>
        <p className="booking-subtitle">Let's create beautiful memories together</p>
        <div className="booking-progress">
          <div className="progress-step active">1. Contact Details</div>
          <div className="progress-step">2. Session Info</div>
          <div className="progress-step">3. Confirmation</div>
        </div>
      </div>

      {/* New Client Offer */}
      <div className="offer-banner">
        <div className="offer-content">
          <span className="offer-badge">New Client Special</span>
          <span className="offer-text">25% OFF your first session</span>
          <span className="offer-expiry">Limited time offer</span>
        </div>
      </div>

      <div className="booking-layout">
        {/* Main Form Section */}
        <div className="booking-form-section">
          <form onSubmit={handleSubmit} className="professional-form">
            
            {/* Contact Information Section */}
            <div className="form-section">
              <div className="section-header">
                <h3 className="section-title">
                  <i className="section-icon">👤</i>
                  Contact Information
                </h3>
                <div className="section-divider"></div>
              </div>
              <div className="section-content">
                <div className="row">
                <div className="col-md-6 mb-4">
                  <label htmlFor="name" className="form-label">Full Name<span className="text-danger">*</span></label>
                  <input 
                    type="text" 
                    className="form-control form-control-professional" 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="Your full name"
                    required 
                  />
                </div>

                <div className="col-md-6 mb-4">
                  <label htmlFor="email" className="form-label">Email Address<span className="text-danger">*</span></label>
                  <div className="email-verification-group">
                    <input 
                      type="email" 
                      className="form-control form-control-professional" 
                      id="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="your.email@example.com"
                      required 
                    />
                    <div className="verification-status">
                      {!emailVerified && (
                        <button 
                          type="button" 
                          className="btn btn-verify" 
                          onClick={sendVerificationCode}
                          disabled={sendingCode || !formData.email}
                        >
                          {sendingCode ? "Sending..." : "Verify Email"}
                        </button>
                      )}
                      {emailVerified && (
                        <span className="verified-badge">
                          <i className="check-icon">✓</i> Verified
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="form-helper">
                    Email verification required for booking confirmation
                  </div>
                </div>
                </div>
              </div>
            </div>

            {verificationSent && !emailVerified && (
              <div className="verification-section">
                <div className="verification-card">
                  <h4>Email Verification</h4>
                  <p>Enter the 6-digit code sent to your email</p>
                  <div className="verification-input-group">
                    <input 
                      type="text" 
                      className="form-control verification-input" 
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="000000"
                      maxLength="6"
                      required
                    />
                    <button 
                      type="button" 
                      className="btn btn-primary" 
                      onClick={confirmVerification}
                      disabled={sendingCode || verificationCode.length !== 6}
                    >
                      {sendingCode ? "Verifying..." : "Confirm"}
                    </button>
                  </div>
                  <div className="verification-help">
                    <small>Check your spam folder if you don't see the email</small>
                  </div>
                </div>
              </div>
            )}

            {/* Session Details Section */}
            <div className="form-section">
              <div className="section-header">
                <h3 className="section-title">
                  <i className="section-icon">📱</i>
                  Contact & Session Details
                </h3>
                <div className="section-divider"></div>
              </div>
              <div className="section-content">
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <label htmlFor="phone" className="form-label">Phone Number<span className="text-danger">*</span></label>
                    <input 
                      type="tel" 
                      className="form-control form-control-professional" 
                      id="phone" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      placeholder="(555) 123-4567"
                      required 
                    />
                    <div className="form-helper">For scheduling confirmations</div>
                  </div>

                  <div className="col-md-6 mb-4">
                    <label htmlFor="sessionType" className="form-label">Session Type<span className="text-danger">*</span></label>
                    <select className="form-select form-control-professional" id="sessionType" name="sessionType" value={formData.sessionType} onChange={handleChange} required>
                      <option value="">Select session type</option>
                      <option value="Professional Headshots">Professional Headshots - $115</option>
                      <option value="Family">Family Session - $225</option>
                      <option value="Couples">Couples & Engagement - $190</option>
                      <option value="Baby Photos">Baby Photos - $150</option>
                      <option value="Senior Photos">Senior Photos - $115</option>
                      <option value="Pet Photos">Pet Photos - $150</option>
                      <option value="Holiday Photos">Holiday Mini Session - $90</option>
                      <option value="Bands">Band/Group Session - $150</option>
                    </select>
                  </div>
                </div>
                
                <div className="row">

                  <div className="col-md-4 mb-4">
                    <label htmlFor="duration" className="form-label">Duration<span className="text-danger">*</span></label>
                    <select className="form-select form-control-professional" id="duration" name="duration" value={formData.duration} onChange={handleChange} required>
                      {[1, 2, 3, 4].map(d => (
                        <option key={d} value={d}>{d} {d === 1 ? "hour" : "hours"}</option>
                      ))}
                    </select>
                    <div className="form-helper">Session duration</div>
                  </div>

                  <div className="col-md-8 mb-4">
                    <label htmlFor="discountCode" className="form-label">Discount Code <span className="optional-badge">Optional</span></label>
                    <input 
                      type="text" 
                      className="form-control form-control-professional" 
                      id="discountCode" 
                      value={sessionPricing.discountCode}
                      onChange={handleDiscountCodeChange}
                      placeholder="Enter promo code"
                      style={{ textTransform: 'uppercase' }}
                    />
                    <div className="form-helper">
                      {sessionPricing.discountCode && !['SEMEISTVO', 'PRIATELI'].includes(sessionPricing.discountCode.toUpperCase()) && (
                        <span className="text-warning">Invalid discount code</span>
                      )}
                      {!sessionPricing.discountCode && "Special codes for returning clients"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scheduling Section */}
            <div className="form-section">
              <div className="section-header">
                <h3 className="section-title">
                  <i className="section-icon">📅</i>
                  Scheduling
                </h3>
                <div className="section-divider"></div>
              </div>
              <div className="section-content">
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <label htmlFor="date" className="form-label">Preferred Date<span className="text-danger">*</span></label>
                    <input 
                      type="date" 
                      className="form-control form-control-professional" 
                      id="date" 
                      name="date" 
                      value={formData.date} 
                      min={minDate} 
                      max={maxDate} 
                      onChange={handleChange} 
                      required 
                    />
                    {selectedDateDisplay && (
                      <div className="form-helper selected-date">📅 {selectedDateDisplay}</div>
                    )}
                    {!formData.date && (
                      <div className="form-helper">Minimum 2 days advance booking</div>
                    )}
                  </div>
                  
                  <div className="col-md-6 mb-4">
                    <label htmlFor="time" className="form-label">Preferred Time<span className="text-danger">*</span></label>
                    <select className="form-select form-control-professional" id="time" name="time" value={formData.time} onChange={handleChange} required>
                      <option value="">Select your preferred time</option>
                      {availableTimes.map(({ label, value }) => {
                        const availability = timeSlotAvailability.get(value);
                        const isAvailable = availability?.available !== false;
                        const isUnavailable = availability?.available === false;
                        
                        return (
                          <option 
                            key={value} 
                            value={value}
                            disabled={isUnavailable}
                            style={{ 
                              color: isUnavailable ? '#6c757d' : 'inherit',
                              backgroundColor: isUnavailable ? '#f8f9fa' : 'inherit' 
                            }}
                          >
                            {label} {isUnavailable ? '(Unavailable)' : isAvailable && !checkingAvailability ? '(Available)' : ''}
                          </option>
                        );
                      })}
                    </select>
                    {checkingAvailability && (
                      <div className="form-helper">⏳ Checking availability...</div>
                    )}
                    {formData.time && timeSlotAvailability.get(formData.time)?.available === false && (
                      <div className="form-helper text-danger">
                        ❌ Time unavailable: {timeSlotAvailability.get(formData.time)?.conflictingEvent?.summary}
                      </div>
                    )}
                    {formData.time && timeSlotAvailability.get(formData.time)?.available !== false && (
                      <div className="form-helper text-success">✅ Time slot available</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="form-section">
              <div className="section-header">
                <h3 className="section-title">
                  <i className="section-icon">💭</i>
                  Tell Us About Your Vision
                </h3>
                <div className="section-divider"></div>
              </div>
              <div className="section-content">
                <div className="mb-4">
                  <label htmlFor="notes" className="form-label">Session Details & Preferences <span className="optional-badge">Optional</span></label>
                  <textarea 
                    className="form-control form-control-professional" 
                    id="notes" 
                    name="notes" 
                    rows="4" 
                    value={formData.notes} 
                    onChange={handleChange}
                    placeholder="Share your vision: location preferences, style inspiration, special requests, props, wardrobe ideas, or any questions you have..."
                  ></textarea>
                  <div className="form-helper">Help us make your session perfect by sharing your ideas and preferences</div>
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="form-section submit-section">
              <div className="submit-content">
                <button 
                  type="submit" 
                  className="btn btn-book-session" 
                  disabled={submitting || !emailVerified}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Processing Your Booking...
                    </>
                  ) : (
                    <>
                      <i className="submit-icon">📸</i>
                      Book Your Session
                    </>
                  )}
                </button>
                <div className="submit-helper">
                  🔒 Secure booking • 📧 Instant confirmation • 💯 Satisfaction guaranteed
                </div>
              </div>
            </div>

            {status && (
              <div className={`status-message ${status.includes("successful") ? "status-success" : "status-error"}`}>
                <div className="status-icon">
                  {status.includes("successful") ? "✅" : "❌"}
                </div>
                <div className="status-content">
                  <div className="status-text">{status}</div>
                  {status.includes("successful") && (
                    <div className="status-note">
                      <strong>Important:</strong> Check your spam/junk folder if you don't see the confirmation email
                    </div>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Professional Pricing Summary */}
        <div className="booking-summary-section">
          <div className="pricing-card sticky-pricing">
            <div className="pricing-header">
              <h4 className="pricing-title">Session Investment</h4>
              <div className="pricing-subtitle">Professional Photography</div>
            </div>
            <div className="pricing-body">
              {formData.sessionType ? (
                <div className="pricing-details">
                  <div className="pricing-item">
                    <div className="pricing-label">Session Type</div>
                    <div className="pricing-value">{formData.sessionType}</div>
                  </div>
                  <div className="pricing-item">
                    <div className="pricing-label">Duration</div>
                    <div className="pricing-value">{formData.duration} {formData.duration === "1" ? "hour" : "hours"}</div>
                  </div>
                  {formData.date && (
                    <div className="pricing-item">
                      <div className="pricing-label">Date</div>
                      <div className="pricing-value">{selectedDateDisplay}</div>
                    </div>
                  )}
                  {formData.time && (
                    <div className="pricing-item">
                      <div className="pricing-label">Time</div>
                      <div className="pricing-value">{availableTimes.find(t => t.value === formData.time)?.label}</div>
                    </div>
                  )}
                  {sessionPricing.discountCode && (
                    <div className="pricing-item discount-applied">
                      <div className="pricing-label">Discount Code</div>
                      <div className="pricing-value">✓ {sessionPricing.discountCode}</div>
                    </div>
                  )}
                  <div className="pricing-divider"></div>
                  <div className="pricing-breakdown">
                    <div className="pricing-line">
                      <span>Hourly Rate:</span>
                      <span className="rate-display">
                        {sessionPricing.appliedDiscount > 0 && (
                          <span className="original-rate">${sessionPricing.baseRate}</span>
                        )}
                        <span className="final-rate">${sessionPricing.finalRate}</span>
                      </span>
                    </div>
                    <div className="pricing-total">
                      <span>Total Investment:</span>
                      <span className="total-amount">${sessionPricing.finalRate * parseInt(formData.duration)}</span>
                    </div>
                  </div>
                  {sessionPricing.appliedDiscount > 0 && (
                    <div className="savings-notice">
                      🎉 You save ${(sessionPricing.baseRate - sessionPricing.finalRate) * parseInt(formData.duration)}!
                    </div>
                  )}
                  <div className="pricing-includes">
                    <div className="includes-title">What's Included:</div>
                    <ul className="includes-list">
                      <li>✓ Professional consultation</li>
                      <li>✓ Expert editing & retouching</li>
                      <li>✓ High-resolution digital images</li>
                      <li>✓ Online gallery access</li>
                      <li>✓ Print release included</li>
                      <li>✓ 48-72 hour delivery</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="pricing-placeholder">
                  <div className="placeholder-icon">📸</div>
                  <p>Select your session type to see pricing details</p>
                  <div className="starting-price">Sessions starting at <strong>$90</strong></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;
