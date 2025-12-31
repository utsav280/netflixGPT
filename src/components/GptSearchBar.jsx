import React, { useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import lang from "../utils/langConstants";
import { useSelector, useDispatch } from "react-redux";
import { genAI } from "../utils/geminiAi";
import { API_OPTIONS } from "../utils/constants";
import { addGptMovieResults } from "../utils/gptSlice";

const GptSearchBar = () => {
  const searchText = useRef(null);
  const langKey = useSelector((store) => store.config.lang);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search movie from TMDB
  const searchMovieTMDB = async (movie) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${movie}&include_adult=false&page=1`,
      API_OPTIONS
    );
    const json = await response.json();
    return json?.results || [];
  };

  const handleGptSearchClick = async (e) => {
    e.preventDefault();
    if (!searchText.current.value) return;

    setIsLoading(true);
    setError(null);

    try {
      const geminiQuery =
        "Act as a movie recommendation system and suggest 5 movies for the query: " +
        searchText.current.value +
        ". Return only movie names, comma separated.";

      // ✅ CORRECT GEMINI MODEL
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

      const result = await model.generateContent(geminiQuery);
      const geminiResult = result?.response?.text();

      if (!geminiResult) {
        setError("No recommendations found.");
        return;
      }

      const geminiMovies = geminiResult.split(",").map((m) => m.trim());

      const tmdbPromises = geminiMovies.map((movie) => searchMovieTMDB(movie));

      const tmdbSuggestions = await Promise.all(tmdbPromises);

      dispatch(
        addGptMovieResults({
          movieNames: geminiMovies,
          movieResults: tmdbSuggestions,
        })
      );
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center px-4 py-4 mt-32 z-20">
      {/* 🔹 SEARCH BAR */}
      <div className="relative w-full max-w-2xl h-14">
        <input
          type="text"
          ref={searchText}
          className="w-full h-full py-4 pl-12 pr-32 text-white text-sm bg-black border border-red-600 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600 placeholder-gray-400"
          placeholder={lang[langKey].placeHolder}
        />

        {/* ICON */}
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-red-600" />

        {/* BUTTON */}
        <button
          onClick={handleGptSearchClick}
          disabled={isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-28 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-800 transition disabled:opacity-60"
        >
          {isLoading ? "Searching..." : lang[langKey].search}
        </button>
      </div>

      {/* 🔹 LOADING */}
      {isLoading && (
        <p className="mt-6 text-2xl text-white animate-pulse">
          Finding the perfect movies for you 🍿
        </p>
      )}

      {/* 🔹 ERROR */}
      {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default GptSearchBar;
