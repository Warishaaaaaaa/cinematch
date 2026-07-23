import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import MovieCard from "../components/movie/MovieCard";
import MovieDetailsModal from "../components/movie/MovieDetailsModal";
import { MovieGridSkeleton } from "../components/ui/LoadingSkeleton";
import GlassCard from "../components/ui/GlassCard";
import { favoriteService, movieService, historyService } from "../services/movieService";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMovie, setActiveMovie] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await favoriteService.list();
      setFavorites(data.favorites);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRemove = async (movie) => {
    setFavorites((prev) => prev.filter((f) => f.movieId !== movie.id));
    try {
      await favoriteService.remove(movie.id);
    } catch {
      load();
    }
  };

  const openDetails = async (movie) => {
    setActiveMovie({});
    setModalLoading(true);
    try {
      const data = await movieService.getById(movie.id);
      setActiveMovie(data.movie);
      historyService.add({ movieId: movie.id, title: movie.title, poster: movie.poster }).catch(() => {});
    } finally {
      setModalLoading(false);
    }
  };

  const cards = favorites.map((f) => ({
    id: f.movieId,
    title: f.title,
    poster: f.poster,
    rating: f.rating,
    year: f.year,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10">
        <h1 className="flex items-center gap-3 font-display text-3xl font-extrabold sm:text-4xl">
          <Heart className="h-7 w-7 fill-highlight text-highlight" /> Your Favorites
        </h1>
        <p className="mt-2 text-white/55">Every movie you've saved, all in one place.</p>
      </div>

      {loading ? (
        <MovieGridSkeleton />
      ) : cards.length === 0 ? (
        <GlassCard className="flex flex-col items-center gap-4 px-8 py-20 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
            <Heart className="h-6 w-6 text-white/40" />
          </span>
          <div>
            <p className="font-display text-lg font-bold">No favorites yet</p>
            <p className="mt-1 text-sm text-white/50">Tap the heart on any movie card to save it here.</p>
          </div>
          <Link to="/discover" className="btn-primary mt-2 text-sm">
            <Sparkles className="h-4 w-4" /> Discover Movies
          </Link>
        </GlassCard>
      ) : (
        <motion.div layout className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {cards.map((movie) => (
            <MovieCard key={movie.id} movie={movie} isFavorite onToggleFavorite={handleRemove} onViewDetails={openDetails} />
          ))}
        </motion.div>
      )}

      <MovieDetailsModal
        movie={activeMovie}
        loading={modalLoading}
        isFavorite
        onClose={() => setActiveMovie(null)}
        onToggleFavorite={handleRemove}
      />
    </div>
  );
}
