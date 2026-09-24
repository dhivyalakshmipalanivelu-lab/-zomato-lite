require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function setup() {
  try {
    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS restaurants (
        id        SERIAL PRIMARY KEY,
        name      TEXT NOT NULL,
        cuisine   TEXT NOT NULL,
        area      TEXT NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id            SERIAL PRIMARY KEY,
        restaurant_id INTEGER NOT NULL REFERENCES restaurants(id),
        rating        INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment       TEXT NOT NULL,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Seed the restaurant
    await pool.query(`
      INSERT INTO restaurants (name, cuisine, area) VALUES ('Ludhiana Burrito', 'Indian', 'Sector 32') ON CONFLICT DO NOTHING
    `);

    // Seed three reviews with created_at values a few days apart
    await pool.query(`
      INSERT INTO reviews (restaurant_id, rating, comment) VALUES (1, 5, 'Paneer burrito is unreal') ON CONFLICT DO NOTHING
    `);

    await pool.query(`
      INSERT INTO reviews (restaurant_id, rating, comment) VALUES (1, 4, 'Good, but slow service') ON CONFLICT DO NOTHING
    `);

    await pool.query(`
      INSERT INTO reviews (restaurant_id, rating, comment) VALUES (1, 4, 'Solid. Would repeat.') ON CONFLICT DO NOTHING
    `);

    console.log('Database setup complete!');
    console.log('Tables created and seeded successfully.');
  } catch (err) {
    console.error('Error during database setup:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setup();