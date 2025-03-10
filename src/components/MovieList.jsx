import React from "react";
import MovieCard from "./MovieCard";
import Shimmer from "./Shimmer";

const MovieList = ({ title, movies }) => {
  if (!movies || movies.length === 0) {
    return <Shimmer title={title} />;
  }

  return (
    <div className="px-8 py-4">
      <h1 className="text-2xl font-bold text-white mb-4">{title}</h1>
      <div className="flex space-x-4 overflow-x-scroll no-scrollbar">
        {movies.map((movie) => (
          <MovieCard key={movie.id} posterPath={movie.poster_path} />
        ))}
      </div>
      <style jsx="true">{`
        .no-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, and Opera */
        }
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default MovieList;
