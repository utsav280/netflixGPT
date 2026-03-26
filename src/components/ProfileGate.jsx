import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveProfile } from "../utils/profileSlice";
import lang from "../utils/langConstants";

const AVATARS = [
  "https://occ-0-6246-2186.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABTZ2zlLdBVC05fsd2YQAR43J6vB1NAUBOOrxt7oaFATxMhtdzlNZ846H3D8TZzooe2-FT853YVYs8p001KVFYopWi4D4NXM.png?r=229",
  "https://i.pravatar.cc/150?img=12",
  "https://i.pravatar.cc/150?img=5",
];

const ProfileGate = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const langKey = useSelector((store) => store.config.lang);
  const [clickedIndex, setClickedIndex] = useState(null);

  // Fallback if not loaded
  if (!user) return null;

  const profiles = [
    { id: "p1", name: user.displayName || "User", img: user.photoURL || AVATARS[0] },
    { id: "p2", name: "Kids", img: AVATARS[1] },
    { id: "p3", name: "Guest", img: AVATARS[2] },
  ];

  const handleProfileClick = (profile, index) => {
    setClickedIndex(index);
    // Play a CSS animation and then unlock the gate
    setTimeout(() => {
      dispatch(setActiveProfile(profile));
    }, 600); // 600ms matching the CSS scale animation
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#141414] flex flex-col items-center justify-center fade-in">
      <h1 className="text-white text-3xl md:text-5xl font-medium mb-10 text-center fade-up drop-shadow-lg">
        {lang[langKey]?.whoIsWatching || "Who's watching?"}
      </h1>

      <div className="flex flex-wrap justify-center gap-6 md:gap-10 px-4">
        {profiles.map((profile, i) => {
          const isClicked = clickedIndex === i;
          const isFading = clickedIndex !== null && clickedIndex !== i;

          return (
            <div
              key={profile.id}
              onClick={() => handleProfileClick(profile, i)}
              className={`flex flex-col items-center cursor-pointer group transition-all duration-500 ease-out 
                ${isClicked ? "scale-[1.3] z-50 opacity-100 translate-y-4" : ""}
                ${isFading ? "opacity-0 scale-75 pointer-events-none" : "hover:scale-110 opacity-100"}
              `}
            >
              <div
                className={`w-28 h-28 md:w-40 md:h-40 rounded-xl overflow-hidden mb-4 border-2 transition-all duration-300
                  ${isClicked ? "border-white shadow-[0_0_50px_rgba(239,68,68,0.5)]" : "border-transparent group-hover:border-white shadow-lg"}
                `}
              >
                <img
                  src={profile.img}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                className={`text-gray-400 font-semibold md:text-xl transition-colors duration-300 
                ${isClicked ? "text-white opacity-0" : "group-hover:text-white"}`}
              >
                {profile.name}
              </span>
            </div>
          );
        })}
      </div>

      <button className="mt-16 md:mt-24 px-6 py-2 md:px-8 md:py-3 border border-gray-500 text-gray-400 font-semibold tracking-widest text-sm hover:text-white hover:border-white transition-colors">
        {lang[langKey]?.manageProfiles || "Manage Profiles"}
      </button>
    </div>
  );
};

export default ProfileGate;
