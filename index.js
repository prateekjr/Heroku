const express = require("express");
const axios = require("axios");
const querystring = require("querystring");

const app = express();
const PORT = process.env.PORT || 3000;

// Get Salesforce token with username-password flow
async function getAccessToken() {
  const response = await axios.post(
    `${process.env.SFDC_LOGIN_URL}/services/oauth2/token`,
    querystring.stringify({
      grant_type: "password",
      client_id: process.env.SFDC_CLIENT_ID,
      client_secret: process.env.SFDC_CLIENT_SECRET,
      username: process.env.SFDC_USERNAME,
      password: process.env.SFDC_PASSWORD
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  return response.data;
}

// Route → show VF page in iframe with session injected
app.get("/", async (req, res) => {
  try {
    const tokenData = await getAccessToken();
    const vfUrl = `${process.env.SFDC_INSTANCE_URL}?sid=${tokenData.access_token}`;

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
    console.error("Error getting token:", err.response?.data || err.message);
    res.status(500).send("Authentication failed. Check Heroku logs.");
  }
});

app.listen(PORT, () => console.log(`Heroku app running on port ${PORT}`));
