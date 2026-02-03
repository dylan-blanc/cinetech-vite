import { createContext, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import useFetchAPI from "../hooks/useFetchAPI";

// Créer le contexte avec valeurs par défaut
const GenresContext = createContext({
  genres: [],
  loading: false,
  error: null,
  contentType: "movie",
});

// Provider qui wrap l'application
export function GenresProvider({ children }) {
  const [searchParams] = useSearchParams();
  const contentType = searchParams.get("type") || "movie";

  // UN SEUL appel API pour les genres
  const genreEndpoint =
    contentType === "tv"
      ? "http://localhost:3500/api/tmdb/genre/tv/list"
      : "http://localhost:3500/api/tmdb/genre/movie/list";

  const { data, loading, error } = useFetchAPI({ url: genreEndpoint });

  const value = {
    genres: data?.genres || [],
    loading,
    error,
    contentType,
  };

  return (
    <GenresContext.Provider value={value}>{children}</GenresContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte
export function useGenres() {
  const context = useContext(GenresContext);
  if (context === undefined) {
    throw new Error("useGenres must be used within a GenresProvider");
  }
  return context;
}

export default GenresContext;
