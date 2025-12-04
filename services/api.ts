export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  ACCESS_TOKEN: process.env.EXPO_PUBLIC_MOVIE_ACCESS_TOKEN,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_ACCESS_TOKEN}`,
  }
}

export const fetchMovies = async ({ query }: { query: string }): Promise<Movie[]> => {
  try {
    const endpoint = query
      ? `/search/movie?query=${encodeURIComponent(query)}`
      : '/discover/movie?sort_by=popularity.desc';

    const response = await fetch(`${TMDB_CONFIG.BASE_URL}${endpoint}`, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch movies", { cause: response.statusText });
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    throw error
  }
}

export const fetchMovieDetails = async ({ id }: { id: string }): Promise<MovieDetails> => {
  try {
    const response = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${id}`, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch movie details", { cause: response.statusText });
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error
  }
}