const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Sample route for Salesforce Canvas (iframe)
app.get("/", (req, res) => {
  res.send(`
    <html>
      <body style="margin:0; padding:0; height:100vh;">
        <iframe src="https://yourSalesforceDomain.lightning.force.com/apex/YourVFPage"
                width="100%" height="100%" frameborder="0"></iframe>
      </body>
    </html>
  `);
});

app.listen(PORT, () => console.log(`Shell app running on port ${PORT}`));
