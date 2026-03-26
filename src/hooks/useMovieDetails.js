import { useState, useEffect } from "react";
import { API_OPTIONS, IMG_CDN_W185 } from "../utils/constants";

const useMovieDetails = (movieId) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!movieId) return;
    setLoading(true);
    setDetails(null);

    const fetchDetails = async () => {
      try {
        const [detailsRes, videosRes, creditsRes] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/movie/${movieId}`,
            API_OPTIONS
          ),
          fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
            API_OPTIONS
          ),
          fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/credits`,
            API_OPTIONS
          ),
        ]);

        const [detailsJson, videosJson, creditsJson] = await Promise.all([
          detailsRes.json(),
          videosRes.json(),
          creditsRes.json(),
        ]);

        // Pick trailer
        const videos = videosJson.results || [];
        const trailer =
          videos.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
          videos.find((v) => v.site === "YouTube") ||
          null;

        // Top 8 cast
        const cast = (creditsJson.cast || []).slice(0, 8).map((member) => ({
          id: member.id,
          name: member.name,
          character: member.character,
          ...member,
          avatar: member.profile_path
            ? IMG_CDN_W185 + member.profile_path
            : "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
        }));

        setDetails({ ...detailsJson, trailer, cast });
      } catch (err) {
        console.error("useMovieDetails error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [movieId]);

  return { details, loading };
};

export default useMovieDetails;
