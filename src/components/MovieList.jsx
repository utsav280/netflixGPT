import React, { useRef, useState, useEffect, useCallback } from "react";
import MovieCard from "./MovieCard";
import Shimmer from "./Shimmer";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { API_OPTIONS } from "../utils/constants";
import { appendMovies } from "../utils/movieSlice";

const SCROLL_AMOUNT = 600;

const MovieList = ({ title, movies, categoryKey, endpoint }) => {
  const scrollRef = useRef(null);
  const observer = useRef(null);
  const dispatch = useDispatch();
  
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  const selectedGenreId = useSelector((store) => store.genre.selectedGenreId);

  // Infinite Scroll Fetch
  const loadMore = useCallback(async () => {
    // If we're currently filtering by genre, we don't paginate (TMDB doesn't natively support paginating a pre-filtered list this simply without discovery endpoints)
    if (!endpoint || !categoryKey || loadingMore || selectedGenreId !== null) return;
    
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`https://api.themoviedb.org/3${endpoint}?page=${nextPage}`, API_OPTIONS);
      const json = await res.json();
      if (json.results && json.results.length > 0) {
        dispatch(appendMovies({ category: categoryKey, movies: json.results }));
        setPage(nextPage);
      }
    } catch (err) {
      console.error("Failed to load more movies", err);
    } finally {
      setLoadingMore(false);
    }
  }, [endpoint, categoryKey, loadingMore, page, selectedGenreId, dispatch]);

  // Bulletproof infinite scroll using useCallback Ref
  const lastElementRef = useCallback(
    (node) => {
      // Don't trigger if already loading or filtering
      if (loadingMore || selectedGenreId !== null) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !loadingMore) {
            loadMore();
          }
        },
        { 
          root: scrollRef.current, 
          rootMargin: "0px 400px 0px 0px", // Pre-fetch before user hits the end
          threshold: 0 
        }
      );
      if (node) observer.current.observe(node);
    },
    [loadingMore, selectedGenreId, loadMore]
  );

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
      behavior: "smooth",
    });
  };

  const checkArrows = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    
    // Hide left arrow if at the very start
    setShowLeftArrow(scrollLeft > 0);
    
    // Hide right arrow if at the very end (with a tiny 2px rounding buffer)
    setShowRightArrow(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 2);
  }, []);

  // Re-evaluate arrows when movies dynamically change or window resizes
  useEffect(() => {
    checkArrows();
    window.addEventListener("resize", checkArrows);
    return () => window.removeEventListener("resize", checkArrows);
  }, [checkArrows, movies]);

  if (!movies || movies.length === 0) {
    return <Shimmer title={title} />;
  }

  // Apply genre filter
  const filtered = selectedGenreId
    ? movies.filter(
        (m) =>
          Array.isArray(m.genre_ids) && m.genre_ids.includes(selectedGenreId)
      )
    : movies;

  if (filtered.length === 0) return null; // Hide row entirely if no matches

  return (
    <div className="px-6 md:px-10 py-2.5 md:py-4.5 group/row flex flex-col justify-center">
      {/* Sleek Row Title */}
      <div className="flex items-center gap-3 mb-2 md:mb-3">
        <h2 className="text-lg md:text-xl font-medium text-[#e5e5e5] tracking-tight hover:text-white cursor-pointer transition-colors duration-200">
          {title}
        </h2>
      </div>

      {/* Scrollable row with arrows */}
      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-9 h-9 rounded-full bg-black/80 border border-white/20 text-white flex items-center justify-center hover:bg-red-600 hover:border-transparent transition-all duration-200 opacity-0 group-hover/row:opacity-100 shadow-xl"
            aria-label="Scroll left"
          >
            <FaChevronLeft className="text-xs" />
          </button>
        )}

        {/* Movie cards */}
        <div
          ref={scrollRef}
          onScroll={checkArrows}
          className="flex gap-1.5 md:gap-2 overflow-x-scroll no-scrollbar pb-2"
        >
          {filtered.map((movie) => (
            <MovieCard
              key={movie.id}
              posterPath={movie.poster_path}
              title={movie.original_title || movie.title}
              rating={movie.vote_average}
              movie={movie}
            />
          ))}
          
          {/* Infinite Scroll Trigger element */}
          {endpoint && selectedGenreId === null && (
            <div 
              ref={lastElementRef} 
              className="w-16 self-stretch shrink-0 flex items-center justify-center bg-gradient-to-l from-black/20 to-transparent"
            >
              {loadingMore && (
                <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          )}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-9 h-9 rounded-full bg-black/80 border border-white/20 text-white flex items-center justify-center hover:bg-red-600 hover:border-transparent transition-all duration-200 opacity-0 group-hover/row:opacity-100 shadow-xl"
            aria-label="Scroll right"
          >
            <FaChevronRight className="text-xs" />
          </button>
        )}

        {/* Fade masks */}
        <div className="pointer-events-none absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-[#141414] to-transparent" />
        <div className="pointer-events-none absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-[#141414] to-transparent" />
      </div>
    </div>
  );
};

export default MovieList;
