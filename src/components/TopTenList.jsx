import React, { useRef, useState, useEffect, useCallback } from "react";
import TopTenCard from "./TopTenCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const TopTenList = ({ title, movies }) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Grab exactly the top 10 movies
  const topTen = (movies || []).slice(0, 10);

  const checkArrows = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 2);
  }, []);

  useEffect(() => {
    checkArrows();
    window.addEventListener("resize", checkArrows);
    return () => window.removeEventListener("resize", checkArrows);
  }, [checkArrows, movies]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="px-6 md:px-12 mt-6 relative group/row">
      <h1 className="text-lg md:text-xl font-medium text-[#e5e5e5] tracking-tight hover:text-white cursor-pointer transition-colors duration-200 py-2 md:py-4 flex items-center gap-3">
        {title}
      </h1>

      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-40 w-9 h-9 rounded-full bg-black/80 border border-white/20 text-white items-center justify-center hover:bg-red-600 hover:border-transparent transition-all duration-200 opacity-0 group-hover/row:opacity-100 shadow-xl"
          aria-label="Scroll left"
        >
          <FaChevronLeft className="text-xs" />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        onScroll={checkArrows}
        className="flex overflow-x-auto no-scrollbar scroll-smooth"
        style={{ paddingBottom: "0.5rem", paddingTop: "0.25rem" }}
      >
        <div className="flex gap-1.5 md:gap-2 pl-0">
          {topTen.map((movie, index) => (
            <TopTenCard key={movie.id} rank={index + 1} posterPath={movie.poster_path} movie={movie} />
          ))}
        </div>
      </div>

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-40 w-9 h-9 rounded-full bg-black/80 border border-white/20 text-white items-center justify-center hover:bg-red-600 hover:border-transparent transition-all duration-200 opacity-0 group-hover/row:opacity-100 shadow-xl"
          aria-label="Scroll right"
        >
          <FaChevronRight className="text-xs" />
        </button>
      )}
    </div>
  );
};

export default TopTenList;
