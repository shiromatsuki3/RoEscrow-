import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Section } from "@/components/section";

type Review = {
  id: string;
  name: string;
  rating: number;
  body: string;
  transactionId: string;
  featured: boolean;
};

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    let mounted = true;

    fetch("/api/reviews")
      .then((response) => (response.ok ? response.json() : { reviews: [] }))
      .then((body: { reviews?: Review[] }) => {
        if (mounted) {
          setReviews(body.reviews ?? []);
        }
      })
      .catch(() => {
        if (mounted) {
          setReviews([]);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (reviews.length === 0) {
    return null;
  }

  return (
    <Section
      id="reviews"
      eyebrow="Reviews"
      title={<>Trusted by traders.</>}
      intro="Featured feedback from completed RoEscrow transactions."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {reviews.slice(0, 6).map((review) => (
          <article key={review.id} className="glass-panel hairline-top rounded-2xl p-7">
            <div className="flex gap-1 text-yellow-300">
              {Array.from({ length: Math.max(1, Math.min(5, review.rating)) }, (_, index) => (
                <Star key={index} className="size-4 fill-current" />
              ))}
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{review.body}</p>
            <div className="mt-6 border-t border-border pt-4">
              <p className="font-semibold">{review.name}</p>
              {review.transactionId && (
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {review.transactionId}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
