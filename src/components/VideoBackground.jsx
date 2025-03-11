import React from "react";
import { useSelector } from "react-redux";
import useMovieTrailer from "../hooks/useMovieTrailer";

const VideoBackground = ({ movieId }) => {
  useMovieTrailer(movieId);
  const trailerVideo = useSelector((store) => store.movies?.trailer);
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
      <iframe
        className=" w-full h-full object-cover  pointer-events-none"
        src={
          "https://www.youtube.com/embed/" +
          trailerVideo?.key +
          "?autoplay=1&mute=1&loop=1&playlist=" +
          trailerVideo?.key +
          "&controls=0&showinfo=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&fs=0"
        }
        title="The Gorge — Official Trailer | Apple TV+"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
      <div className="absolute top-0 left-0 w-full h-full bg-transparent pointer-events-none"></div>
    </div>
  );
};

export default VideoBackground;
