/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { FaCaretDown, FaCaretUp, FaHome, FaSearch, FaSignOutAlt, FaUserCog, FaUsers } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../utils/userSlice";
import { PROFILE } from "../utils/constants";
import { toggleGptSearch, removeGptMovieResults } from "../utils/gptSlice";
import { clearActiveProfile } from "../utils/profileSlice";
import { SUPPORTED_LANGUAGES } from "../utils/constants";
import { changeLanguage } from "../utils/configSlice";
import LOGO from "../assets/movieGPT-logo.png";
import lang from "../utils/langConstants";
import LiveSearch from "./LiveSearch";
import GenreFilter from "./GenreFilter";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const showGptSearch = useSelector((store) => store.gpt.showGPTSearch);
  const user = useSelector((store) => store.user);
  const langKey = useSelector((store) => store.config.lang);
  const activeProfile = useSelector((store) => store.profile?.activeProfile);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = React.useRef(null);

  // Track scroll to add solid background when scrolled
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleGptSearchClick = () => {
    dispatch(removeGptMovieResults());
    dispatch(toggleGptSearch());
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {})
      .catch(() => navigate("/error"));
  };

  const handleLanguageChange = (e) => dispatch(changeLanguage(e.target.value));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName, photoURL } = user;
        dispatch(addUser({ uid, email, displayName, photoURL }));
        navigate("/browse");
      } else {
        dispatch(removeUser());
        dispatch(clearActiveProfile());
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [dispatch, navigate]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/95 backdrop-blur-md shadow-lg shadow-black/50"
          : "bg-gradient-to-b from-black/90 via-black/40 to-transparent"
      }`}
    >
      <div className="flex h-16 md:h-18 items-center justify-between px-5 md:px-10">
        {/* Logo */}
        <img
          className="h-16 md:h-24 object-contain cursor-pointer hover:scale-105 transition-transform duration-200"
          src={LOGO}
          alt="MovieGPT logo"
          onClick={() => navigate("/browse")}
        />

        {location.pathname === "/browse" && activeProfile && (
          <div className="flex items-center gap-3 md:gap-4">
            
            {/* Live Search Autocomplete */}
            <LiveSearch lang={lang[langKey]} />

            {/* Netflix Authentic Dropdown */}
            {!showGptSearch && <GenreFilter />}

            {/* Global Language Select */}
            <select
              className="bg-black/60 text-white border border-white/20 rounded-lg px-2 py-1.5 md:px-3 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-red-600/60 transition-all backdrop-blur-sm hover:border-white/40 cursor-pointer"
              name="language"
              onChange={handleLanguageChange}
              value={langKey}
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

            {/* GPT / Home Toggle */}
            <button
              onClick={handleGptSearchClick}
              className={`btn-shine flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 ${
                showGptSearch
                  ? "bg-white/10 border border-white/30 text-white hover:bg-white/20"
                  : "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg glow-red hover:from-red-500 hover:to-red-600"
              }`}
            >
              {showGptSearch ? (
                <>
                  <FaHome className="text-sm" />
                  <span className="hidden md:inline">{lang[langKey].home}</span>
                </>
              ) : (
                <>
                  <FaSearch className="text-sm" />
                  <span className="hidden md:inline">{lang[langKey].gptSearch}</span>
                </>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={toggleDropdown}
              >
                <img
                  className="w-8 h-8 md:w-9 md:h-9 rounded-lg object-cover border-2 border-transparent group-hover:border-red-500 transition-all duration-200"
                  src={activeProfile?.img || PROFILE}
                  alt="profile"
                />
                <div className="flex flex-col leading-tight hidden md:flex">
                  <span className="text-white text-xs font-semibold">
                    {activeProfile?.name || user?.displayName?.split(" ")[0] || "User"}
                  </span>
                </div>
                {isDropdownOpen ? (
                  <FaCaretUp className="text-white/70 text-xs" />
                ) : (
                  <FaCaretDown className="text-white/70 text-xs" />
                )}
              </div>

              {/* Dropdown Menu */}
              <div
                className={`absolute right-0 mt-1 w-48 rounded-xl glass border border-white/10 shadow-2xl transition-all duration-200 ${
                  isDropdownOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2"
                }`}
              >
                {/* User info */}
                {user?.displayName && (
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-white text-sm font-semibold">{user.displayName}</p>
                    <p className="text-gray-400 text-xs mt-0.5 truncate">{user.email}</p>
                  </div>
                )}
                <button
                  onClick={() => { navigate("/profile"); setIsDropdownOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-4 py-3 text-left text-sm text-white hover:text-red-400 hover:bg-red-600/10 transition-all duration-200 border-b border-white/5"
                >
                  <FaUserCog className="text-gray-400 shrink-0" />
                  <span className="truncate">{lang[langKey]?.myProfile || "My Profile"}</span>
                </button>
                <button
                  onClick={() => { dispatch(clearActiveProfile()); setIsDropdownOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-4 py-3 text-left text-sm text-white hover:text-red-400 hover:bg-red-600/10 transition-all duration-200"
                >
                  <FaUsers className="text-gray-400 shrink-0" />
                  <span className="truncate">{lang[langKey]?.switchProfile || "Switch Profile"}</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2.5 w-full px-4 py-3 text-left text-sm text-white hover:text-red-400 hover:bg-red-600/10 transition-all duration-200 rounded-b-xl"
                >
                  <FaSignOutAlt className="text-red-500 shrink-0" />
                  <span className="truncate">{lang[langKey]?.signOut || "Sign Out"}</span>
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
