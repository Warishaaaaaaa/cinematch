import api from "./api";

export const movieService = {
  search: (q, page = 1) => api.get("/movies/search", { params: { q, page } }).then((r) => r.data),
  getById: (id) => api.get(`/movies/${id}`).then((r) => r.data),
  getGenres: () => api.get("/movies/meta/genres").then((r) => r.data),
};

export const recommendService = {
  getRecommendations: (answers) => api.post("/recommend", answers).then((r) => r.data),
};

export const favoriteService = {
  list: () => api.get("/favorites").then((r) => r.data),
  add: (movie) => api.post("/favorites", movie).then((r) => r.data),
  remove: (movieId) => api.delete(`/favorites/${movieId}`).then((r) => r.data),
};

export const historyService = {
  list: () => api.get("/history").then((r) => r.data),
  add: (movie) => api.post("/history", movie).then((r) => r.data),
  clear: () => api.delete("/history").then((r) => r.data),
};
