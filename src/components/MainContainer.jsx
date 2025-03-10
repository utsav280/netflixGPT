import React from "react";
import { useSelector } from "react-redux";
import VideoTitle from "./VideoTitle";
import VideoBackground from "./VideoBackground";

const MainContainer = () => {
  const movies = useSelector((store) => store.movies?.nowPlayingMovies);
  // console.log(movies);
  if (!movies) {
    return (
      <div className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75">
          <div className="w-3/4 h-12 bg-gray-700 rounded-md shimmer mb-4"></div>
          <div className="w-1/2 h-8 bg-gray-700 rounded-md shimmer mb-4"></div>
          <div className="w-full h-64 bg-gray-700 rounded-md shimmer"></div>
        </div>
        <style jsx="true">{`
          .shimmer {
            background: linear-gradient(
              to right,
              #2a2a2a 8%,
              #3a3a3a 18%,
              #2a2a2a 33%
            );
            background-size: 1000px 100%;
            animation: shimmer 1.5s infinite linear;
          }

          @keyframes shimmer {
            0% {
              background-position: -1000px 0;
            }
            100% {
              background-position: 1000px 0;
            }
          }
        `}</style>
      </div>
    );
  }
  const mainMovie = movies[0];
  const { original_title, overview, id } = mainMovie;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <VideoBackground movieId={id} />
      <VideoTitle title={original_title} overview={overview} />
    </div>
  );
};

export default MainContainer;
