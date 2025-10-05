const express = require('express');
const pool = require('./db');
require('dotenv').config();
const app = express();
app.use(express.json());

// Obtener todas las startups
app.get(['/', ''], async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM startups');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al consultar startups', details: err.message });
  }
});

// Obtener startup por ID
app.get(['/:id', '/:id/'], async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM startups WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Startup no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al consultar startup', details: err.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(3000, () => {
  console.log('ReadStartupService corriendo en puerto 3000');
});
