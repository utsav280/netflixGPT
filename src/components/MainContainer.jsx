import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import VideoTitle from "./VideoTitle";
import VideoBackground from "./VideoBackground";

const CAROUSEL_INTERVAL = 8000; // 8 seconds per movie

const MainContainer = () => {
  const movies = useSelector((store) => store.movies?.nowPlayingMovies);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [transitioning, setTransitioning] = useState(false);

  const goToNext = useCallback(() => {
    if (!movies) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(movies.length, 6));
      setTransitioning(false);
    }, 400);
  }, [movies]);

  const goTo = (idx) => {
    if (idx === currentIndex) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(idx);
      setTransitioning(false);
    }, 400);
  };

  // Auto-advance carousel
  useEffect(() => {
    if (!movies) return;
    const interval = setInterval(goToNext, CAROUSEL_INTERVAL);
    return () => clearInterval(interval);
  }, [movies, goToNext]);

  // Loading skeleton
  if (!movies) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-black">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-3/4 h-12 rounded-md shimmer-bg mb-4"></div>
          <div className="w-1/2 h-8 rounded-md shimmer-bg mb-4"></div>
          <div className="w-full h-64 rounded-md shimmer-bg"></div>
        </div>
      </div>
    );
  }

  const mainMovie = movies[currentIndex];
  const { original_title, overview, id } = mainMovie;
  const totalDots = Math.min(movies.length, 6);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video / Background */}
      <div
        className={`transition-opacity duration-400 ${
          transitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <VideoBackground movieId={id} muted={muted} />
      </div>

      {/* Title / Overlay */}
      <div
        className={`transition-opacity duration-400 ${
          transitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <VideoTitle
          title={original_title}
          overview={overview}
          muted={muted}
          onToggleMute={() => setMuted(!muted)}
        />
      </div>

      {/* Carousel Indicator Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {Array.from({ length: totalDots }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === currentIndex
                ? "w-6 h-2 bg-white"
                : "w-2 h-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/10 z-20">
        <div
          key={currentIndex}
          className="h-full bg-red-500 origin-left"
          style={{
            animation: `progressBar ${CAROUSEL_INTERVAL}ms linear`,
          }}
        />
      </div>

      <style>{`
        @keyframes progressBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default MainContainer;
