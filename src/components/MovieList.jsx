// import React from "react";
// import MovieCard from "./MovieCard";

// const MovieList = ({ title, movies }) => {
//   if (!movies) {
//     return <div>Loading...</div>; // Fallback UI while data is being loaded
//   }
//   return (
//     <div>
//       <h1>{title}</h1>
//       <div className="flex">
//         <div className="flex overflow-x-scroll">
//           {movies.map((movie) => (
//             <MovieCard key={movie.id} posterPath={movie.poster_path} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MovieList;

import React from "react";
import MovieCard from "./MovieCard";

const MovieList = ({ title, movies }) => {
  if (!movies || movies.length === 0) {
    return <div>Loading...</div>; // Fallback UI while data is being loaded
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
