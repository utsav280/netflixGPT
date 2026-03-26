import { useEffect, useState } from "react";
import { API_OPTIONS } from "../utils/constants";

// Cache to avoid re-fetching the same trailer
const trailerCache = {};

const useTrailerOnHover = (movieId, isHovered) => {
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isHovered || !movieId) {
      return;
    }

    // Return from cache immediately
    if (trailerCache[movieId]) {
      setTrailerKey(trailerCache[movieId]);
      return;
    }

    // Delay before fetching (Netflix-like 1.2s pause)
    const delay = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
          API_OPTIONS
        );
        const data = await res.json();
        const videos = data.results || [];
        const trailer =
          videos.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
          videos.find((v) => v.site === "YouTube");
        const key = trailer?.key || null;
        if (key) trailerCache[movieId] = key;
        setTrailerKey(key);
      } catch {
        setTrailerKey(null);
      } finally {
        setLoading(false);
      }
    }, 1200);

    return () => clearTimeout(delay);
  }, [isHovered, movieId]);

  // Reset when not hovered
  useEffect(() => {
    if (!isHovered) {
      setTrailerKey(null);
      setLoading(false);
    }
  }, [isHovered]);

  return { trailerKey, loading };
};

export default useTrailerOnHover;
