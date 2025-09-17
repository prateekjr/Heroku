const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;

// Parse POST body from Salesforce Canvas
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Canvas app endpoint (receives signed request from Salesforce)
app.post("/", (req, res) => {
  // req.body contains the signed request from Salesforce
  // For testing, we just render the VF page iframe
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

// Optional: redirect GET requests to Canvas endpoint
app.get("/", (req, res) => {
  res.send(`
    <h2>This app is a Salesforce Canvas app. Open it inside Salesforce only.</h2>
  `);
});

// Start server
app.listen(PORT, () => console.log(`Shell app running on port ${PORT}`));
