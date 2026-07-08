"use client";

import { useState } from "react";

export default function ReviewForm({
  token,
  clientName,
  clientBusiness,
}: {
  token: string;
  clientName: string;
  clientBusiness?: string;
}) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [business, setBusiness] = useState(clientBusiness ?? "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (review.trim().length < 5) {
      setError("Please write a few words about your experience.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, rating, review: review.trim(), clientBusiness: business.trim() }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong. Please try again.");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-3xl border border-mint/25 bg-mint/10 p-8 text-center">
        <p className="text-4xl" aria-hidden>
          🎉
        </p>
        <h2 className="mt-3 text-xl font-bold text-ink">Thank you, {clientName}!</h2>
        <p className="mt-2 text-sm leading-6 text-ink-soft">
          Your review has been received. It will appear on the website once approved.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-[0_24px_60px_-30px_rgba(11,19,48,0.25)] space-y-6"
    >
      <div>
        <label className="block text-sm font-semibold text-ink">Your rating</label>
        <div className="mt-2 flex items-center gap-1.5" role="radiogroup" aria-label="Rating out of 5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={rating === star}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className={`text-4xl leading-none transition-transform hover:scale-110 ${
                star <= (hover || rating) ? "text-amber-400" : "text-line"
              }`}
            >
              ★
            </button>
          ))}
          <span className="ml-2 text-sm font-semibold text-ink-soft">{rating}/5</span>
        </div>
      </div>

      <div>
        <label htmlFor="review" className="block text-sm font-semibold text-ink">
          Your review
        </label>
        <textarea
          id="review"
          rows={4}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="What was the project? How was the process and the result?"
          className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 focus:border-accent focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="business" className="block text-sm font-semibold text-ink">
          Business name <span className="font-normal text-ink-soft">(optional)</span>
        </label>
        <input
          id="business"
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
          placeholder="e.g. Spice Route, Pune"
          className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 focus:border-accent focus:outline-none"
        />
      </div>

      {error && <p className="text-sm font-medium text-red-500">{error}</p>}

      <button
        disabled={submitting}
        className="w-full rounded-full bg-accent px-6 py-3.5 text-base font-semibold text-white shadow-[0_12px_28px_-10px_rgba(40,87,255,0.7)] transition-all hover:bg-accent-deep disabled:opacity-60"
      >
        {submitting ? "Submitting…" : "Submit review"}
      </button>
      <p className="text-center text-xs text-ink-soft">
        Submitting as <b>{clientName}</b> · Only honest reviews are published.
      </p>
    </form>
  );
}
