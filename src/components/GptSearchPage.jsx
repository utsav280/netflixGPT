import React from "react";
import GptSearchBar from "./GptSearchBar";

const GptSearchPage = () => {
  return (
    <div className="relative w-full min-h-screen overflow-y-auto bg-black">
      {/* Subtle background gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(229,9,20,0.07)_0%,_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(80,0,120,0.04)_0%,_transparent_60%)]" />
      </div>

      {/* All content (chat + results) lives inside GptSearchBar */}
      <div className="relative z-10 pb-16">
        <GptSearchBar />
      </div>
    </div>
  );
};

export default GptSearchPage;
