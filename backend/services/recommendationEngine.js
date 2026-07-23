import { tmdbService } from "./tmdbService.js";

// Maps a "mood" answer to genre ids that best fit that emotional register.
const MOOD_GENRE_MAP = {
  happy: [35, 10751, 16], // Comedy, Family, Animation
  romantic: [10749, 18], // Romance, Drama
  thrilled: [53, 28], // Thriller, Action
  scared: [27, 53], // Horror, Thriller
  thoughtful: [18, 99], // Drama, Documentary
  adventurous: [12, 878, 14], // Adventure, Sci-Fi, Fantasy
};

const GENRE_NAME_TO_ID = {
  action: 28, comedy: 35, drama: 18, horror: 27, romance: 10749,
  "sci-fi": 878, scifi: 878, thriller: 53, animation: 16,
  documentary: 99, fantasy: 14, adventure: 12, family: 10751,
};

const RUNTIME_RANGES = {
  short: { max: 100 },        // under 100 min
  medium: { min: 90, max: 130 },
  long: { min: 120 },
};

const RELEASE_RANGES = {
  classic: { from: "1970-01-01", to: "1999-12-31" },
  "2000s": { from: "2000-01-01", to: "2009-12-31" },
  "2010s": { from: "2010-01-01", to: "2019-12-31" },
  recent: { from: "2020-01-01", to: "2026-12-31" },
};

/**
 * Scores a movie against the user's questionnaire answers. Higher score
 * = stronger match. This is intentionally transparent (rule-based) rather
 * than a black box, so the "why this matches" explanation is always honest.
 */
function scoreMovie(movie, answers) {
  let score = 0;
  const reasons = [];

  const moodGenres = MOOD_GENRE_MAP[answers.mood] || [];
  if (moodGenres.some((g) => movie.genreIds.includes(g))) {
    score += 3;
    reasons.push(`Matches your ${answers.mood} mood`);
  }

  const chosenGenreIds = (answers.genres || []).map((g) => GENRE_NAME_TO_ID[g.toLowerCase()]).filter(Boolean);
  const genreMatches = chosenGenreIds.filter((g) => movie.genreIds.includes(g));
  if (genreMatches.length) {
    score += genreMatches.length * 2;
    reasons.push(`In your preferred genre${genreMatches.length > 1 ? "s" : ""}`);
  }

  if (answers.language && movie.originalLanguage === answers.language) {
    score += 2;
    reasons.push("Matches your preferred language");
  }

  if (answers.runtime && RUNTIME_RANGES[answers.runtime]) {
    const { min = 0, max = 999 } = RUNTIME_RANGES[answers.runtime];
    if (movie.runtime == null || (movie.runtime >= min && movie.runtime <= max)) {
      score += 1;
      reasons.push("Fits your preferred runtime");
    }
  }

  if (answers.releasePeriod && RELEASE_RANGES[answers.releasePeriod]) {
    const { from, to } = RELEASE_RANGES[answers.releasePeriod];
    if (movie.releaseDate >= from && movie.releaseDate <= to) {
      score += 1;
      reasons.push("From your preferred era");
    }
  }

  // Rating acts as a light tiebreaker/quality signal
  score += (movie.rating || 0) / 10;

  return { score, reasons };
}

export async function generateRecommendations(answers) {
  const moodGenres = MOOD_GENRE_MAP[answers.mood] || [];
  const chosenGenreIds = (answers.genres || []).map((g) => GENRE_NAME_TO_ID[g.toLowerCase()]).filter(Boolean);
  const combinedGenres = [...new Set([...moodGenres, ...chosenGenreIds])];

  const runtimeRange = RUNTIME_RANGES[answers.runtime] || {};
  const releaseRange = RELEASE_RANGES[answers.releasePeriod] || {};

  const candidates = await tmdbService.discover({
    genreIds: combinedGenres,
    language: answers.language,
    minRuntime: runtimeRange.min,
    maxRuntime: runtimeRange.max,
    releaseFrom: releaseRange.from,
    releaseTo: releaseRange.to,
  });

  // If strict filtering returns too few results, widen the pool
  let pool = candidates;
  if (pool.length < 6) {
    const wider = await tmdbService.discover({ genreIds: combinedGenres });
    const seen = new Set(pool.map((m) => m.id));
    pool = [...pool, ...wider.filter((m) => !seen.has(m.id))];
  }

  const ranked = pool
    .map((movie) => {
      const { score, reasons } = scoreMovie(movie, answers);
      return { ...movie, matchScore: Math.round(Math.min(99, score * 9 + 55)), matchReasons: reasons };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  return ranked.slice(0, 12);
}
