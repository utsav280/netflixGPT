import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import lang from "../utils/langConstants";
import { useSelector } from "react-redux";

const GptSearchBar = () => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSearchClick = () => {
    if (inputValue) {
      console.log("Searching for:", inputValue); // Replace this with actual search logic
    }
  };
  const langKey = useSelector((store) => store.config.lang);
  console.log(langKey);

  return (
    <div className="flex  justify-center px-4 py-4 mt-32 z-20">
      <div className="flex items-center justify-center relative w-full max-w-2xl ">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="w-full py-4 pl-12 pr-4 text-white text-sm font-normal font-serif bg-black opacity-95 border border-red-600 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-300 ease-in-out placeholder-gray-400 "
          placeholder={lang[langKey].placeHolder}
        />
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-600 opacity-100 transition-all duration-300 ease-in-out hover:opacity-100 hover:scale-110 hover:rotate-90 " />
        <button
          onClick={handleSearchClick}
          className="absolute right-4 top-1/2  transform -translate-y-1/2 py-2 px-4 text-white bg-red-600 rounded-full hover:bg-red-800 transition-all duration-300 ease-in-out focus:outline-none"
        >
          {lang[langKey].search}
        </button>
      </div>
    </div>
  );
};

export default GptSearchBar;
