// TWILIO recovery code: 9CPPH25M9NSHCUHHAT93H8J7
// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(helmet());
app.use(cors({ 
  origin: [
    "http://localhost:5173",
    "https://netlify.app",
    "https://*.netlify.app",
    /https:\/\/.*\.netlify\.app$/,
    process.env.FRONTEND_URL
  ],
  credentials: true
}));
app.use(express.json());

// Setup log file stream
const logStream = fs.createWriteStream(path.join(__dirname, 'error.log'), { flags: 'a' });

// Rate limiter
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: "Too many requests. Please try again later." },
});

app.use('/api/contact', limiter);
app.use('/api/book', limiter);

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify nodemailer
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Nodemailer login failed:", error.message);
  } else {
    console.log("✅ Nodemailer login successful. Ready to send mail!");
  }
});

// Google Calendar setup
const oAuth2Client = new google.auth.OAuth2(
  process.env.GCAL_CLIENT_ID,
  process.env.GCAL_CLIENT_SECRET,
  process.env.GCAL_REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.GCAL_REFRESH_TOKEN });
const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

// Twilio setup
console.log("TWILIO_ACCOUNT_SID:", process.env.TWILIO_ACCOUNT_SID ? "✔ Loaded" : "✘ Missing");
console.log("TWILIO_AUTH_TOKEN:", process.env.TWILIO_AUTH_TOKEN ? "✔ Loaded" : "✘ Missing");
console.log("TWILIO_PHONE_NUMBER:", process.env.TWILIO_PHONE_NUMBER ? "✔ Loaded" : "✘ Missing");

const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN 
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

console.log("Twilio client initialized:", twilioClient ? "✔ Yes" : "✘ No (using dev mode)");

// In-memory storage for verification codes and pending bookings
const verificationCodes = new Map();
const pendingBookings = new Map();

// Generate unique booking confirmation token
function generateBookingToken() {
  return require('crypto').randomBytes(32).toString('hex');
}

// Function to check calendar availability
async function checkCalendarAvailability(startTime, endTime) {
  try {
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startTime.toISOString(),
      timeMax: endTime.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    
    // Check for any overlapping events
    for (const event of events) {
      if (event.start.dateTime && event.end.dateTime) {
        const existingStart = new Date(event.start.dateTime);
        const existingEnd = new Date(event.end.dateTime);
        
        // Check for overlap
        if (startTime < existingEnd && endTime > existingStart) {
          return {
            available: false,
            conflictingEvent: {
              summary: event.summary,
              start: existingStart.toLocaleString('en-US', { timeZone: 'America/Chicago' }),
              end: existingEnd.toLocaleString('en-US', { timeZone: 'America/Chicago' })
            }
          };
        }
      }
    }
    
    return { available: true };
  } catch (error) {
    console.error('Error checking calendar availability:', error);
    throw new Error('Unable to check calendar availability');
  }
}

