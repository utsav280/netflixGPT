import React from "react";
import { IMG_CDN } from "../utils/constants";

const MovieCard = ({ posterPath }) => {
  return (
    <div className="min-w-[200px]">
      <img
        className="w-full h-auto rounded-md"
        src={IMG_CDN + posterPath}
        alt="Movie Poster"
      />
    </div>
  );
};

export default MovieCard;
