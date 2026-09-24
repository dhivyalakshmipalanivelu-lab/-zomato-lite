import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { restaurantId, rating, comment } = body;

    // Validation 1: rating is an integer from 1 to 5
    if (
      typeof rating !== 'number' ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return NextResponse.json(
        { error: 'Rating must be an integer from 1 to 5' },
        { status: 400 }
      );
    }

    // Validation 2: comment is a non-empty string after trimming whitespace
    if (typeof comment !== 'string' || comment.trim() === '') {
      return NextResponse.json(
        { error: 'Comment must be a non-empty string' },
        { status: 400 }
      );
    }

    // Validation 3: restaurantId refers to a restaurant that actually exists
    const restaurantResult = await pool.query(
      'SELECT id FROM restaurants WHERE id = $1',
      [restaurantId]
    );

    if (restaurantResult.rowCount === 0) {
      return NextResponse.json(
        { error: 'Restaurant does not exist' },
        { status: 400 }
      );
    }

    // Insert the review
    const reviewResult = await pool.query(
      `INSERT INTO reviews (restaurant_id, rating, comment)
       VALUES ($1, $2, $3)
       RETURNING id, rating, comment, created_at`,
      [restaurantId, rating, comment]
    );

    return NextResponse.json({
      success: true,
      reviewId: reviewResult.rows[0].id,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}