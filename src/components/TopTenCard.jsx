import React from "react";
import { IMG_CDN_W342 } from "../utils/constants";
import { useDispatch } from "react-redux";
import { setSelectedMovie } from "../utils/movieSlice";

const TopTenCard = ({ posterPath, rank, movie }) => {
  const dispatch = useDispatch();

  if (!posterPath) return null;

  return (
    <div
      onClick={() => dispatch(setSelectedMovie(movie))}
      className="shrink-0 cursor-pointer group"
    >
      <img
        alt={`Top Rated #${rank}`}
        src={IMG_CDN_W342 + posterPath}
        className="w-[124px] md:w-[150px] aspect-[2/3] bg-[#141414] object-cover rounded-md shadow-lg border border-transparent group-hover:border-white/30 transition-transform duration-300 group-hover:scale-[1.04]"
      />
    </div>
  );
};

export default React.memo(TopTenCard);
