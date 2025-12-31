/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { FaCaretDown, FaCaretUp, FaHome, FaSearch } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../utils/userSlice";
import { PROFILE } from "../utils/constants";
import { toggleGptSearch, removeGptMovieResults } from "../utils/gptSlice";
import { SUPPORTED_LANGUAGES } from "../utils/constants";
import { changeLanguage } from "../utils/configSlice";
import LOGO from "../assets/movieGPT-logo.png";

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
    <header className="fixed top-0 left-0 w-full h-16 md:h-20 z-50 bg-gradient-to-b from-black/90 to-transparent">
      <div className="flex h-full items-center justify-between px-6">
        <img
          className="h-20 md:h-40 object-contain"
          src={LOGO}
          alt="MovieGPT logo"
        />

        {location.pathname === "/browse" && (
          <div className="flex items-center space-x-4 md:space-x-6">
            {/* LANGUAGE SELECT */}
            {showGptSearch && (
              <select
                className="bg-black text-white border border-gray-500 rounded-md px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-red-600 transition"
                name="language"
                onChange={handleLanguageChange}
              >
                {SUPPORTED_LANGUAGES.map((language) => (
                  <option
                    key={language.identifier}
                    value={language.identifier}
                    className="bg-black text-white"
                  >
                    {language.name}
                  </option>
                ))}
              </select>
            )}

            {/* GPT / HOME TOGGLE */}
            <button
              onClick={handleGptSearchClick}
              className="flex items-center gap-2 px-4 py-2 border border-white/70 text-white text-sm md:text-base rounded-md hover:bg-white hover:text-black transition duration-300"
            >
              {showGptSearch ? <FaHome /> : <FaSearch />}
              <span className="hidden md:inline">
                {showGptSearch ? "Home" : "GPT Search"}
              </span>
            </button>

            {/* PROFILE */}
            <div className="relative">
              <div
                className="flex items-center cursor-pointer"
                onClick={toggleDropdown}
              >
                <img
                  className="w-9 h-9 md:w-10 md:h-10 rounded-md object-cover"
                  src={PROFILE}
                  alt="profile"
                />
                {isDropdownOpen ? (
                  <FaCaretUp className="text-white ml-2" />
                ) : (
                  <FaCaretDown className="text-white ml-2" />
                )}
              </div>

              {/* DROPDOWN */}
              <div
                className={`absolute right-0 mt-3 w-40 rounded-md bg-black/90 shadow-lg transition-all duration-200 ${
                  isDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
              >
                <button
                  onClick={handleSignOut}
                  className="block w-full px-4 py-2 text-left text-white text-sm hover:bg-red-600 transition"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
