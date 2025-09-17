const express = require("express");
const axios = require("axios"); // needed if you use API proxy
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// ---- Route 1: Embed VF page in iframe ----
app.get("/", (req, res) => {
  res.send(`
    <html>
      <body style="margin:0; padding:0; height:100vh;">
        <iframe 
          src="https://prateektestdomain-dev-ed--c.vf.force.com/apex/PageBlockSectionItem"
          width="100%" 
          height="100%" 
          frameborder="0">
        </iframe>
      </body>
    </html>
  `);
});

// ---- Route 2: Sample API proxy to Salesforce ----
app.post("/proxy", async (req, res) => {
  try {
    // Salesforce instance URL and token from Heroku Config Vars
    const instanceUrl = process.env.SFDC_INSTANCE_URL;
    const accessToken = process.env.SFDC_ACCESS_TOKEN;

    // Example: call your Apex REST endpoint
    const response = await axios.post(
      `${instanceUrl}/services/apexrest/YourEndpoint`,
      req.body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Shell app running on port ${PORT}`));
