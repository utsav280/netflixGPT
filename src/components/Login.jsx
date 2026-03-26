import React from "react";
import Header from "./Header";
import { useState, useRef } from "react";
import { checkValidateData } from "../utils/validate";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../utils/firebase";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BACKGROUND } from "../utils/constants";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const dispatch = useDispatch();
  const email = useRef(null);
  const password = useRef(null);
  const name = useRef(null);

  const handleButtonClick = async () => {
    const emailValue = email.current.value;
    const passwordValue = password.current.value;
    const { message } = checkValidateData(emailValue, passwordValue);
    setErrorMessage(message);
    if (message) return;

    setIsLoading(true);
    try {
      if (!isSignInForm) {
        const userCredential = await createUserWithEmailAndPassword(
          auth, email.current.value, password.current.value
        );
        await updateProfile(userCredential.user, { displayName: name.current.value });
        const { uid, email: userEmail, displayName } = auth.currentUser;
        dispatch(addUser({ uid, email: userEmail, displayName }));
      } else {
        await signInWithEmailAndPassword(auth, email.current.value, password.current.value);
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMessage("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { uid, email: userEmail, displayName } = result.user;
      dispatch(addUser({ uid, email: userEmail, displayName }));
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
    setErrorMessage("");
    if (email.current) email.current.value = "";
    if (password.current) password.current.value = "";
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <Header />

      {/* Background */}
      <div className="absolute inset-0">
        <img className="w-full h-full object-cover" src={BACKGROUND} alt="background" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
      </div>

      {/* Form */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-20">
        <div className="w-full max-w-md glass rounded-2xl p-8 md:p-10 fade-up">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-1">
              {isSignInForm ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-gray-400 text-sm">
              {isSignInForm ? "Sign in to continue watching" : "Join MovieGPT today"}
            </p>
          </div>

          {/* Google Sign-In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 mb-5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
          >
            {isGoogleLoading ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <FcGoogle className="text-xl" />
            )}
            <span>{isGoogleLoading ? "Signing in..." : "Continue with Google"}</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-600 text-xs">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            {!isSignInForm && (
              <div className="relative group">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors duration-200 text-sm" />
                <input ref={name} className="w-full py-3.5 pl-11 pr-4 bg-white/5 border border-white/15 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500/60 input-glow transition-all duration-200" type="text" placeholder="Full Name" />
              </div>
            )}

            <div className="relative group">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors duration-200 text-sm" />
              <input ref={email} className="w-full py-3.5 pl-11 pr-4 bg-white/5 border border-white/15 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500/60 input-glow transition-all duration-200" type="text" placeholder="Email or Mobile number" />
            </div>
            {errorMessage === "Email is not valid" && (
              <p className="text-red-400 text-xs pl-1 -mt-2 flex items-center gap-1"><span>⚠</span> {errorMessage}</p>
            )}

            <div className="relative group">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors duration-200 text-sm" />
              <input ref={password} className="w-full py-3.5 pl-11 pr-12 bg-white/5 border border-white/15 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500/60 input-glow transition-all duration-200" type={showPassword ? "text" : "password"} placeholder="Password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors duration-200">
                {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
              </button>
            </div>
            {errorMessage === "Password is not valid" && (
              <p className="text-red-400 text-xs pl-1 -mt-2 flex items-center gap-1"><span>⚠</span> {errorMessage}</p>
            )}

            {errorMessage && errorMessage !== "Email is not valid" && errorMessage !== "Password is not valid" && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                <p className="text-red-400 text-sm">{errorMessage}</p>
              </div>
            )}

            <button onClick={handleButtonClick} disabled={isLoading} className="btn-shine w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-sm tracking-wide hover:from-red-500 hover:to-red-600 glow-red-hover transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  <span>{isSignInForm ? "Signing in..." : "Creating account..."}</span>
                </>
              ) : (
                <span>{isSignInForm ? "Sign In" : "Sign Up"}</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <span className="text-gray-500 text-sm">{isSignInForm ? "New to MovieGPT?" : "Already a member?"} </span>
            <button className="text-white font-semibold text-sm hover:text-red-400 transition-colors duration-200 underline underline-offset-2" onClick={toggleSignInForm}>
              {isSignInForm ? "Sign up now" : "Sign in now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
