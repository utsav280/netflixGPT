import React from "react";
import MovieList from "./MovieList";
import TopTenList from "./TopTenList";
import { useSelector } from "react-redux";
import lang from "../utils/langConstants";

const SecondaryContainer = () => {
  const movies = useSelector((store) => store.movies);
  const watchlistItems = useSelector((store) => store.watchlist.items);
  const langKey = useSelector((store) => store.config.lang);

  const selectedGenreId = useSelector((store) => store.genre.selectedGenreId);

  return (
    <div className="bg-transparent relative z-20 pb-10 w-full">
      {/* 1. Bulletproof Solid Background (Anchored precisely below video seam) */}
      <div className="absolute inset-0 bg-[#141414] -z-20" />

      {/* 2. Content pulled UP physically over the video container */}
      <div className="-mt-16 md:-mt-24 relative z-30">
        {/* Watchlist Row (if any) */}
        {watchlistItems.length > 0 && (
           <MovieList title={`⭐ ${lang[langKey]?.watchlist || "My Watchlist"}`} movies={watchlistItems} />
        )}
        <MovieList 
          title={lang[langKey]?.nowPlaying || "Now Playing"} 
          movies={movies.nowPlayingMovies} 
          categoryKey="nowPlayingMovies"
          endpoint="/movie/now_playing"
        />
        <MovieList 
          title={lang[langKey]?.popular || "Popular"}
          movies={movies.popularMovies} 
          categoryKey="popularMovies"
          endpoint="/movie/popular"
        />
        
        {/* Only show Global Top 10 when viewing 'All' genres */}
        {!selectedGenreId && (
          <TopTenList 
            title={`🔟 Top 10 ${lang[langKey]?.topRated || "Top Rated"}`}
            movies={movies.topRatedMovies} 
          />
        )}
        <MovieList 
          title={lang[langKey]?.upcoming || "Upcoming"}
          movies={movies.upcomingMovies} 
          categoryKey="upcomingMovies"
          endpoint="/movie/upcoming"
        />
      </div>
    </div>
  );
};

export default SecondaryContainer;
