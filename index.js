const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Route to embed VF page in iframe
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

// Start server
app.listen(PORT, () => console.log(`Shell app running on port ${PORT}`));
