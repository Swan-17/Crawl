import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('.')) // Serves index.html directly

const GOOGLE_KEY = process.env.GOOGLE_MAPS_KEY

// Proxy route for Google Places API
app.get('/api/pubs', async (req, res) => {
  const { lat, lng } = req.query
  if (!lat || !lng) return res.status(400).json({ error: 'Missing lat/lng' })
  if (!GOOGLE_KEY) return res.status(500).json({ error: 'API key missing in .env' })

  try {
    const response = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.location,places.rating'
      },
      body: JSON.stringify({
        includedTypes: ['bar'],
        maxResultCount: 20,
        locationRestriction: {
          circle: { center: { latitude: Number(lat), longitude: Number(lng) }, radius: 3000 }
        }
      })
    })

    const data = await response.json()
    if (!response.ok) return res.status(500).json({ error: data.error?.message || 'Places search failed' })

    const pubs = (data.places || []).map(p => ({
      id: p.id,
      name: p.displayName?.text || 'Unknown Pub',
      latitude: p.location.latitude,
      longitude: p.location.longitude,
      rating: p.rating || 'N/A'
    }))

    res.json(pubs)
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Endpoint to securely load the Google Maps JS SDK script tag in index.html
app.get('/api/config', (req, res) => res.json({ apiKey: GOOGLE_KEY }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))
