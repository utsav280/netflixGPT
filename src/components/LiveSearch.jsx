import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { API_OPTIONS } from "../utils/constants";
import { setSelectedMovie } from "../utils/movieSlice";

const LiveSearch = ({ lang }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // Debounce the live search
    const timer = setTimeout(() => {
      if (query.trim().length > 1) {
        fetchDynamicSearch(query);
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchDynamicSearch = async (searchQuery) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
          searchQuery
        )}&include_adult=false&page=1`,
        API_OPTIONS
      );
      const json = await res.json();
      setResults(json.results?.slice(0, 6) || []);
      setShowDropdown(true);
    } catch (err) {
      console.error("Live search failed", err);
    }
  };

  const handleMovieSelect = (movie) => {
    dispatch(setSelectedMovie(movie));
    setShowDropdown(false);
    setQuery("");
  };

  return (
    <div className="relative group" ref={dropdownRef}>
      {/* Search Input */}
      <div className="flex items-center gap-2 bg-black/40 border border-white/20 rounded-full px-3 py-1.5 focus-within:bg-black/80 focus-within:border-white/50 transition-all duration-300 w-40 md:w-60">
        <FaSearch className="text-gray-400 text-sm shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          placeholder={lang?.search || "Search"}
          className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-gray-400"
        />
      </div>

      {/* Autocomplete Dropdown */}
      {showDropdown && results.length > 0 && (
        <div className="absolute top-12 right-0 w-72 bg-black/95 border border-white/10 rounded-xl shadow-2xl shadow-black/80 flex flex-col overflow-hidden backdrop-blur-md z-50 animate-fade-in origin-top-right">
          <div className="px-4 py-2 border-b border-white/10">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
              {lang?.search || "Search"} Results
            </p>
          </div>
          <div className="max-h-80 overflow-y-auto no-scrollbar">
            {results.map((movie) => (
              <button
                key={movie.id}
                onClick={() => handleMovieSelect(movie)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 border-b border-white/5 last:border-0 transition-colors text-left group"
              >
                {/* Micro Poster */}
                <div className="w-10 h-14 bg-gray-900 rounded-sm shrink-0 overflow-hidden relative">
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt="poster"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500 text-[10px]">
                      N/A
                    </div>
                  )}
                </div>
                {/* Movie Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate text-shadow-sm group-hover:text-red-400 transition-colors">
                    {movie.title}
                  </p>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                    {movie.release_date?.split("-")[0] || "N/A"}
                    <span className="w-1 h-1 bg-gray-600 rounded-full" />
                    <span className="text-yellow-500">★</span>
                    {movie.vote_average?.toFixed(1)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveSearch;
