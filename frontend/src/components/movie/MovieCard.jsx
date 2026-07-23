import { motion } from "framer-motion";
import { Heart, Play, Info } from "lucide-react";
import RatingBadge from "../ui/RatingBadge";

/**
 * A single movie card. Fully reusable across Discover results, Favorites,
 * and History — behavior is controlled entirely through props/callbacks
 * so the parent page owns the data logic.
 */
export default function MovieCard({ movie, isFavorite, onToggleFavorite, onViewDetails, matchScore }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="glass-card group relative overflow-hidden"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <img
          src={movie.poster || "https://picsum.photos/500/750"}
          alt={movie.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent opacity-80" />

        {typeof matchScore === "number" && (
          <span className="absolute left-3 top-3 rounded-full bg-gradient-primary px-3 py-1 text-xs font-bold shadow-glow">
            {matchScore}% Match
          </span>
        )}

        <button
          onClick={() => onToggleFavorite?.(movie)}
          aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full glass transition-colors hover:bg-white/20"
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-highlight text-highlight" : "text-white"}`} />
        </button>

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 pb-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            onClick={() => onViewDetails?.(movie)}
            className="flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-2 text-xs font-semibold text-background hover:bg-white"
          >
            <Info className="h-3.5 w-3.5" /> Details
          </button>
          <button className="flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-white hover:bg-primary-dark">
            <Play className="h-3.5 w-3.5 fill-white" /> Trailer
          </button>
        </div>
      </div>

      <div className="space-y-1.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 font-display text-sm font-bold">{movie.title}</h3>
          <RatingBadge rating={movie.rating} />
        </div>
        <p className="text-xs text-white/50">
          {movie.year} {movie.runtime ? `· ${movie.runtime} min` : ""}
        </p>
      </div>
    </motion.div>
  );
}
