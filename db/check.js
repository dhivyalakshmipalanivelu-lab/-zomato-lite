const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT * FROM restaurants', (err, res) => { if (err) console.error(err); else console.log('Restaurants:', res.rows); });
pool.query('SELECT * FROM reviews ORDER BY created_at DESC', (err2, res2) => { if (err2) console.error(err2); else console.log('Reviews:', res2.rows); });
pool.query('SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews FROM reviews', (err3, res3) => { if (err3) console.error(err3); else console.log('Aggregates:', res3.rows); pool.end(); });