const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const ENTITY = process.env.ENTITY || 'startups'; // 'startups' o
'technologies'
const ACTION = process.env.ACTION || 'read'; // create|read|update|delete
const PORT = process.env.PORT || 3000;

const pool = new Pool({
    user: process.env.POSTGRES_USER || 'user',
    host: process.env.POSTGRES_HOST || 'postgres',
    database: process.env.POSTGRES_DB || 'reto1db',
    password: process.env.POSTGRES_PASSWORD || 'password',
    port: Number(process.env.POSTGRES_PORT || 5432)
});

const app = express();
app.use(express.json());
app.use(cors());

app.get('/health', (req, res) => res.json({ status: 'ok', entity: ENTITY,
action: ACTION }));

async function waitForDb(retries = 15, delay = 2000) {
    for (let i = 0; i < retries; i++) {
        try {
            await pool.query('SELECT 1');
            console.log('Connected to Postgres');
            return;
        } catch (err) {
            console.log(`Postgres not ready, retry ${i + 1}/${retries} - ${err.message}`);
            await new Promise(r => setTimeout(r, delay));
        }
    }
    throw new Error('Could not connect to Postgres');
}

// Helpers: field lists per entity
const SCHEMAS = {
    startups: {
        table: 'startups',
        fields: ['name','foundedAt','location','category','fundingAmount']
    },
    technologies: {
        table: 'technologies',
        fields: ['name','sector','description','adoptionLevel']
    }
};

async function start() {
    await waitForDb();

    // ACTION: create
    if (ACTION === 'create') {
        app.post('/', async (req, res) => {
            try {
                const schema = SCHEMAS[ENTITY];
                if (!schema) return res.status(500).json({ message: 'Unknown entity' });
                const input = schema.fields.map(f => req.body[f] ?? null);
                if (!input[0]) return res.status(400).json({ message: 'Missing required field: name' });
                const params = input;
                const placeholders = params.map((_, i) => `$${i + 1}`).join(',');
                const sql = `INSERT INTO ${schema.table} (${schema.fields.join(',')}) VALUES (${placeholders}) RETURNING *`;
                const { rows } = await pool.query(sql, params);
                return res.status(201).json(rows[0]);
            } catch (err) {
                console.error(err);
                return res.status(500).json({ message: 'Internal error' });
            }
        });
    }
    // ACTION: read
    if (ACTION === 'read') {
        // list with simple filters
        app.get('/', async (req, res) => {
            try {
                const schema = SCHEMAS[ENTITY];
                const where = [];
                const values = [];
                let idx = 1;
                // basic filters: name, category/sector, adoptionLevel
                if (req.query.name) { 
                    where.push(`name ILIKE $${idx++}`);
                    values.push('%' + req.query.name + '%'); 
                }
                if (req.query.category && ENTITY === 'startups') {
                    where.push(`category = $${idx++}`);
                    values.push(req.query.category);
                }
                if (req.query.sector && ENTITY === 'technologies') {
                    where.push(`sector = $${idx++}`);
                    values.push(req.query.sector);
                }
                if (req.query.adoptionLevel && ENTITY === 'technologies') {
                    where.push(`adoptionLevel = $${idx++}`);
                    values.push(req.query.adoptionLevel);
                }
                const sql = `SELECT * FROM ${schema.table}` + (where.length ? `WHERE ${where.join(' AND ')}` : '') + ' ORDER BY id DESC LIMIT 100';
                const { rows } = await pool.query(sql, values);
                return res.json(rows);
            } catch (err) {
                console.error(err);
                return res.status(500).json({ message: 'Internal error' });
            }
        });
    
        // get by id
        app.get('/:id', async (req, res) => {
            try {
                const schema = SCHEMAS[ENTITY];
                const { rows } = await pool.query(`SELECT * FROM ${schema.table} WHERE id = $1`, [req.params.id]);
                if (!rows.length) return res.status(404).json({ message: 'Not found' });
                return res.json(rows[0]);
            } catch (err) {
                console.error(err);
                return res.status(500).json({ message: 'Internal error' });
            }
        });
    }
    // ACTION: update
    if (ACTION === 'update') {
        app.put('/:id', async (req, res) => {
            try {
                const schema = SCHEMAS[ENTITY];
                const fields = schema.fields.filter(f => req.body[f] !== undefined);
                if (!fields.length) return res.status(400).json({ message: 'No updatable fields provided' });
                const values = fields.map(f => req.body[f]);
                const set = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
                const sql = `UPDATE ${schema.table} SET ${set} WHERE id = $$ {fields.length + 1} RETURNING *`;
                values.push(req.params.id);
                const { rows } = await pool.query(sql, values);
                if (!rows.length) return res.status(404).json({ message: 'Not found' });
                return res.json(rows[0]);
            } catch (err) {
                console.error(err);
                return res.status(500).json({ message: 'Internal error' });
            }
        });
    }
    // ACTION: delete
    if (ACTION === 'delete') {
        app.delete('/:id', async (req, res) => {
            try {
                const schema = SCHEMAS[ENTITY];
                const { rowCount } = await pool.query(`DELETE FROM ${schema.table} WHERE id = $1`, [req.params.id]);
                if (!rowCount) return res.status(404).json({ message: 'Not found' });
                return res.status(204).send();
            } catch (err) {
                console.error(err);
                return res.status(500).json({ message: 'Internal error' });
            }
        });
    }
    app.listen(PORT, () => console.log(`${ENTITY} ${ACTION} service listening on ${PORT}`));
}

start().catch(err => {
    console.error('Failed to start service', err);
    process.exit(1);
});


