import axios from "axios";
import { MOCK_MOVIES } from "./mockMovies.js";

const TMDB_BASE_URL = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.TMDB_API_KEY || "";
const IMAGE_BASE_URL = process.env.TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p";

const hasKey = () => Boolean(TMDB_API_KEY && TMDB_API_KEY !== "your_tmdb_v3_api_key_here");

const client = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 8000,
  params: { api_key: TMDB_API_KEY },
});

const normalize = (m) => ({
  id: String(m.id),
  title: m.title || m.name,
  poster: m.poster_path ? `${IMAGE_BASE_URL}/w500${m.poster_path}` : m.poster || null,
  backdrop: m.backdrop_path ? `${IMAGE_BASE_URL}/original${m.backdrop_path}` : m.backdrop || null,
  overview: m.overview,
  rating: m.vote_average ?? m.rating ?? 0,
  releaseDate: m.release_date || m.releaseDate || "",
  year: (m.release_date || m.releaseDate || "").slice(0, 4),
  genreIds: m.genre_ids || m.genreIds || [],
  genres: m.genres || [],
  runtime: m.runtime || null,
  originalLanguage: m.original_language || m.originalLanguage || "en",
});

/**
 * All TMDb-facing calls live here. If no API key is configured, the
 * service transparently falls back to a curated local mock dataset so
 * the app remains fully demoable out of the box.
 */
export const tmdbService = {
  isLive: hasKey(),

  async discover({ genreIds = [], language, minRuntime, maxRuntime, releaseFrom, releaseTo, page = 1 } = {}) {
    if (!hasKey()) {
      return filterMock({ genreIds, language, minRuntime, maxRuntime, releaseFrom, releaseTo });
    }
    const { data } = await client.get("/discover/movie", {
      params: {
        with_genres: genreIds.join(","),
        with_original_language: language || undefined,
        "primary_release_date.gte": releaseFrom || undefined,
        "primary_release_date.lte": releaseTo || undefined,
        sort_by: "popularity.desc",
        page,
      },
    });
    return data.results.map(normalize);
  },

  async search(query, page = 1) {
    if (!hasKey()) {
      const q = query.toLowerCase();
      return MOCK_MOVIES.filter((m) => m.title.toLowerCase().includes(q)).map(normalize);
    }
    const { data } = await client.get("/search/movie", { params: { query, page } });
    return data.results.map(normalize);
  },

  async getById(id) {
    if (!hasKey()) {
      const found = MOCK_MOVIES.find((m) => String(m.id) === String(id));
      return found ? normalize(found) : null;
    }
    const { data } = await client.get(`/movie/${id}`, {
      params: { append_to_response: "credits,videos" },
    });
    return {
      ...normalize(data),
      director: data.credits?.crew?.find((c) => c.job === "Director")?.name || "Unknown",
      cast: (data.credits?.cast || []).slice(0, 6).map((c) => ({ name: c.name, character: c.character, photo: c.profile_path ? `${IMAGE_BASE_URL}/w185${c.profile_path}` : null })),
      trailerKey: data.videos?.results?.find((v) => v.type === "Trailer" && v.site === "YouTube")?.key || null,
      genres: data.genres?.map((g) => g.name) || [],
    };
  },

  async getGenreList() {
    if (!hasKey()) return MOCK_GENRES;
    const { data } = await client.get("/genre/movie/list");
    return data.genres;
  },
};

const MOCK_GENRES = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
  { id: 16, name: "Animation" },
  { id: 99, name: "Documentary" },
  { id: 14, name: "Fantasy" },
];

function filterMock({ genreIds = [], language, minRuntime, maxRuntime, releaseFrom, releaseTo }) {
  let results = [...MOCK_MOVIES];

  if (genreIds.length) {
    results = results.filter((m) => m.genre_ids.some((g) => genreIds.includes(g)));
  }
  if (language) {
    results = results.filter((m) => m.original_language === language);
  }
  if (minRuntime) {
    results = results.filter((m) => m.runtime >= minRuntime);
  }
  if (maxRuntime) {
    results = results.filter((m) => m.runtime <= maxRuntime);
  }
  if (releaseFrom) {
    results = results.filter((m) => m.release_date >= releaseFrom);
  }
  if (releaseTo) {
    results = results.filter((m) => m.release_date <= releaseTo);
  }

  return results.map(normalize);
}

export { normalize };
