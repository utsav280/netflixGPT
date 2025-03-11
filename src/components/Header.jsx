/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { FaCaretDown, FaCaretUp, FaHome, FaSearch } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../utils/userSlice";
import { LOGO, PROFILE } from "../utils/constants";
import { toggleGptSearch, removeGptMovieResults } from "../utils/gptSlice";
import { SUPPORTED_LANGUAGES } from "../utils/constants";
import { changeLanguage } from "../utils/configSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const showGptSearch = useSelector((store) => store.gpt.showGPTSearch);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleGptSearchClick = () => {
    console.log("GPT Search button clicked");
    dispatch(removeGptMovieResults());
    dispatch(toggleGptSearch());
  };

  const handleSignOut = () => {
    // Sign out logic
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
        navigate("/error");
      });
  };

  const handleLanguageChange = (e) => {
    dispatch(changeLanguage(e.target.value));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in/Signed Up
        const { uid, email, displayName } = user;
        dispatch(addUser({ uid: uid, email: email, displayName: displayName }));
        navigate("/browse");
      } else {
        // User is signed out
        dispatch(removeUser());
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="absolute w-full z-20 px-4 py-2 bg-gradient-to-b from-black to-transparent flex justify-between items-center">
      <img className="w-24 md:w-36" src={LOGO} alt="logo" />
      {location.pathname === "/browse" && (
        <div className="relative flex items-center space-x-2 md:space-x-4">
          {showGptSearch && (
            <select
              className="w-20 md:w-24 px-2 bg-white rounded-md shadow-lg py-2 z-20 transition-all duration-300 ease-in-out"
              name="language"
              id="language"
              onChange={handleLanguageChange}
            >
              {SUPPORTED_LANGUAGES.map((language) => (
                <option
                  className="right-0 mt-32 w-48 text-white bg-black bg-opacity-100 rounded-md shadow-lg py-2 z-20 transition-all duration-300 ease-in-out hover:underline"
                  key={language.identifier}
                  value={language.identifier}
                >
                  {language.name}
                </option>
              ))}
            </select>
          )}

          <button
            className="flex items-center py-2 px-2 md:px-4 mx-2 md:mx-4 my-2 bg-transparent border border-white text-white text-sm md:text-lg font-normal rounded-md hover:underline transition duration-300"
            onClick={handleGptSearchClick}
          >
            {!showGptSearch ? (
              <FaSearch className="mr-2" />
            ) : (
              <FaHome className="mr-2" />
            )}{" "}
            {showGptSearch ? "Home" : "GPT Search"}
          </button>
          <div
            className="flex items-center cursor-pointer"
            onClick={toggleDropdown}
          >
            <img
              className="w-8 h-8 md:w-10 md:h-10 z-20 rounded-md"
              src={PROFILE}
              alt="profilePic"
            />
            {isDropdownOpen ? (
              <FaCaretUp className="text-white ml-2" />
            ) : (
              <FaCaretDown className="text-white ml-2" />
            )}
          </div>
          <div
            className={`absolute right-0 mt-32 w-48 bg-black bg-opacity-75 rounded-md shadow-lg py-2 z-20 transition-all duration-300 ease-in-out ${
              isDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
          >
            <button
              onClick={handleSignOut}
              className="block w-full text-left px-8 py-2 text-white hover:underline"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
