const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check route — confirm karta hai server chal raha hai
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'VigilMeter backend is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});