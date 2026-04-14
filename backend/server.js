require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

const path = require('path');

app.use(cors());
app.use(express.json());

// Test route
app.get('/api/history', (req, res) => {
  res.send('Calculator Backend Running 🚀');
});

// GET history
app.get('/api/history', async (req, res) => {
  try {
    const data = await db.getHistory();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// POST calculation
app.post('/api/history', async (req, res) => {
  try {
    const { a, operator, b, result } = req.body;

    await db.saveCalculation(a, operator, b, result);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save calculation' });
  }
});

// DELETE history
app.delete('/api/history', async (req, res) => {
  try {
    await db.clearHistory();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete history' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
