import React, { useState, useEffect } from "react";
import "../App.css";

function Booking() {
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
    
    // Session-based pricing
    const sessionRates = {
      "Professional Headshots": 150,
      "Family Photos - Baby Photos": 175,
      "Family Photos - Holiday Photos": 150,
      "Family Photos - Engagement": 200,
      "Family Photos - Graduation": 125,
      "Family Photos - Senior Photos": 175,
      "Family Photos - Maternity Photos": 175,
      "Band Photos": 175,
      "Real Estate Photos": 100,
      "Pet Photos": 125
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
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">Book a Session</h1>
        <p className="lead text-muted">Schedule your professional photography session with ease</p>
      </div>

      {/* Early Bird Promotion - Top Banner */}
      <div className="alert alert-warning text-center mb-4">
        <h6 className="mb-2">Early Bird Special - 25% OFF</h6>
        <div className="small">First 20 bookings only! 
          <span className="badge bg-warning text-dark ms-2">
            {Math.max(0, 20 - totalBookings)} spots left
          </span>
        </div>
      </div>

      <div className="row">
        {/* Left Column - Form */}
        <div className="col-lg-7">
          <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Full Name<span className="text-danger">*</span></label>
          <input 
            type="text" 
            className="form-control" 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="Enter your full name (e.g., John Smith)"
            required 
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email Address<span className="text-danger">*</span></label>
          <div className="input-group">
            <input 
              type="email" 
              className="form-control" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="your.email@example.com"
              required 
            />
            {!emailVerified && (
              <button 
                type="button" 
                className="btn btn-outline-primary" 
                onClick={sendVerificationCode}
                disabled={sendingCode || !formData.email}
                aria-label={sendingCode ? "Sending verification code" : "Send verification code"}
              >
                {sendingCode ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Sending...
                  </>
                ) : (
                  "Verify"
                )}
              </button>
            )}
            {emailVerified && (
              <span className="input-group-text text-success">
                ✓ Verified
              </span>
            )}
          </div>
          <div className="form-text">
            We'll send a verification code to confirm your email address
            <br />
            <small className="text-warning">
              <strong>Note:</strong> Please check your spam/junk folder if you don't see the verification email within a few minutes
            </small>
          </div>
        </div>

        {verificationSent && !emailVerified && (
          <div className="mb-3">
            <label htmlFor="verificationCode" className="form-label">Enter Verification Code<span className="text-danger">*</span></label>
            <div className="input-group">
              <input 
                type="text" 
                className="form-control" 
                id="verificationCode" 
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="6-digit code"
                maxLength="6"
                required
              />
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={confirmVerification}
                disabled={sendingCode || verificationCode.length !== 6}
                aria-label={sendingCode ? "Verifying email code" : "Confirm email verification"}
              >
                {sendingCode ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Verifying...
                  </>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
            <div className="form-text">
              Check your email for the 6-digit verification code (expires in 10 minutes).
              <br />
              <small className="text-warning">
                <strong>Don't see it?</strong> Check your spam/junk folder
              </small>
            </div>
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Phone Number<span className="text-danger">*</span></label>
          <input 
            type="tel" 
            className="form-control" 
            id="phone" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            placeholder="(555) 123-4567"
            required 
          />
          <div className="form-text">Contact phone number for scheduling questions</div>
        </div>

        <div className="mb-3">
          <label htmlFor="sessionType" className="form-label">Session Type<span className="text-danger">*</span></label>
          <select className="form-select border" id="sessionType" name="sessionType" value={formData.sessionType} onChange={handleChange} required>
            <option value="">Choose your session type (e.g., Family Photos - Engagement)</option>
            <option value="Professional Headshots">Professional Headshots</option>
            <option value="Family Photos - Baby Photos">Family Photos - Baby Photos</option>
            <option value="Family Photos - Holiday Photos">Family Photos - Holiday Photos</option>
            <option value="Family Photos - Engagement">Family Photos - Engagement</option>
            <option value="Family Photos - Graduation">Family Photos - Graduation</option>
            <option value="Family Photos - Senior Photos">Family Photos - Senior Photos</option>
            <option value="Family Photos - Maternity Photos">Family Photos - Maternity Photos</option>
            <option value="Band Photos">Band Photos</option>
            <option value="Real Estate Photos">Real Estate Photos</option>
            <option value="Pet Photos">Pet Photos</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="duration" className="form-label">Duration (hours)<span className="text-danger">*</span></label>
          <select className="form-select border" id="duration" name="duration" value={formData.duration} onChange={handleChange} required>
            {[1, 2, 3, 4].map(d => (
              <option key={d} value={d}>{d} {d === 1 ? "hour" : "hours"}</option>
            ))}
          </select>
          <div className="form-text">Most portrait sessions are 1-2 hours. Longer sessions for multiple looks or locations.</div>
        </div>

        <div className="mb-3">
          <label htmlFor="discountCode" className="form-label">Discount Code</label>
          <input 
            type="text" 
            className="form-control" 
            id="discountCode" 
            value={sessionPricing.discountCode}
            onChange={handleDiscountCodeChange}
            placeholder="Optional: Enter Discount Code if available"
            style={{ textTransform: 'uppercase' }}
          />
          <div className="form-text">
            Enter your discount code if you have one
            {sessionPricing.discountCode && !['SEMEISTVO', 'PRIATELI'].includes(sessionPricing.discountCode.toUpperCase()) && (
              <span className="text-warning"> • Invalid discount code</span>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="date" className="form-label">Preferred Day<span className="text-danger">*</span></label>
          <input type="date" className="form-control" id="date" name="date" value={formData.date} min={minDate} max={maxDate} onChange={handleChange} required />
          {selectedDateDisplay && (
            <div className="form-text">Selected: {selectedDateDisplay}</div>
          )}
          {!formData.date && (
            <div className="form-text">Choose a date at least 2 days in advance</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="time" className="form-label">Preferred Time<span className="text-danger">*</span></label>
          <select className="form-select border" id="time" name="time" value={formData.time} onChange={handleChange} required>
            <option value="">Select your preferred time (e.g., 10:00 AM)</option>
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
            <div className="form-text">
              <small className="text-muted">Checking availability...</small>
            </div>
          )}
          {formData.time && timeSlotAvailability.get(formData.time)?.available === false && (
            <div className="form-text text-danger">
              <small>This time slot is unavailable due to: {timeSlotAvailability.get(formData.time)?.conflictingEvent?.summary}</small>
            </div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="notes" className="form-label">Additional Notes</label>
          <textarea 
            className="form-control" 
            id="notes" 
            name="notes" 
            rows="3" 
            value={formData.notes} 
            onChange={handleChange}
            placeholder="Tell us about your vision: location preferences, style, props, special requests, etc."
          ></textarea>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-100" 
          disabled={submitting}
          aria-label={submitting ? "Processing booking submission" : "Submit booking form"}
        >
          {submitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Submitting...
            </>
          ) : (
            "Submit Booking"
          )}
        </button>

        {status && (
          <div className={`alert mt-3 ${status.includes("successful") ? "alert-success" : "alert-danger"}`}>
            {status}
            {status.includes("successful") && (
              <div className="mt-2">
                <small className="text-warning">
                  <strong>Important:</strong> Don't forget to check your spam/junk folder if you don't see the confirmation email
                </small>
              </div>
            )}
          </div>
        )}
          </form>
        </div>

        {/* Right Column - Sticky Pricing Panel */}
        <div className="col-lg-5">
          <div className="sticky-top" style={{ top: '2rem' }}>
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Your Session Summary</h5>
              </div>
              <div className="card-body">
                {formData.sessionType ? (
                  <div>
                    <div className="mb-3">
                      <strong>Session Type:</strong>
                      <div className="text-muted">{formData.sessionType}</div>
                    </div>
                    <div className="mb-3">
                      <strong>Duration:</strong>
                      <div className="text-muted">{formData.duration} {formData.duration === "1" ? "hour" : "hours"}</div>
                    </div>
                    {sessionPricing.discountCode && (
                      <div className="mb-3">
                        <strong>Discount Code:</strong>
                        <div className="text-success">✓ {sessionPricing.discountCode}</div>
                      </div>
                    )}
                    <hr />
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Hourly Rate:</span>
                      <span className="fs-5">
                        {sessionPricing.appliedDiscount > 0 && (
                          <span className="text-decoration-line-through text-muted me-2">
                            ${sessionPricing.baseRate}
                          </span>
                        )}
                        <span className="text-success fw-bold">
                          ${sessionPricing.finalRate}
                        </span>
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fs-5 fw-bold">Total Cost:</span>
                      <span className="fs-4 fw-bold text-success">
                        ${sessionPricing.finalRate * parseInt(formData.duration)}
                      </span>
                    </div>
                    {sessionPricing.appliedDiscount > 0 && (
                      <div className="text-success small mt-2">
                        You saved ${(sessionPricing.baseRate - sessionPricing.finalRate) * parseInt(formData.duration)} with your discount!
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-muted">
                    <p>Select a session type to see pricing details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;
