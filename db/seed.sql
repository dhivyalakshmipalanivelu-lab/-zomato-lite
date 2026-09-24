-- Seed the restaurant
INSERT INTO restaurants (name, cuisine, area) VALUES ('Ludhiana Burrito', 'Indian', 'Sector 32') ON CONFLICT DO NOTHING;

-- Seed three reviews with created_at values a few days apart
-- Review 1: 5 stars, 8 days ago
INSERT INTO reviews (restaurant_id, rating, comment) VALUES (1, 5, 'Paneer burrito is unreal') ON CONFLICT DO NOTHING;

-- Review 2: 4 stars, 6 days ago  
INSERT INTO reviews (restaurant_id, rating, comment) VALUES (1, 4, 'Good, but slow service') ON CONFLICT DO NOTHING;

-- Review 3: 4 stars, 2 days ago
INSERT INTO reviews (restaurant_id, rating, comment) VALUES (1, 4, 'Solid. Would repeat.') ON CONFLICT DO NOTHING;