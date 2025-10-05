const express = require('express');
const pool = require('./db');
require('dotenv').config();
const app = express();
app.use(express.json());

app.post('/', async (req, res) => {
  const { name, foundedAt, location, category, fundingAmount } = req.body;
  if (!name || !foundedAt || !location || !category || !fundingAmount) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }
  // Validar formato de fecha YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(foundedAt)) {
    return res.status(400).json({ message: 'El campo foundedAt debe tener formato YYYY-MM-DD' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO startups (name, foundedAt, location, category, fundingAmount) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, foundedAt, location, category, fundingAmount]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear startup', details: err.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(3000, () => {
  console.log('CreateStartupService corriendo en puerto 3000');
});
