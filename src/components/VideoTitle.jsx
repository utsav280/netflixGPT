import React from "react";
import { FaPlay, FaInfoCircle, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { useSelector } from "react-redux";
import lang from "../utils/langConstants";

const VideoTitle = ({ title, overview, muted, onToggleMute, onPlayClick }) => {
  const langKey = useSelector((store) => store.config.lang);
  
  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-end md:justify-center pb-24 md:pb-0 px-6 md:px-14">
      {/* Structural Gradient overlays explicitly positioned behind text */}
      <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent pointer-events-none -z-10" />
      <div className="absolute top-0 left-0 w-full md:w-[60%] h-full bg-gradient-to-r from-[#141414]/90 via-[#141414]/40 to-transparent pointer-events-none -z-10" />

      {/* Movie info — left aligned, contained width */}
      <div className="relative z-10 max-w-2xl fade-up">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 bg-red-600/20 border border-red-500/40 rounded-full px-3 py-1 mb-4 backdrop-blur-sm stagger-1 fade-in opacity-0">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400 text-xs font-semibold tracking-widest uppercase">Now Playing</span>
        </div>

        {/* Movie Title */}
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 md:mb-4 tracking-tight drop-shadow slide-in-left stagger-2 opacity-0">
          {title}
        </h1>

        {/* Overview */}
        <p className="text-sm md:text-lg font-medium text-[#e5e5e5] leading-snug mb-5 md:mb-8 w-full md:w-3/5 line-clamp-3 drop-shadow fade-up stagger-3 opacity-0">
          {overview}
        </p>

        {/* Play + More Info buttons (Authentic Netflix Constraints) */}
        <div className="flex items-center gap-3 fade-up stagger-4 opacity-0">
          <button
            onClick={onPlayClick}
            className="bg-white text-black py-1.5 md:py-2 px-5 md:px-7 text-sm md:text-lg font-semibold rounded-[4px] flex items-center gap-2 hover:bg-neutral-300 transition-colors duration-200"
          >
            <FaPlay className="text-sm md:text-xl -translate-y-[1px]" />
            {lang[langKey]?.play || "Play"}
          </button>
          <button
            onClick={onPlayClick}
            className="bg-[#6d6d6e]/70 hover:bg-[#6d6d6e]/40 text-white py-1.5 md:py-2 px-5 md:px-7 text-sm md:text-lg font-semibold rounded-[4px] flex items-center gap-2 transition-colors duration-200"
          >
            <FaInfoCircle className="text-sm md:text-xl" />
            {lang[langKey]?.moreInfo || "More Info"}
          </button>
        </div>
      </div>

      {/* Mute button */}
      <button
        onClick={onToggleMute}
        className="absolute bottom-24 right-8 hidden md:flex items-center justify-center w-11 h-11 rounded-full border-2 border-white/50 text-white bg-black/30 backdrop-blur-sm hover:border-white hover:bg-white/10 transition-all duration-200 z-10"
        title={muted ? "Unmute" : "Mute"}
      >
        {muted ? <FaVolumeMute className="text-base" /> : <FaVolumeUp className="text-base" />}
      </button>
    </div>
  );
};

export default React.memo(VideoTitle);
