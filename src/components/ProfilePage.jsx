import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { auth } from "../utils/firebase";
import { updateProfile } from "firebase/auth";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCamera, FaCheck, FaSignOutAlt, FaEdit, FaBookmark, FaTimes } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { showToast } from "../utils/toastSlice";
import LOGO from "../assets/movieGPT-logo.png";
import ChatBot from "./ChatBot";
import MovieModal from "./MovieModal";
import lang from "../utils/langConstants";

const AVATARS = [
  "https://occ-0-6246-2186.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABTZ2zlLdBVC05fsd2YQAR43J6vB1NAUBOOrxt7oaFATxMhtdzlNZ846H3D8TZzooe2-FT853YVYs8p001KVFYopWi4D4NXM.png?r=229",
  "https://i.pravatar.cc/150?img=3",
  "https://i.pravatar.cc/150?img=5",
  "https://i.pravatar.cc/150?img=8",
  "https://i.pravatar.cc/150?img=12",
  "https://i.pravatar.cc/150?img=15",
];

const ProfilePage = () => {
  const user = useSelector((store) => store.user);
  const watchlist = useSelector((store) => store.watchlist.items);
  const langKey = useSelector((store) => store.config.lang);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [saving, setSaving] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [isEditing, setIsEditing] = useState(false);


  const handleSave = async () => {
    if (!displayName.trim()) return;
    setSaving(true);
    try {
      await updateProfile(auth.currentUser, { displayName: displayName.trim() });
      dispatch(addUser({
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        displayName: displayName.trim(),
      }));
      dispatch(showToast({ message: "Profile updated!", type: "success" }));
    } catch {
      dispatch(showToast({ message: "Failed to update profile", type: "error" }));
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    signOut(auth).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(229,9,20,0.06)_0%,_transparent_60%)] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/10">
        <img src={LOGO} alt="MovieGPT" className="h-14 object-contain" />
        <button
          onClick={() => navigate("/browse")}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
        >
          <FaArrowLeft className="text-xs" /> {lang[langKey]?.backToBrowse || "Back to Browse"}
        </button>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12 fade-up">
        <h1 className="text-white text-3xl font-black mb-8">{lang[langKey]?.myProfile || "My Profile"}</h1>

        {/* Avatar */}
        <div className="glass border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest mb-4 text-gray-400">
            {lang[langKey]?.avatar || "Avatar"}
          </h2>
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={selectedAvatar}
                alt="avatar"
                className="w-20 h-20 rounded-xl object-cover border-2 border-red-500/60"
              />
              <button
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white hover:bg-red-500 transition-colors"
              >
                <FaCamera className="text-xs" />
              </button>
            </div>
            <div>
              <p className="text-white font-semibold">{user?.displayName || "User"}</p>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
          </div>

          {/* Avatar Picker Modal */}
          {showAvatarPicker && (
            <div className="absolute top-full left-0 mt-4 w-72 md:w-80 bg-zinc-900 border border-white/10 rounded-2xl p-4 shadow-2xl z-50 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-400 text-sm font-semibold uppercase tracking-widest">{lang[langKey]?.selectAvatar || "Select an Avatar"}</p>
                <button onClick={() => setShowAvatarPicker(false)} className="text-gray-400 hover:text-white">
                  <FaTimes />
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {AVATARS.map((url) => (
                  <button
                    key={url}
                    onClick={() => { setSelectedAvatar(url); setShowAvatarPicker(false); }}
                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedAvatar === url ? "border-red-500 scale-110" : "border-white/20 hover:border-white/50"
                    }`}
                  >
                    <img src={url} alt="avatar option" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Display Name */}
        <div className="glass border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-4">
            {lang[langKey]?.displayName || "Display Name"}
          </h2>
          <div className="flex gap-3">
            <input
              className="flex-1 py-3 px-4 bg-white/5 border border-white/15 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500/60 input-glow transition-all"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
            <button
              onClick={handleSave}
              disabled={saving || !displayName.trim()}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-500 transition-all disabled:opacity-50"
            >
              {saving ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              ) : <FaCheck className="text-xs" />}
              {lang[langKey]?.save || "Save"}
            </button>
          </div>
        </div>

        {/* Watchlist Stats */}
        <div className="glass border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-widest">
              {lang[langKey]?.watchlist || "My Watchlist"}
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="ml-auto md:ml-0 flex flex-col md:flex-row items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-full border border-gray-600 hover:border-white text-gray-400 hover:text-white transition-all text-xs md:text-sm font-medium"
            >
              <FaEdit />
              <span className="hidden md:inline">{lang[langKey]?.manageProfiles || "Manage Profiles"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-10 md:mt-16 border-t border-gray-800 pt-8">
            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 flex items-center gap-4">
              <FaBookmark className="text-red-500 text-3xl" />
              <div>
                <p className="text-gray-400 text-sm">{lang[langKey]?.moviesInWatchlist || "Movies in your Watchlist"}</p>
                <p className="text-3xl font-light text-white">{watchlist.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all duration-200 font-semibold text-sm"
        >
          <FaSignOutAlt />
          {lang[langKey]?.signOut || "Sign Out"}
        </button>
      </div>

      {/* Global Overlays for Profile Page */}
      <ChatBot />
      <MovieModal />
    </div>
  );
};

export default ProfilePage;
