import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { IMG_CDN, IMG_CDN_W342 } from "../utils/constants";
import { setSelectedMovie } from "../utils/movieSlice";
import { FaPlay, FaStar } from "react-icons/fa";
import useTrailerOnHover from "../hooks/useTrailerOnHover";

const MovieCard = ({ posterPath, title, rating, movie }) => {
  const dispatch = useDispatch();
  const [hovered, setHovered] = useState(false);
  const { trailerKey } = useTrailerOnHover(movie?.id, hovered);

  if (!posterPath) return null;

  const handleClick = () => {
    if (movie) dispatch(setSelectedMovie(movie));
  };

  return (
    <div
      className="relative min-w-[124px] md:min-w-[150px] cursor-pointer rounded-md overflow-hidden group hover:scale-[1.03] transition-transform duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Poster Image — hides when trailer plays */}
      <img
        className={`w-[124px] md:w-[150px] aspect-[2/3] bg-[#141414] rounded-md object-cover transition-opacity duration-300 ${
          trailerKey ? "opacity-0" : "opacity-100"
        }`}
        src={IMG_CDN_W342 + posterPath}
        alt={title || "Movie Poster"}
        loading="lazy"
      />

      {/* Trailer iframe overlay */}
      {trailerKey && (
        <div className="absolute inset-0 rounded-md overflow-hidden bg-black z-10">
          <iframe
            className="w-full h-full scale-[1.3] pointer-events-none"
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${trailerKey}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media"
          />
          {/* Subtle gradient + title over trailer */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-1.5 left-2 right-2">
            <p className="text-white text-[10px] md:text-xs font-semibold line-clamp-1">{title}</p>
          </div>
        </div>
      )}

      {/* Default hover overlay (when no trailer yet) */}
      {!trailerKey && (
        <div
          className={`absolute inset-0 rounded-md flex flex-col justify-end p-2 transition-opacity duration-300 ${
            hovered
              ? "opacity-100 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
              : "opacity-0"
          }`}
        >
          <div className="flex items-center justify-center mb-1">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/50 flex items-center justify-center hover:bg-white/40 transition-colors duration-200">
              <FaPlay className="text-white text-[10px] ml-0.5" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(MovieCard);
