import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Play, Clock, Calendar, Sparkles } from "lucide-react";
import RatingBadge from "../ui/RatingBadge";
import { Spinner } from "../ui/LoadingSkeleton";

export default function MovieDetailsModal({ movie, loading, isFavorite, onClose, onToggleFavorite }) {
  return (
    <AnimatePresence>
      {movie !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card relative max-h-[88vh] w-full max-w-3xl overflow-y-auto"
          >
            <button
              onClick={onClose}
              aria-label="Close details"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              <X className="h-4 w-4" />
            </button>

            {loading || !movie?.title ? (
              <div className="flex h-96 items-center justify-center">
                <Spinner className="h-8 w-8" />
              </div>
            ) : (
              <>
                <div className="relative h-56 w-full sm:h-72">
                  <img src={movie.backdrop || movie.poster} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
                </div>

                <div className="relative -mt-20 flex flex-col gap-6 px-6 pb-8 sm:flex-row sm:px-8">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="mx-auto h-56 w-40 flex-shrink-0 rounded-xl2 object-cover shadow-soft ring-2 ring-white/10 sm:mx-0"
                  />

                  <div className="flex-1 space-y-4">
                    <div>
                      <h2 className="font-display text-2xl font-extrabold sm:text-3xl">{movie.title}</h2>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-white/60">
                        <RatingBadge rating={movie.rating} size="lg" />
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" /> {movie.year}
                        </span>
                        {movie.runtime && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" /> {movie.runtime} min
                          </span>
                        )}
                      </div>
                    </div>

                    {movie.genres?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {movie.genres.map((g) => (
                          <span key={g} className="rounded-full glass px-3 py-1 text-xs text-white/70">
                            {g}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-sm leading-relaxed text-white/70">{movie.overview}</p>

                    {movie.director && (
                      <p className="text-sm text-white/60">
                        <span className="font-semibold text-white/90">Director:</span> {movie.director}
                      </p>
                    )}

                    {movie.cast?.length > 0 && (
                      <div>
                        <p className="mb-2 text-sm font-semibold text-white/90">Top Cast</p>
                        <div className="flex flex-wrap gap-2">
                          {movie.cast.map((c) => (
                            <span key={c.name} className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-white/70">
                              {c.name}
                              {c.character ? <span className="text-white/40"> as {c.character}</span> : null}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {movie.matchReasons?.length > 0 && (
                      <div className="gradient-border relative rounded-xl2 bg-white/5 p-4">
                        <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-accent">
                          <Sparkles className="h-4 w-4" /> Why this matches you
                        </p>
                        <ul className="space-y-1 text-sm text-white/70">
                          {movie.matchReasons.map((reason, i) => (
                            <li key={i}>• {reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3 pt-2">
                      {movie.trailerKey ? (
                        <a
                          href={`https://www.youtube.com/watch?v=${movie.trailerKey}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-primary text-sm"
                        >
                          <Play className="h-4 w-4 fill-white" /> Watch Trailer
                        </a>
                      ) : (
                        <button className="btn-primary text-sm" disabled title="Trailer unavailable in demo mode">
                          <Play className="h-4 w-4 fill-white" /> Watch Trailer
                        </button>
                      )}
                      <button onClick={() => onToggleFavorite?.(movie)} className="btn-secondary text-sm">
                        <Heart className={`h-4 w-4 ${isFavorite ? "fill-highlight text-highlight" : ""}`} />
                        {isFavorite ? "Saved" : "Save"}
                      </button>
                    </div>

                    <p className="text-xs text-white/30">Streaming availability: coming soon.</p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
