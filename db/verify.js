const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function verify() {
  try {
    const restResult = await pool.query('SELECT * FROM restaurants');
    console.log('Restaurants:');
    console.log(restResult.rows);

    const revResult = await pool.query('SELECT * FROM reviews ORDER BY created_at DESC');
    console.log('Reviews:');
    console.log(revResult.rows);

    // Show average rating calculation
    const avgResult = await pool.query('SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews FROM reviews');
    console.log('Average rating:', avgResult.rows[0].avg_rating);
    console.log('Total reviews:', avgResult.rows[0].total_reviews);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

verify();