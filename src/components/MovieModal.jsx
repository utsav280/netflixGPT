import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearSelectedMovie } from "../utils/movieSlice";
import { addToWatchlist, removeFromWatchlist } from "../utils/watchlistSlice";
import { showToast } from "../utils/toastSlice";
import useMovieDetails from "../hooks/useMovieDetails";
import lang from "../utils/langConstants"; // New import
import {
  FaTimes,
  FaPlay,
  FaStar,
  FaClock,
  FaPlus,
  FaCheck,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";


const IMG_BACKDROP = "https://image.tmdb.org/t/p/w1280";

const SkeletonBlock = ({ className }) => (
  <div className={`rounded-lg shimmer-bg ${className}`} />
);

const MovieModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedMovie = useSelector((store) => store.movies.selectedMovie);
  const watchlistItems = useSelector((store) => store.watchlist.items);
  const langKey = useSelector((store) => store.config.lang); // New useSelector for langKey
  const { details, loading } = useMovieDetails(selectedMovie?.id);
  const [trailerMuted, setTrailerMuted] = useState(true);

  const isInWatchlist = watchlistItems.some((m) => m.id === selectedMovie?.id);

  const close = useCallback(() => {
    dispatch(clearSelectedMovie());
    setTrailerMuted(true);
  }, [dispatch]);

  // Close on Esc key
  useEffect(() => {
    if (!selectedMovie) return;
    const handleKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [selectedMovie, close]);

  if (!selectedMovie) return null;

  const trailer = details?.trailer;
  const genres = details?.genres || [];
  const cast = details?.cast || [];
  const runtime = details
    ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`
    : null;
  const rating = details?.vote_average?.toFixed(1);
  const backdropUrl = details?.backdrop_path
    ? IMG_BACKDROP + details.backdrop_path
    : selectedMovie?.backdrop_path
    ? IMG_BACKDROP + selectedMovie.backdrop_path
    : null;

  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(selectedMovie.id));
      dispatch(showToast({ message: `Removed "${selectedMovie.title || selectedMovie.original_title}" from My List`, type: "info" }));
    } else {
      dispatch(addToWatchlist(selectedMovie));
      dispatch(showToast({ message: lang[langKey]?.addedToWatchlist || `Added "${selectedMovie.title || selectedMovie.original_title}" to My List`, type: "success" }));
    }
  };

  return (
    /* Backdrop overlay */
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      {/* Dark semi-transparent background */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={close}
      />

      {/* Modal Card */}
      <div
        className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#141414] shadow-2xl fade-up no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── HERO SECTION ── */}
        <div className="relative w-full aspect-video bg-black rounded-t-2xl overflow-hidden">
          {trailer ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=${
                trailerMuted ? "1" : "0"
              }&controls=0&modestbranding=1&rel=0`}
              title={trailer.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
              allowFullScreen
            />
          ) : backdropUrl ? (
            <img
              src={backdropUrl}
              alt={selectedMovie.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 border-b border-white/10">
              <p className="text-gray-400 font-medium tracking-wide">
                {lang[langKey]?.trailerUnavailable || "Trailer Unavailable"}
              </p>
            </div>
          )}

          {/* Gradient at bottom of hero */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#141414] to-transparent pointer-events-none" />

          {/* Close button */}
          <button
            onClick={close}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-red-600 hover:border-transparent transition-all duration-200 z-10"
          >
            <FaTimes className="text-sm" />
          </button>

          {/* Mute toggle */}
          {trailer && (
            <button
              onClick={() => setTrailerMuted(!trailerMuted)}
              className="absolute bottom-16 right-4 w-9 h-9 rounded-full bg-black/50 border border-white/30 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
            >
              {trailerMuted ? (
                <FaVolumeMute className="text-xs" />
              ) : (
                <FaVolumeUp className="text-xs" />
              )}
            </button>
          )}

          {/* Hero action buttons */}
          <div className="absolute bottom-5 left-5 flex gap-3 items-center">
            <button className="flex items-center gap-2 bg-white text-black font-bold px-5 py-2 rounded-lg text-sm hover:bg-gray-200 transition-all duration-200">
              <FaPlay className="text-xs" />
              {lang[langKey]?.play || "Play"}
            </button>
            <button
              onClick={handleWatchlistToggle}
              className={`flex items-center gap-2 font-semibold px-5 py-2 rounded-lg text-sm border transition-all duration-200 ${
                isInWatchlist
                  ? "bg-green-600/20 border-green-500/60 text-green-400 hover:bg-green-600/30"
                  : "bg-white/10 border-white/40 text-white hover:bg-white/20"
              }`}
              title={isInWatchlist ? "Remove from Watchlist" : lang[langKey]?.addToWatchlist || "Add to Watchlist"}
            >
              {isInWatchlist ? (
                <>
                  <FaCheck className="text-xs" /> {lang[langKey]?.inWatchlist || "In My List"}
                </>
              ) : (
                <>
                  <FaPlus className="text-xs" /> {lang[langKey]?.myList || "My List"}
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── DETAILS SECTION ── */}
        <div className="px-6 pb-8 pt-2">
          {loading ? (
            <div className="space-y-3 mt-4">
              <SkeletonBlock className="h-7 w-2/3" />
              <SkeletonBlock className="h-4 w-1/3" />
              <SkeletonBlock className="h-20 w-full" />
            </div>
          ) : details ? (
            <>
              {/* Title + meta row */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <h2 className="text-white text-2xl font-black leading-tight">
                    {details.title}
                  </h2>
                  {details.tagline && (
                    <p className="text-gray-500 text-sm italic mt-0.5">
                      {details.tagline}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm shrink-0">
                  {rating && (
                    <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                      <FaStar className="text-xs" />
                      {rating}
                    </span>
                  )}
                  {details.runtime > 0 && (
                    <span className="flex items-center gap-1 text-gray-400">
                      <FaClock className="text-xs" />
                      {runtime}
                    </span>
                  )}
                  {details.release_date && (
                    <span className="text-gray-400">
                      {details.release_date.slice(0, 4)}
                    </span>
                  )}
                </div>
              </div>

              {/* Genre pills */}
              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {genres.map((g) => (
                    <span
                      key={g.id}
                      className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 border border-white/15 text-gray-300"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview */}
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                {details.overview}
              </p>

              {/* Cast */}
              {cast.length > 0 && (
                <div>
                  <h3 className="text-white text-base font-bold mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 rounded-full bg-gradient-to-b from-red-500 to-orange-500" />
                    Cast
                  </h3>
                  <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                    {cast.map((member) => (
                      <div
                        key={member.id}
                        onClick={() => {
                          close();
                          navigate("/person/" + member.id);
                        }}
                        className="flex-shrink-0 w-16 text-center cursor-pointer group hover:scale-105 transition-transform"
                      >
                        {member.profilePath ? (
                          <img
                            src={member.profilePath}
                            alt={member.name}
                            className="w-14 h-14 rounded-full object-cover mx-auto border-2 border-transparent group-hover:border-red-500 transition-colors"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-white/10 mx-auto flex items-center justify-center text-white/40 text-lg font-bold border-2 border-transparent group-hover:border-red-500 transition-colors">
                            {member.name[0]}
                          </div>
                        )}
                        <p className="text-white text-xs mt-1.5 font-medium leading-tight line-clamp-2 group-hover:text-red-400">
                          {member.name}
                        </p>
                        <p className="text-gray-500 text-[10px] leading-tight line-clamp-1">
                          {member.character}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
