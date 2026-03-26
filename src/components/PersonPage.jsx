import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import usePersonDetails from "../hooks/usePersonDetails";
import { IMG_CDN_W500 } from "../utils/constants";
import MovieCard from "./MovieCard";
import { FaArrowLeft, FaBirthdayCake, FaMapMarkerAlt } from "react-icons/fa";
import LOGO from "../assets/movieGPT-logo.png";
import MovieModal from "./MovieModal";

const PersonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { personDetails, movieCredits, loading } = usePersonDetails(id);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!personDetails) return null;

  return (
    <div className="min-h-screen bg-[#141414] text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="flex h-16 items-center px-6 md:px-10 gap-6">
          <img
            src={LOGO}
            alt="Netflix Logo"
            className="h-8 md:h-12 cursor-pointer"
            onClick={() => navigate("/browse")}
          />
          <button
            onClick={() => navigate(-1)}
            className="ml-auto flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <FaArrowLeft /> Back
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-20 px-6 md:px-12 max-w-7xl mx-auto fade-up">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          
          {/* Left Column (Image & Fast Facts) */}
          <div className="w-full md:w-1/3 lg:w-1/4 shrink-0">
            {personDetails.profile_path ? (
              <img
                src={IMG_CDN_W500 + personDetails.profile_path}
                alt={personDetails.name}
                className="w-full rounded-2xl shadow-2xl border border-white/10 mb-6 object-cover"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-zinc-800 rounded-2xl flex items-center justify-center text-4xl font-black text-zinc-600 mb-6 border border-white/10">
                {personDetails.name.charAt(0)}
              </div>
            )}
            
            <h2 className="text-xl font-bold mb-4 border-b border-white/20 pb-2">Personal Info</h2>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-400 font-semibold mb-1">Known For</p>
                <p>{personDetails.known_for_department}</p>
              </div>
              <div>
                <p className="text-gray-400 font-semibold mb-1 flex items-center gap-2">
                  <FaBirthdayCake /> Birthday
                </p>
                <p>{personDetails.birthday || "-"}</p>
              </div>
              <div>
                <p className="text-gray-400 font-semibold mb-1 flex items-center gap-2">
                  <FaMapMarkerAlt /> Place of Birth
                </p>
                <p>{personDetails.place_of_birth || "-"}</p>
              </div>
            </div>
          </div>

          {/* Right Column (Bio & Movies) */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">{personDetails.name}</h1>
            
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <div className="w-1 h-5 bg-red-600 rounded-full" /> Biography
              </h3>
              <div className="text-gray-300 leading-relaxed text-sm md:text-base prose prose-invert">
                {personDetails.biography ? (
                  personDetails.biography.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="mb-4">{paragraph}</p>
                  ))
                ) : (
                  <p className="italic text-gray-500">We don't have a biography for {personDetails.name}.</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <div className="w-1 h-5 bg-red-600 rounded-full" /> Known For
              </h3>
              {movieCredits.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {movieCredits.map((movie) => (
                    <div key={movie.id} className="relative group">
                      <MovieCard 
                        posterPath={movie.poster_path} 
                        title={movie.title || movie.original_title}
                        rating={movie.vote_average}
                        movie={movie} 
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No historical credits found.</p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Global Modals */}
      <MovieModal />
    </div>
  );
};

export default PersonPage;
