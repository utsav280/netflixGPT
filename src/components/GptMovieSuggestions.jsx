import React from "react";
import { useSelector } from "react-redux";
import MovieList from "./MovieList";

const GptMovieSuggestions = () => {
  const gpt = useSelector((store) => store.gpt);
  const { movieNames, movieResults } = gpt;

  if (!movieNames || !movieResults) return null;

  return (
    <div className="relative z-20 mt-6">
      {/* Glassmorphic section card */}
      <div className="mx-4 md:mx-10 rounded-2xl glass border border-white/10 overflow-hidden shadow-2xl">
        {/* Section header */}
        <div className="px-6 md:px-8 pt-6 pb-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-red-500 to-orange-500" />
            <h2 className="text-white text-lg font-bold tracking-wide">
              AI Recommendations
            </h2>
          </div>
          <p className="text-gray-500 text-xs ml-3">
            Based on your search — {movieNames.length} categories found
          </p>
        </div>

        {/* Movie rows */}
        <div className="pb-4">
          {movieNames.map((movieName, index) => (
            <MovieList
              key={movieName}
              title={movieName}
              movies={movieResults[index]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GptMovieSuggestions;
