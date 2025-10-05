const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();
const app = express();
// Removed CORS middleware to avoid duplicate headers
app.use(express.json());

app.delete(['/:id', '/:id/'], async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM startups WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Startup no encontrada' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar startup', details: err.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(3000, () => {
  console.log('DeleteStartupService corriendo en puerto 3000');
});
