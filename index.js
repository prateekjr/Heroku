const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// ---- Get Salesforce Access Token ----
async function getAccessToken() {
  const response = await axios.post(
    `${process.env.SFDC_LOGIN_URL}/services/oauth2/token`,
    new URLSearchParams({
      grant_type: "password",
      client_id: process.env.SFDC_CLIENT_ID,
      client_secret: process.env.SFDC_CLIENT_SECRET,
      username: process.env.SFDC_USERNAME,
      password: process.env.SFDC_PASSWORD
    })
  );
  return response.data;
}

// ---- Route: Show VF Page ----
app.get("/", async (req, res) => {
  try {
    const tokenResponse = await getAccessToken();
    const accessToken = tokenResponse.access_token;
    const instanceUrl = tokenResponse.instance_url;

    // Your VF page full URL
    const vfUrl = `${instanceUrl}/apex/PageBlockSectionItem`;

    // Fetch VF page HTML with access token
    const vfResponse = await axios.get(vfUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    // Send VF page HTML back to user
    res.send(vfResponse.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("❌ Failed to load VF page");
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
