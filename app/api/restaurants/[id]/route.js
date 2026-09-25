import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const restaurantId = parseInt(id, 10);

    // Check if restaurant exists
    const restaurantResult = await pool.query(
      'SELECT * FROM restaurants WHERE id = $1',
      [restaurantId]
    );

    if (restaurantResult.rowCount === 0) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Get all reviews for this restaurant, newest first
    const reviewsResult = await pool.query(
      `SELECT id, rating, comment, created_at
       FROM reviews
       WHERE restaurant_id = $1
       ORDER BY created_at DESC`,
      [restaurantId]
    );

    const reviews = reviewsResult.rows;

    // Calculate average rating
    let averageRating = null;
    if (reviews.length > 0) {
      const ratingSum = reviews.reduce((sum, review) => sum + review.rating, 0);
      averageRating = Math.round((ratingSum / reviews.length) * 10) / 10; // Round to 1 decimal
    }

    // Total reviews count
    const totalReviews = reviews.length;

    // Latest review (first one since ordered by created_at DESC)
    const latestReview = reviews.length > 0 ? reviews[0] : null;

    // Other reviews (exclude the latest one)
    const otherReviews = reviews.slice(1);

    return NextResponse.json({
      name: restaurantResult.rows[0].name,
      cuisine: restaurantResult.rows[0].cuisine,
      area: restaurantResult.rows[0].area,
      averageRating: averageRating,
      totalReviews: totalReviews,
      latestReview: latestReview ? {
        id: latestReview.id,
        rating: latestReview.rating,
        comment: latestReview.comment,
        createdAt: latestReview.created_at,
      } : null,
      reviews: otherReviews.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.created_at,
      })),
    });

  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}