import { useState, useEffect } from "react";
import { API_OPTIONS } from "../utils/constants";

const usePersonDetails = (id) => {
  const [personDetails, setPersonDetails] = useState(null);
  const [movieCredits, setMovieCredits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPersonData = async () => {
      setLoading(true);
      try {
        // Fetch bio and info
        const detailsRes = await fetch(
          `https://api.themoviedb.org/3/person/${id}?language=en-US`,
          API_OPTIONS
        );
        const detailsData = await detailsRes.json();
        setPersonDetails(detailsData);

        // Fetch their movie credits
        const creditsRes = await fetch(
          `https://api.themoviedb.org/3/person/${id}/movie_credits?language=en-US`,
          API_OPTIONS
        );
        const creditsData = await creditsRes.json();
        
        // Sort movies by popularity and ensure they have posters
        const sortedCredits = (creditsData.cast || [])
          .filter((movie) => movie.poster_path)
          .sort((a, b) => b.popularity - a.popularity);
          
        setMovieCredits(sortedCredits);
      } catch (err) {
        console.error("Failed to fetch person data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonData();
  }, [id]);

  return { personDetails, movieCredits, loading };
};

export default usePersonDetails;
