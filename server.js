const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve index.html with the environment variable injected
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  fs.readFile(indexPath, 'utf8', (err, html) => {
    if (err) {
      console.error('Error reading index.html:', err);
      return res.status(500).send('Server Error');
    }
    
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || '';
    const renderedHtml = html.replace('YOUR_GOOGLE_MAPS_API_KEY', apiKey);
    
    res.send(renderedHtml);
  });
});

// Serve static assets if present
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`🍺 Pub Crawl server running at http://localhost:${PORT}`);
});
