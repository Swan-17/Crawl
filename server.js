require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();

// Serve static files (index.html, CSS, client-side JS)
app.use(express.static(path.join(__dirname, 'public'))); 
// Note: If index.html is in your root folder instead of /public, change to:
// app.use(express.static(__dirname));

// Endpoint for frontend to retrieve the API key
app.get('/api/maps-key', (req, res) => {
  res.json({ key: process.env.GOOGLE_MAPS_API_KEY });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
