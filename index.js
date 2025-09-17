const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// ---- Get Salesforce Access Token via Username-Password Flow ----
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

// ---- Public Form ----
app.get("/", (req, res) => {
  res.send(`
    <html>
      <body>
        <form action="/submit" method="POST">
          <input type="text" name="Name" placeholder="Name" required />
          <input type="email" name="Email" placeholder="Email" required />
          <button type="submit">Submit</button>
        </form>
      </body>
    </html>
  `);
});

// ---- Handle Form Submit ----
app.post("/submit", async (req, res) => {
  try {
    const tokenResponse = await getAccessToken();
    const accessToken = tokenResponse.access_token;
    const instanceUrl = tokenResponse.instance_url;

    // Example: create a Lead in Salesforce
    await axios.post(
      `${instanceUrl}/services/data/v57.0/sobjects/Lead/`,
      {
        LastName: req.body.Name,
        Company: "Public Form User",
        Email: req.body.Email
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.send("✅ Thank you! Your submission was recorded.");
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("❌ Submission failed.");
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
