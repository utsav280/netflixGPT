import React, { Suspense, lazy } from "react";
import Header from "./Header";
import MainContainer from "./MainContainer";
import useNowPlayingMovies from "../hooks/useNowPlayingMovies";
import SecondaryContainer from "./SecondaryContainer";
import useTopRatedMovies from "../hooks/useTopRatedMovies";
import usePopularMovies from "../hooks/usePopularMovies";
import useUpcomingMovies from "../hooks/useUpcomingMovies";
import { useSelector } from "react-redux";
import MovieModal from "./MovieModal";
import Toast from "./Toast";
import ProfileGate from "./ProfileGate";

const GptSearchPage = lazy(() => import("./GptSearchPage"));
const ChatBot = lazy(() => import("./ChatBot"));

const Browse = () => {
  const showGptSearch = useSelector((store) => store.gpt.showGPTSearch);
  const activeProfile = useSelector((store) => store.profile.activeProfile);

  useNowPlayingMovies();
  useTopRatedMovies();
  usePopularMovies();
  useUpcomingMovies();

  if (!activeProfile) {
    return (
      <div>
        <Header />
        <ProfileGate />
      </div>
    );
  }

  return (
    <div>
      <Header />
      {showGptSearch ? (
        <Suspense
          fallback={
            <div className="min-h-screen bg-black flex items-center justify-center text-red-500 font-bold tracking-widest animate-pulse">
              INITIALIZING GPT ENGINE...
            </div>
          }
        >
          <GptSearchPage />
        </Suspense>
      ) : (
        <>
          <MainContainer />
          <SecondaryContainer />
        </>
      )}
      {/* Overlays */}
      <MovieModal />
      <Toast />
      <Suspense fallback={null}>
        <ChatBot />
      </Suspense>
    </div>
  );
};

export default Browse;
