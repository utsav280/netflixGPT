import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedGenre, clearGenre } from "../utils/genreSlice";
import useGenres from "../hooks/useGenres";
import lang from "../utils/langConstants";

const GenreFilter = () => {
  useGenres();
  const dispatch = useDispatch();
  const genreList = useSelector((store) => store.genre.genreList);
  const selectedGenreId = useSelector((store) => store.genre.selectedGenreId);
  const langKey = useSelector((store) => store.config.lang);

  if (!genreList.length) return null;

  return (
    <div className="relative group cursor-pointer drop-shadow-lg z-[200]">
      <div className="flex items-center gap-1 md:gap-2 px-2 py-1.5 md:px-3 md:py-2 bg-black/60 border border-white/20 rounded-lg backdrop-blur-md hover:bg-black/80 hover:border-white/40 transition-all duration-200">
        <span className="text-white text-xs md:text-sm font-semibold tracking-wide truncate max-w-[80px] md:max-w-none">
          {selectedGenreId 
            ? (lang[langKey]?.genres?.[genreList.find(g => g.id === selectedGenreId)?.name] || genreList.find(g => g.id === selectedGenreId)?.name)
            : "Genres"}
        </span>
        <span className="text-white text-[10px] md:text-xs translate-y-[1px]">▼</span>
      </div>

      {/* Dropdown Menu (Hidden until Hover) */}
      <div className="absolute right-0 md:right-auto md:left-0 top-[120%] w-[240px] md:w-[320px] bg-[#141414]/95 border border-white/10 shadow-2xl backdrop-blur-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 grid grid-cols-2 gap-y-2 gap-x-2 p-4 rounded-xl z-[200]">
        <button
          onClick={() => dispatch(clearGenre())}
          className={`text-left text-xs md:text-sm transition-colors duration-200 hover:text-white ${
            selectedGenreId === null ? "text-white font-bold" : "text-gray-400"
          }`}
        >
          {lang[langKey]?.all || "All"}
        </button>
        
        {genreList.map((genre) => (
          <button
            key={genre.id}
            onClick={() => dispatch(setSelectedGenre(genre.id))}
            className={`text-left text-xs md:text-sm transition-colors duration-200 hover:text-white truncate pr-2 ${
              selectedGenreId === genre.id ? "text-white font-bold" : "text-gray-400"
            }`}
          >
            {lang[langKey]?.genres?.[genre.name] || genre.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default React.memo(GenreFilter);
