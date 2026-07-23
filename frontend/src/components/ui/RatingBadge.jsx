import { Star } from "lucide-react";

export default function RatingBadge({ rating = 0, size = "sm" }) {
  const sizeClasses = size === "lg" ? "text-sm px-3 py-1.5 gap-1.5" : "text-xs px-2.5 py-1 gap-1";

  return (
    <span className={`inline-flex items-center rounded-full glass font-semibold text-highlight ${sizeClasses}`}>
      <Star className={size === "lg" ? "h-4 w-4 fill-highlight" : "h-3 w-3 fill-highlight"} />
      {Number(rating).toFixed(1)}
    </span>
  );
}
