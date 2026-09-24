export default function ReviewPage({
  params,
}: {
  params: { restaurantId: string };
}) {
  const restaurantId = params.restaurantId;
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurantId: Number(restaurantId), rating: rating!, comment }),
      });
      if (!res.ok) {
        const { error: backendError } = await res.json();
        setError(backendError);
        return;
      }
      // On success, go to restaurant page
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Ludhiana Burrito</h1>

      <div className="mb-4">
        <p className="text-sm opacity-6">Select a rating</p>
        <div className="flex gap-1">
          {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
            <button
              key={star}
              className={`
                flex-1 py-2 border rounded
                ${rating === star ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-100'}
              `}
              onClick={() => setRating(star)}
            >
              ♦︎
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm opacity-6 mb-2">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full py-2 border rounded"
          rows={3}
          placeholder="Write your review..."
        ></textarea>
      </div>

      <button
        disabled={!rating || comment.trim() === ''}
        onClick={handleSubmit}
        className="mt-4 py-2 bg-amber-500 text-white rounded disabled:opacity-50"
      >
        Submit review
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}