import React from "react";
import { FaPlay, FaInfoCircle } from "react-icons/fa"; // Import icons

const VideoTitle = ({ title, overview }) => {
  return (
    <div className="relative z-10 pt-36 px-4 md:px-12 text-white">
      <h1 className="text-3xl md:text-5xl font-extrabold mb-4">{title}</h1>
      <p className="text-sm md:text-lg w-full md:w-1/3 mb-6">{overview}</p>
      <div className="flex space-x-4">
        <button className="flex items-center bg-white text-black font-bold py-2 px-4 md:px-6 rounded hover:bg-gray-300 transition duration-300">
          <FaPlay className="mr-2" /> Play
        </button>
        <button className="flex items-center bg-gray-700 bg-opacity-75 text-white font-bold py-2 px-4 md:px-6 rounded hover:bg-gray-600 transition duration-300">
          <FaInfoCircle className="mr-2" /> More Info
        </button>
      </div>
    </div>
  );
};

export default VideoTitle;
