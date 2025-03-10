import React, { useRef } from "react";
import { FaSearch } from "react-icons/fa";
import lang from "../utils/langConstants";
import { useSelector } from "react-redux";
import { genAI } from "../utils/geminiAi";
import { API_OPTIONS } from "../utils/constants";
import { addGptMovieResults } from "../utils/gptSlice";
import { useDispatch } from "react-redux";

const GptSearchBar = () => {
  const searchText = useRef(null);
  const langKey = useSelector((store) => store.config.lang);
  const dispatch = useDispatch();

  // Making API call for Searching the movie recieved from Gemini API
  const searchMovieTMDB = async (movie) => {
    const data = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${movie}&include_adult=false&page=1`,
      API_OPTIONS
    );
    const json = await data.json();
    return json.results;
  };

  const handleGptSearchClick = async (e) => {
    e.preventDefault();
    const geminiQuery =
      "Act as a movie Recommendation Sysytem and suggest some movies for the query : " +
      searchText.current.value +
      "only give me name of the 5 movies, coma seperated like the example result given ahead, Example Result: Gadar, Sholay, Don, Pushpa, Chavva";
    console.log(searchText.current.value);

    // Make an API call to Gemini API and Get movie Results

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(geminiQuery);

    const response = await result.response;
    const geminiResult = response.text();
    console.log(geminiResult);

    if (!geminiResult) {
      <div>No results found</div>;
    }

    const geminiMovies = geminiResult.split(",");
    const data = geminiMovies.map((movie) => searchMovieTMDB(movie));
    const tmdbSuggestions = await Promise.all(data);
    console.log(tmdbSuggestions);
    dispatch(
      addGptMovieResults({
        movieNames: geminiMovies,
        movieResults: tmdbSuggestions,
      })
    );

    // const tmdbResults = tmdbSuggestions.map((data) =>
    //   data.filter((movie) => geminiMovies.includes(movie.title))
    // );
    // console.log(tmdbResults);
  };

  return (
    <div className="flex  justify-center px-4 py-4 mt-32 z-20">
      <div className="flex items-center justify-center relative w-full max-w-2xl ">
        <input
          type="text"
          ref={searchText}
          className="w-full py-4 pl-12 pr-4 text-white text-sm font-normal font-serif bg-black opacity-95 border border-red-600 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-300 ease-in-out placeholder-gray-400 "
          placeholder={lang[langKey].placeHolder}
        />
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-600 opacity-100 transition-all duration-300 ease-in-out hover:opacity-100 hover:scale-110 hover:rotate-90 " />
        <button
          onClick={handleGptSearchClick}
          className="absolute right-4 top-1/2  transform -translate-y-1/2 py-2 px-4 text-white bg-red-600 rounded-full hover:bg-red-800 transition-all duration-300 ease-in-out focus:outline-none"
        >
          {lang[langKey].search}
        </button>
      </div>
    </div>
  );
};

export default GptSearchBar;