// Contact endpoint
app.post(
  '/api/contact',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { name, email, message } = req.body;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `Contact Request - ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      });
      res.status(200).json({ success: true, message: "Message sent successfully!" });
    } catch (error) {
      const timestamp = new Date().toISOString();
      const errorMsg = `[${timestamp}] Email sending failed: ${error.message}\n`;
      logStream.write(errorMsg);
      console.error(errorMsg);
      res.status(500).json({ error: "Failed to send message." });
    }
  }
);

// Email verification endpoint
app.post(
  '/api/verify-email',
  [
    body('email').isEmail().withMessage('Valid email address required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { email } = req.body;
    
    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store verification code with 10 minute expiry
    verificationCodes.set(email, {
      code: verificationCode,
      expires: Date.now() + 10 * 60 * 1000, // 10 minutes
      attempts: 0
    });

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email - Kizirian Photography',
        html: `
          <h2>Email Verification</h2>
          <p>Thank you for your interest in Kizirian Photography!</p>
          <p>Your verification code is:</p>
          <h1 style="color: #007bff; font-size: 32px; text-align: center; letter-spacing: 5px; margin: 20px 0;">${verificationCode}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
          <br>
          <p>Best regards,<br>Kizirian Photography</p>
        `
      });
      
      res.status(200).json({ 
        success: true, 
        message: "Verification code sent to your email address"
      });
    } catch (error) {
      console.error('Email sending failed:', error);
      res.status(500).json({ error: "Failed to send verification code" });
    }
  }
);

// Confirm email verification code endpoint
app.post(
  '/api/confirm-email-verification',
  [
    body('email').isEmail().withMessage('Valid email address required'),
    body('code').isLength({ min: 6, max: 6 }).withMessage('6-digit verification code required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { email, code } = req.body;
    const verification = verificationCodes.get(email);

    if (!verification) {
      return res.status(400).json({ error: "No verification code found for this email address" });
    }

    if (Date.now() > verification.expires) {
      verificationCodes.delete(email);
      return res.status(400).json({ error: "Verification code expired" });
    }

    if (verification.attempts >= 3) {
      verificationCodes.delete(email);
      return res.status(429).json({ error: "Too many verification attempts" });
    }

    if (verification.code !== code) {
      verification.attempts++;
      return res.status(400).json({ error: "Invalid verification code" });
    }

    // Mark email as verified
    verificationCodes.delete(email);
    
    res.status(200).json({ 
      success: true, 
      message: "Email address verified successfully",
      verified: true
    });
  }
);

// Check availability for a specific date
app.post('/api/check-availability', 
  [
    body('date').isISO8601().withMessage('Valid ISO date string required'),
    body('duration').isInt({ min: 1, max: 4 }).withMessage('Duration must be 1 to 4 hours'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { date, duration } = req.body;

    try {
      const selectedDate = new Date(date);
      const day = selectedDate.getDay();
      
      // Generate all possible time slots for the day
      const startHour = (day === 6 || day === 0) ? 7 : 17; // Sat/Sun: 7AM, Weekdays: 5PM
      const endHour = 20;
      
      const timeSlots = [];
      for (let h = startHour; h <= endHour; h++) {
        [0, 30].forEach(min => {
          if (h === endHour && min > 0) return;
          
          const slotStart = new Date(selectedDate);
          slotStart.setHours(h, min, 0, 0);
          const slotEnd = new Date(slotStart.getTime() + duration * 60 * 60 * 1000);
          
          // Don't include slots that would end after business hours
          if (slotEnd.getHours() > 20) return;
          
          const timeValue = `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
          timeSlots.push({ time: timeValue, start: slotStart, end: slotEnd });
        });
      }

      // Check availability for each time slot
      const availabilityPromises = timeSlots.map(async (slot) => {
        try {
          const availabilityCheck = await checkCalendarAvailability(slot.start, slot.end);
          return {
            time: slot.time,
            available: availabilityCheck.available,
            conflictingEvent: availabilityCheck.conflictingEvent || null
          };
        } catch (error) {
          return {
            time: slot.time,
            available: false,
            error: 'Unable to check availability'
          };
        }
      });

      const availability = await Promise.all(availabilityPromises);
      
      res.status(200).json({
        success: true,
        date: selectedDate.toISOString(),
        duration,
        timeSlots: availability
      });
    } catch (error) {
      console.error('Error checking availability:', error);
      res.status(500).json({ error: 'Failed to check availability' });
    }
  }
);

