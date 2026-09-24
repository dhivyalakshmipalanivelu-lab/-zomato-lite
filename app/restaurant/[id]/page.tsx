export default async function RestaurantPage({
  params,
}: {
  params: { id: string };
}) {
  const restaurantId = params.id;

  // This page calls GET /api/restaurants/[id] and renders what it gets.
  // No calculation happens anywhere in this file — we only receive and print.
  const res = await fetch(`/api/restaurants/${restaurantId}`);
  const data = await res.json();

  // The averageRating comes from the backend AVG(rating) calculation.
  // This file contains NO math — we just print the received value.
  const { name, cuisine, area, averageRating, totalReviews, latestReview, reviews } = data;

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        {name}
      </h1>

      <p className="text-sm opacity-6 mb-2">
        {cuisine}, {area}
      </p>

      <div className="mb-6">
        <p className="text-4xl font-bold">
          {averageRating}
        </p>
        <p className="text-xs opacity-6">
          • {totalReviews} reviews
        </p>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold mb-2">Latest review</h4>
        <p className="border-l-4 pl-3">
          {latestReview ? (
            <>
              <strong>Rating:</strong> {latestReview.rating}&nbsp;|&nbsp;
              <strong>Comment:</strong> "{latestReview.comment}"
            </>
          ) : (
            <p>No reviews yet.</p>
          )}
        </p>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Other reviews</h4>
        <ol className="list-disc pl-5 space-y-2">
          {reviews &&
          reviews.map((review: any) => (
            <li key={review.id}>
              Rating: {review.rating} — "{review.comment}"
            </li>
          ))}
        </ol>
      </div>

      <div>
        <a
          href={`/review/${restaurantId}`}
          className="mt-4 text-amber-600 underline"
        >
          Write a review
        </a>
      </div>
    </div>
  );
}