import React, { useState, useEffect } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa"; // Import arrow icons
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { addUser, removeUser } from "../utils/userSlice";
import { LOGO, PROFILE } from "../utils/constants";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // console.log(auth);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
    <div className="absolute w-screen z-20 px-8 py-2 bg-gradient-to-b from-black to-transparent  flex justify-between">
      <img className="w-36" src={LOGO} alt="logo" />
      {location.pathname === "/browse" && (
        <div className="relative flex items-center space-x-4">
          <div
            className="flex items-center cursor-pointer"
            onClick={toggleDropdown}
          >
            <img
              className="w-10 h-10 z-20 rounded-md "
              src={PROFILE}
              alt="profilePic"
            />
            {isDropdownOpen ? (
              <FaCaretUp className="text-white ml-2" />
            ) : (
              <FaCaretDown className="text-white ml-2 " />
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
// import React, { useState, useEffect } from "react";
// import { FaCaretDown, FaCaretUp } from "react-icons/fa"; // Import arrow icons
// import { signOut } from "firebase/auth";
// import { auth } from "../utils/firebase";
// import { useNavigate, useLocation } from "react-router-dom";
// import { onAuthStateChanged } from "firebase/auth";
// import { useDispatch } from "react-redux";
// import { addUser, removeUser } from "../utils/userSlice";
// import { LOGO, PROFILE } from "../utils/constants";

// const Header = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const toggleDropdown = () => {
//     setIsDropdownOpen((prev) => !prev);
//   };

//   const handleSignOut = () => {
//     signOut(auth)
//       .then(() => {
//         // Sign-out successful, redirect to home page.
//         navigate("/");
//       })
//       .catch((error) => {
//         navigate("/error"); // Handle errors
//       });
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         const { uid, email, displayName } = user;
//         dispatch(addUser({ uid: uid, email: email, displayName: displayName }));
//         navigate("/browse");
//       } else {
//         dispatch(removeUser());
//         navigate("/");
//       }
//     });
//     return () => unsubscribe();
//   }, [dispatch, navigate]);

//   return (
//     <div className="relative w-screen z-10 px-8 py-2 bg-gradient-to-b from-black to-transparent flex justify-between">
//       <img className="w-36" src={LOGO} alt="logo" />
//       {location.pathname === "/browse" && (
//         <div
//           className="relative flex items-center space-x-4 z-50"
//           style={{
//             position: "relative",
//             zIndex: 10000,
//           }}
//         >
//           <div
//             className="flex items-center cursor-pointer relative"
//             onClick={toggleDropdown}
//           >
//             <img
//               className="w-10 h-10 rounded-full"
//               src={PROFILE}
//               alt="profilePic"
//             />
//             <div className="ml-2 text-white">
//               {isDropdownOpen ? (
//                 <FaCaretUp size={24} />
//               ) : (
//                 <FaCaretDown size={24} />
//               )}
//             </div>
//           </div>

//           {/* Dropdown Menu */}
//           {isDropdownOpen && (
//             <div
//               className="absolute right-0 mt-2 w-48 bg-black bg-opacity-75 rounded-md shadow-lg py-2 z-50"
//               style={{
//                 top: "100%", // This ensures the dropdown appears below the profile picture
//                 right: "0", // Aligns the dropdown to the right edge of the profile picture
//                 pointerEvents: "auto", // Ensure the dropdown can be clicked
//               }}
//             >
//               {/* Sign-Out Button */}
//               <button
//                 onClick={handleSignOut}
//                 className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 focus:outline-none"
//                 style={{
//                   zIndex: 10001, // Ensure the button is on top of the dropdown
//                 }}
//               >
//                 Sign Out
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Header;
