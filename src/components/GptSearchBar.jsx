import React, { useRef, useState } from "react";
import { FaSearch, FaSpinner, FaMagic } from "react-icons/fa";
import lang from "../utils/langConstants";
import { useSelector, useDispatch } from "react-redux";
import { genAI } from "../utils/geminiAi";
import { API_OPTIONS } from "../utils/constants";
import { addGptMovieResults } from "../utils/gptSlice";
import MovieList from "./MovieList";

const EXAMPLE_QUERIES = [
  "Sci-fi like Interstellar",
  "Feel-good rom-coms",
  "Mind-bending thrillers",
  "Best dramas 2023",
  "Action like John Wick",
];

const searchMovieTMDB = async (movie) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(movie)}&include_adult=false&page=1`,
    API_OPTIONS
  );
  const json = await res.json();
  return json?.results || [];
};

const GptSearchBar = () => {
  const searchText = useRef(null);
  const langKey = useSelector((store) => store.config.lang);
  const dispatch = useDispatch();
  const movieNames = useSelector((store) => store.gpt.movieNames);
  const movieResults = useSelector((store) => store.gpt.movieResults);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (queryOverride) => {
    const query = queryOverride || searchText.current?.value?.trim();
    if (!query || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const geminiQuery = `Act as a movie recommendation system. Suggest 5 movies for: "${query}". Return ONLY movie names, comma-separated.`;
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(geminiQuery);
      const geminiResult = result?.response?.text();

      if (!geminiResult) throw new Error("No recommendations found.");

      const geminiMovies = geminiResult.split(",").map((m) => m.trim()).filter(Boolean);
      const tmdbResults = await Promise.all(geminiMovies.map(searchMovieTMDB));

      dispatch(addGptMovieResults({ movieNames: geminiMovies, movieResults: tmdbResults }));
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const hasResults = movieNames && movieResults;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero search section */}
      <div className={`w-full transition-all duration-500 ${hasResults ? "pt-28 pb-6" : "flex-1 flex flex-col items-center justify-center pb-10"}`}>

        {!hasResults && (
          <div className="text-center mb-8 fade-up">
            <div className="inline-flex items-center gap-2 bg-red-500/15 border border-red-500/30 rounded-full px-4 py-1.5 mb-4 backdrop-blur-sm">
              <FaMagic className="text-red-400 text-xs" />
              <span className="text-red-300 text-xs font-semibold tracking-widest uppercase">AI Powered</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-2 leading-tight">
              {lang[langKey]?.whatToWatch?.split("?")[0] || "What do you want to watch"}?
            </h2>
            <p className="text-gray-400 text-sm">{lang[langKey]?.describeVibe || "Describe a vibe, genre, or movie — AI finds it"}</p>
          </div>
        )}

        <div className={`w-full px-4 ${hasResults ? "max-w-3xl mx-auto" : "max-w-2xl mx-auto"}`}>
          <div className="relative rounded-2xl overflow-hidden glass border border-white/10 shadow-2xl shadow-black/50">
            <div className="flex items-center">
              {isLoading
                ? <FaSpinner className="absolute left-5 text-red-500 text-sm animate-spin" />
                : <FaSearch className="absolute left-5 text-gray-500 text-sm" />
              }
              <input
                type="text"
                ref={searchText}
                className="flex-1 px-4 py-3 md:py-4 bg-transparent outline-none text-white placeholder-gray-400 text-sm md:text-base w-full focus:bg-white/5 transition-colors"
                placeholder={lang[langKey]?.placeHolder || "Search for movies..."}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <button
                className="px-6 md:px-10 py-3 md:py-4 bg-red-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-red-700 transition-colors shrink-0"
                onClick={() => handleSearch()}
                disabled={isLoading}
              >
                {isLoading ? "Searching…" : lang[langKey]?.search || "Search"}
              </button>
            </div>
          </div>

          {!hasResults && !isLoading && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {EXAMPLE_QUERIES.map((q) => (
                <button key={q} onClick={() => handleSearch(q)}
                  className="text-xs text-gray-400 border border-white/15 rounded-full px-3 py-1.5 hover:border-red-500/50 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200">
                  {q}
                </button>
              ))}
            </div>
          )}

          {error && (
            <div className="mt-3 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Full-width movie results */}
      {hasResults && (
        <div className="w-full pb-16 fade-up">
          {movieNames.map((name, i) => (
            <MovieList key={`${name}-${i}`} title={name} movies={movieResults[i]} />
          ))}
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="w-full px-6 md:px-10 pb-16 space-y-10 mt-6 md:mt-10 fade-up">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 rounded-full bg-red-600/50" />
                <div className="h-6 w-32 md:w-48 rounded shimmer-bg" />
              </div>
              <div className="flex gap-3 md:gap-4 overflow-hidden mask-fade-edges">
                {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                  <div key={j} className="shrink-0 w-[160px] md:w-[185px] h-[240px] md:h-[277px] rounded-lg shimmer-bg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GptSearchBar;