// Book endpoint
app.post(
  '/api/book',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('sessionType').trim().notEmpty().withMessage('Session type is required'),
    body('date').isISO8601().withMessage('Valid ISO date string required'),
    body('duration').isInt({ min: 1, max: 4 }).withMessage('Duration must be 1 to 4 hours'),
    body('notes').trim().optional()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { name, email, phone, sessionType, date, duration, notes } = req.body;

    try {
      const eventStart = new Date(date);
      const eventEnd = new Date(eventStart.getTime() + duration * 60 * 60 * 1000);

      // Check calendar availability before booking
      const availabilityCheck = await checkCalendarAvailability(eventStart, eventEnd);
      
      if (!availabilityCheck.available) {
        return res.status(409).json({ 
          error: `Time slot unavailable. Conflicts with: ${availabilityCheck.conflictingEvent.summary} (${availabilityCheck.conflictingEvent.start} - ${availabilityCheck.conflictingEvent.end})`
        });
      }

      // Generate confirmation token and store pending booking
      const confirmationToken = generateBookingToken();
      const bookingData = {
        name, email, phone, sessionType, 
        eventStart, eventEnd, duration, notes,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      };
      
      pendingBookings.set(confirmationToken, bookingData);

      // Send confirmation email to customer
      const confirmationUrl = `http://localhost:5005/api/confirm-booking/${confirmationToken}`;
      
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Confirm Your Photography Session - ${sessionType}`,
        html: `
          <h2>Confirm Your Photography Session</h2>
          <p>Hi ${name},</p>
          <p>Thank you for your booking request. Please confirm your session details:</p>
          <ul>
            <li><strong>Session Type:</strong> ${sessionType}</li>
            <li><strong>Date:</strong> ${eventStart.toLocaleString('en-US', { timeZone: 'America/Chicago' })}</li>
            <li><strong>Duration:</strong> ${duration} hour(s)</li>
            <li><strong>Notes:</strong> ${notes}</li>
          </ul>
          <p><a href="${confirmationUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Confirm Booking</a></p>
          <p>This confirmation link expires in 24 hours.</p>
          <p>If you didn't request this booking, please ignore this email.</p>
        `
      });

      res.status(200).json({ 
        success: true, 
        message: "Booking request submitted! Please check your email to confirm.",
        requiresConfirmation: true
      });
    } catch (error) {
      const timestamp = new Date().toISOString();
      const errorMsg = `[${timestamp}] Booking failed: ${error.message}\n`;
      logStream.write(errorMsg);
      console.error(errorMsg);
      res.status(500).json({ error: "Failed to complete booking." });
    }
  }
);

// Booking confirmation endpoint
app.get('/api/confirm-booking/:token', async (req, res) => {
  const { token } = req.params;
  const bookingData = pendingBookings.get(token);

  if (!bookingData) {
    return res.status(404).send(`
      <html>
        <head><title>Booking Not Found</title></head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px;">
          <h2>Booking Not Found</h2>
          <p>This booking confirmation link is invalid or has expired.</p>
          <p>Please submit a new booking request if needed.</p>
        </body>
      </html>
    `);
  }

  if (new Date() > bookingData.expiresAt) {
    pendingBookings.delete(token);
    return res.status(410).send(`
      <html>
        <head><title>Booking Expired</title></head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px;">
          <h2>Booking Expired</h2>
          <p>This booking confirmation link has expired.</p>
          <p>Please submit a new booking request.</p>
        </body>
      </html>
    `);
  }

  try {
    // Double-check availability before finalizing
    const availabilityCheck = await checkCalendarAvailability(bookingData.eventStart, bookingData.eventEnd);
    
    if (!availabilityCheck.available) {
      pendingBookings.delete(token);
      return res.status(409).send(`
        <html>
          <head><title>Time Slot Unavailable</title></head>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px;">
            <h2>Time Slot No Longer Available</h2>
            <p>Sorry, this time slot is no longer available.</p>
            <p>Conflicts with: ${availabilityCheck.conflictingEvent.summary}</p>
            <p>Please submit a new booking request for a different time.</p>
          </body>
        </html>
      `);
    }

    // Create the calendar event
    const event = {
      summary: `${bookingData.sessionType} - ${bookingData.name}`,
      description: `Name: ${bookingData.name}\nEmail: ${bookingData.email}\nPhone: ${bookingData.phone}\nNotes: ${bookingData.notes}`,
      start: { dateTime: bookingData.eventStart.toISOString(), timeZone: 'America/Chicago' },
      end: { dateTime: bookingData.eventEnd.toISOString(), timeZone: 'America/Chicago' },
    };

    await calendar.events.insert({ calendarId: 'primary', resource: event });

    // Send notification email to photographer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Confirmed Booking - ${bookingData.name}`,
      text: `CONFIRMED BOOKING:\n\nName: ${bookingData.name}\nEmail: ${bookingData.email}\nPhone: ${bookingData.phone}\nSession: ${bookingData.sessionType}\nDate: ${bookingData.eventStart.toLocaleString('en-US', { timeZone: 'America/Chicago' })}\nDuration: ${bookingData.duration} hour(s)\nNotes: ${bookingData.notes}`,
    });

    // Send confirmation email to customer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: bookingData.email,
      subject: `Booking Confirmed - ${bookingData.sessionType}`,
      html: `
        <h2>Booking Confirmed!</h2>
        <p>Hi ${bookingData.name},</p>
        <p>Your photography session has been confirmed:</p>
        <ul>
          <li><strong>Session Type:</strong> ${bookingData.sessionType}</li>
          <li><strong>Date:</strong> ${bookingData.eventStart.toLocaleString('en-US', { timeZone: 'America/Chicago' })}</li>
          <li><strong>Duration:</strong> ${bookingData.duration} hour(s)</li>
        </ul>
        <p>We look forward to working with you!</p>
        <p>If you need to reschedule, please contact us as soon as possible.</p>
      `
    });

    // Remove from pending bookings
    pendingBookings.delete(token);

    res.status(200).send(`
      <html>
        <head><title>Booking Confirmed</title></head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px;">
          <h2 style="color: #28a745;">Booking Confirmed!</h2>
          <p>Thank you, ${bookingData.name}! Your photography session has been confirmed.</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Session Details:</h3>
            <ul>
              <li><strong>Session Type:</strong> ${bookingData.sessionType}</li>
              <li><strong>Date:</strong> ${bookingData.eventStart.toLocaleString('en-US', { timeZone: 'America/Chicago' })}</li>
              <li><strong>Duration:</strong> ${bookingData.duration} hour(s)</li>
            </ul>
          </div>
          <p>A confirmation email has been sent to ${bookingData.email}.</p>
          <p>We look forward to working with you!</p>
        </body>
      </html>
    `);

  } catch (error) {
    const timestamp = new Date().toISOString();
    const errorMsg = `[${timestamp}] Booking confirmation failed: ${error.message}\n`;
    logStream.write(errorMsg);
    console.error(errorMsg);
    
    res.status(500).send(`
      <html>
        <head><title>Confirmation Error</title></head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px;">
          <h2>Confirmation Error</h2>
          <p>There was an error confirming your booking. Please try again or contact us directly.</p>
        </body>
      </html>
    `);
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('Kizirian Photography API is running.');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("EMAIL_USER =", process.env.EMAIL_USER);
  console.log("EMAIL_PASS =", process.env.EMAIL_PASS ? "✔ Loaded" : "✘ Missing");
});