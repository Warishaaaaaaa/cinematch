import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Sparkles, RotateCcw, Frown } from "lucide-react";
import MovieCard from "../components/movie/MovieCard";
import MovieDetailsModal from "../components/movie/MovieDetailsModal";
import { MovieGridSkeleton } from "../components/ui/LoadingSkeleton";
import GlassCard from "../components/ui/GlassCard";
import { useAuth } from "../context/AuthContext";
import { movieService, favoriteService, historyService } from "../services/movieService";

export default function Discover() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const [recommendations, setRecommendations] = useState([]);
  const [hasRecommendations, setHasRecommendations] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null); // null = not searching
  const [loading, setLoading] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [activeMovie, setActiveMovie] = useState(null); // details modal
  const [modalLoading, setModalLoading] = useState(false);

  // Load recommendations saved by the questionnaire flow
  useEffect(() => {
    const raw = sessionStorage.getItem("cinematch_recommendations");
    if (raw) {
      try {
        const data = JSON.parse(raw);
        setRecommendations(data.recommendations || []);
        setHasRecommendations(true);
      } catch {
        setHasRecommendations(false);
      }
    }
  }, [location.key]);

  // Load the user's favorite ids so cards can show the correct heart state
  const loadFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavoriteIds(new Set());
      return;
    }
    try {
      const data = await favoriteService.list();
      setFavoriteIds(new Set(data.favorites.map((f) => f.movieId)));
    } catch {
      // Non-fatal: favorites indicator just won't show
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    setLoading(true);
    try {
      const data = await movieService.search(searchQuery.trim());
      setSearchResults(data.results);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults(null);
  };

  const toggleFavorite = async (movie) => {
    if (!isAuthenticated) {
      window.location.assign("/login");
      return;
    }
    const isFav = favoriteIds.has(movie.id);
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      isFav ? next.delete(movie.id) : next.add(movie.id);
      return next;
    });
    try {
      if (isFav) {
        await favoriteService.remove(movie.id);
      } else {
        await favoriteService.add({
          movieId: movie.id,
          title: movie.title,
          poster: movie.poster,
          rating: movie.rating,
          genre: movie.genres || [],
          year: movie.year,
        });
      }
    } catch {
      loadFavorites(); // resync on failure
    }
  };

  const openDetails = async (movie) => {
    setActiveMovie({});
    setModalLoading(true);
    try {
      const data = await movieService.getById(movie.id);
      setActiveMovie({ ...data.movie, matchReasons: movie.matchReasons });
      if (isAuthenticated) {
        historyService.add({ movieId: movie.id, title: movie.title, poster: movie.poster }).catch(() => {});
      }
    } finally {
      setModalLoading(false);
    }
  };

  const resetQuiz = () => {
    sessionStorage.removeItem("cinematch_recommendations");
    setHasRecommendations(false);
    setRecommendations([]);
  };

  const displayedMovies = searchResults !== null ? searchResults : recommendations;
  const isSearching = searchResults !== null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
            {isSearching ? "Search Results" : hasRecommendations ? "Your Matches" : "Discover"}
          </h1>
          <p className="mt-2 text-white/55">
            {isSearching
              ? `Showing results for "${searchQuery}"`
              : hasRecommendations
              ? "Ranked and ready — picked to fit your answers."
              : "Search for a title, or take the quiz for personalized picks."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasRecommendations && !isSearching && (
            <button onClick={resetQuiz} className="btn-secondary text-sm">
              <RotateCcw className="h-4 w-4" /> Retake Quiz
            </button>
          )}
          <Link to="/questionnaire" className="btn-primary text-sm">
            <Sparkles className="h-4 w-4" /> {hasRecommendations ? "New Quiz" : "Take the Quiz"}
          </Link>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mb-10 flex gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies by title..."
            className="input-glass pl-11"
          />
        </div>
        <button type="submit" className="btn-primary text-sm">
          Search
        </button>
        {isSearching && (
          <button type="button" onClick={clearSearch} className="btn-secondary text-sm">
            Clear
          </button>
        )}
      </form>

      {loading ? (
        <MovieGridSkeleton />
      ) : displayedMovies.length === 0 ? (
        <EmptyState hasRecommendations={hasRecommendations} isSearching={isSearching} />
      ) : (
        <motion.div layout className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {displayedMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={favoriteIds.has(movie.id)}
              onToggleFavorite={toggleFavorite}
              onViewDetails={openDetails}
              matchScore={!isSearching ? movie.matchScore : undefined}
            />
          ))}
        </motion.div>
      )}

      <MovieDetailsModal
        movie={activeMovie}
        loading={modalLoading}
        isFavorite={activeMovie ? favoriteIds.has(activeMovie.id) : false}
        onClose={() => setActiveMovie(null)}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}

function EmptyState({ hasRecommendations, isSearching }) {
  return (
    <GlassCard className="flex flex-col items-center gap-4 px-8 py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
        <Frown className="h-6 w-6 text-white/40" />
      </span>
      <div>
        <p className="font-display text-lg font-bold">
          {isSearching ? "No movies found" : "No recommendations yet"}
        </p>
        <p className="mt-1 text-sm text-white/50">
          {isSearching
            ? "Try a different title or check your spelling."
            : "Take the quick quiz and we'll curate a list just for you."}
        </p>
      </div>
      {!isSearching && !hasRecommendations && (
        <Link to="/questionnaire" className="btn-primary mt-2 text-sm">
          <Sparkles className="h-4 w-4" /> Take the Quiz
        </Link>
      )}
    </GlassCard>
  );
}
