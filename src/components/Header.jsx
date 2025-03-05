import React, { useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa"; // Import arrow icons
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate, useLocation } from "react-router-dom";
const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Sign out logic
    signOut(auth)
      .then(() => {
        // Sign-out successful.

        navigate("/");
      })
      .catch((error) => {
        // An error happened.
        navigate("/error");
      });
  };

  return (
    <div className="absolute w-screen px-8 py-2 bg-gradient-to-b from-black to-transparent z-10 flex justify-between">
      <img
        className="w-36"
        src="https://help.nflxext.com/helpcenter/OneTrust/oneTrust_production/consent/87b6a5c0-0104-4e96-a291-092c11350111/01938dc4-59b3-7bbc-b635-c4131030e85f/logos/dd6b162f-1a32-456a-9cfe-897231c7763c/4345ea78-053c-46d2-b11e-09adaef973dc/Netflix_Logo_PMS.png"
        alt="logo"
      />
      {location.pathname === "/browse" && (
        <div className="relative flex items-center space-x-4">
          <div
            className="flex items-center cursor-pointer"
            onClick={toggleDropdown}
          >
            <img
              className="w-10 h-10 "
              src="https://occ-0-6246-2186.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABTZ2zlLdBVC05fsd2YQAR43J6vB1NAUBOOrxt7oaFATxMhtdzlNZ846H3D8TZzooe2-FT853YVYs8p001KVFYopWi4D4NXM.png?r=229"
              alt="profilePic"
            />
            {isDropdownOpen ? (
              <FaCaretUp className="ml-2" />
            ) : (
              <FaCaretDown className="ml-2" />
            )}
          </div>
          <div
            className={`absolute right-0 mt-32 w-48 bg-black bg-opacity-75 rounded-md shadow-lg py-2 z-20 transition-all duration-300 ease-in-out ${
              isDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
          >
            <button
              onClick={handleSignOut}
              className="block w-full text-left px-4 py-2 text-white hover:underline"
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
