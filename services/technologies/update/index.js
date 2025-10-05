const express = require('express');
const pool = require('./db');
require('dotenv').config();
const app = express();
app.use(express.json());

app.put(['/:id', '/:id/'], async (req, res) => {
  const { name, sector, description, adoptionLevel } = req.body;
  try {
    const result = await pool.query(
      'UPDATE technologies SET name = COALESCE($1, name), sector = COALESCE($2, sector), description = COALESCE($3, description), adoptionLevel = COALESCE($4, adoptionLevel) WHERE id = $5 RETURNING *',
      [name, sector, description, adoptionLevel, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Technology no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar technology', details: err.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(3000, () => {
  console.log('UpdateTechnologyService corriendo en puerto 3000');
});
