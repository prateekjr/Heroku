const express = require("express");
const session = require("express-session");
const axios = require("axios");
const querystring = require("querystring");

const app = express();
const PORT = process.env.PORT || 3000;

// Session middleware (to keep user state in Heroku app)
app.use(session({
  secret: "supersecret",
  resave: false,
  saveUninitialized: true
}));

// Step 1: Redirect user to Salesforce login
app.get("/", (req, res) => {
  const authUrl = `${process.env.SF_LOGIN_URL}/services/oauth2/authorize?response_type=code&client_id=${process.env.SF_CLIENT_ID}&redirect_uri=${process.env.SF_CALLBACK_URL}`;
  res.redirect(authUrl);
});

// Step 2: Salesforce redirects here with auth code
app.get("/oauth/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.send("Error: No code received from Salesforce");
  }

  try {
    // Step 3: Exchange code for access token
    const tokenResponse = await axios.post(
      `${process.env.SF_LOGIN_URL}/services/oauth2/token`,
      querystring.stringify({
        grant_type: "authorization_code",
        code: code,
        client_id: process.env.SF_CLIENT_ID,
        client_secret: process.env.SF_CLIENT_SECRET,
        redirect_uri: process.env.SF_CALLBACK_URL
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    // Save token in session
    req.session.accessToken = tokenResponse.data.access_token;
    req.session.instanceUrl = tokenResponse.data.instance_url;

    // Step 4: Render VF page with session id injected
    const vfUrl = `${process.env.VF_PAGE_URL}?sid=${req.session.accessToken}`;

    res.send(`
      <html>
        <body style="margin:0; padding:0; height:100vh;">
          <iframe 
            src="${vfUrl}" 
            width="100%" 
            height="100%" 
            frameborder="0">
          </iframe>
        </body>
      </html>
    `);

  } catch (err) {
    console.error("OAuth Error:", err.response?.data || err.message);
    res.send("Authentication failed. Check logs.");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Heroku app running on port ${PORT}`);
});
