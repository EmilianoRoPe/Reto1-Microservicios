const express = require('express');
const pool = require('./db');
require('dotenv').config();
const app = express();
app.use(express.json());

app.put(['/:id', '/:id/'], async (req, res) => {
  const { name, foundedAt, location, category, fundingAmount } = req.body;
  // Validar formato de fecha si se envía foundedAt
  if (foundedAt && !/^\d{4}-\d{2}-\d{2}$/.test(foundedAt)) {
    return res.status(400).json({ message: 'El campo foundedAt debe tener formato YYYY-MM-DD' });
  }
  try {
    const result = await pool.query(
      'UPDATE startups SET name = COALESCE($1, name), foundedAt = COALESCE($2, foundedAt), location = COALESCE($3, location), category = COALESCE($4, category), fundingAmount = COALESCE($5, fundingAmount) WHERE id = $6 RETURNING *',
      [name, foundedAt, location, category, fundingAmount, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Startup no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar startup', details: err.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(3000, () => {
  console.log('UpdateStartupService corriendo en puerto 3000');
});
