const express = require('express');
const pool = require('./db');
require('dotenv').config();
const app = express();
app.use(express.json());

// Obtener todas las technologies
app.get(['/', ''], async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM technologies');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al consultar technologies', details: err.message });
  }
});

// Obtener technology por ID
app.get(['/:id', '/:id/'], async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM technologies WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Technology no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al consultar technology', details: err.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(3000, () => {
  console.log('ReadTechnologyService corriendo en puerto 3000');
});
