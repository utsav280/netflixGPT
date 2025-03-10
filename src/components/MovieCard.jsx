import React from "react";
import { IMG_CDN } from "../utils/constants";

const MovieCard = ({ posterPath }) => {
  if (posterPath === null) return;
  return (
    <div className="min-w-[200px] ">
      <img
        className="w-[200px] text-white h-auto rounded-md border border-white"
        src={IMG_CDN + posterPath}
        alt="Movie Poster"
      />
    </div>
  );
};

export default MovieCard;
