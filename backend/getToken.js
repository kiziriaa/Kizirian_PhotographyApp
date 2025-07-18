const { google } = require('googleapis');
require('dotenv').config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.GCAL_CLIENT_ID,
  process.env.GCAL_CLIENT_SECRET,
  process.env.GCAL_REDIRECT_URI
);

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/calendar.events'],
  prompt: 'consent',
});

console.log("👉 Authorize this app by visiting this URL:\n", authUrl);

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question('\nPaste the code from Google here: ', async (code) => {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    console.log('\n✅ Your Refresh Token:\n', tokens.refresh_token);
  } catch (err) {
    console.error('❌ Error retrieving token:', err.message);
  }
  readline.close();
});
