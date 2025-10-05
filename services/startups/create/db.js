const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST || 'postgres',
  user: process.env.PGUSER || 'user',
  password: process.env.PGPASSWORD || 'password',
  database: process.env.PGDATABASE || 'reto1db',
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
});

module.exports = pool;
