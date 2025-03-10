import React from "react";
import GptSearchBar from "./GptSearchBar";
import GptMovieSuggestions from "./GptMovieSuggestions";
import { BACKGROUND } from "../utils/constants";
import Header from "./Header";

const GptSearchPage = () => {
  return (
    <div className=" w-full h-screen">
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <img
          className="w-full h-full object-cover"
          src={BACKGROUND}
          alt="background"
        />
      </div>
      <div className="absolute top-0 left-0 w-full h-full z-10">
        <Header /> {/* Include Header component */}
        <div className="mt-4">
          <GptSearchBar />
          <GptMovieSuggestions />
        </div>
      </div>
    </div>
  );
};

export default GptSearchPage;
