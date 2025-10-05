const express = require('express');
const pool = require('./db');
require('dotenv').config();
const app = express();
app.use(express.json());

app.post('/', async (req, res) => {
  const { name, sector, description, adoptionLevel } = req.body;
  if (!name || !sector || !description || !adoptionLevel) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO technologies (name, sector, description, adoptionLevel) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, sector, description, adoptionLevel]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear technology', details: err.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(3000, () => {
  console.log('CreateTechnologyService corriendo en puerto 3000');
});
