import React from "react";
import Header from "./Header";
import { useState, useRef } from "react";
import { checkValidateData } from "../utils/validate";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BACKGROUND } from "../utils/constants";

const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const email = useRef(null);
  const password = useRef(null);
  const name = useRef(null);
  const handleButtonClick = () => {
    const emailValue = email.current.value;
    const passwordValue = password.current.value;
    const { message } = checkValidateData(emailValue, passwordValue);
    setErrorMessage(message);

    if (message) return;

    if (!isSignInForm) {
      // signUp logic
      createUserWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;
          updateProfile(user, {
            displayName: name.current.value,
          })
            .then(() => {
              // Profile updated!
              const { uid, email, displayName } = auth.currentUser;
              dispatch(
                addUser({ uid: uid, email: email, displayName: displayName })
              );
            })
            .catch((error) => {
              // An error occurred
              setErrorMessage(error.message);
            });
        })
        .catch((error) => {
          // const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorMessage);
        });
    } else {
      // signIn logic
      signInWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          // Signed in
          // const user = userCredential.user;
        })
        .catch((error) => {
          // const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorMessage);
        });
    }
  };

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
    setErrorMessage("");
    email.current.value = "";
    password.current.value = "";
  };

  return (
    <div className="relative w-full h-screen">
      <Header />
      <div className="absolute top-0 left-0 w-full h-full">
        <img
          className="w-full h-full object-cover"
          src={BACKGROUND}
          alt="background"
        />
      </div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="absolute h-auto w-80 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/85 text-white p-8"
      >
        <h1 className="p-4 text-2xl font-bold">
          {isSignInForm ? "Sign In" : "Sign Up"}
        </h1>
        {!isSignInForm && (
          <input
            ref={name}
            className="w-full p-4 mt-2 my-4  border-2 bg-transparent border-gray-500"
            type="text"
            placeholder="Full Name"
          />
        )}
        <input
          ref={email}
          className="w-full p-4 mt-2 my-4 border-2 bg-transparent border-gray-500"
          type="text"
          placeholder="Email or Mobile number"
        />
        {errorMessage === "Email is not valid" && (
          <p className=" mx-2 mt-0 text-bold text-md text-red-500">
            {errorMessage}
          </p>
        )}
        <input
          ref={password}
          className="w-full p-4  mt-2 border-2 bg-transparent border-gray-500"
          type="password"
          placeholder="Password"
        />
        {errorMessage === "Password is not valid" && (
          <p className="text-bold text-md m-2 text-red-500">{errorMessage}</p>
        )}
        {errorMessage &&
          errorMessage !== "Email is not valid" &&
          errorMessage !== "Password is not valid" && (
            <p className="text-bold text-md m-2 text-red-500">{errorMessage}</p>
          )}
        <button
          onClick={handleButtonClick}
          className="w-full p-2  my-4 bg-red-600 text-white"
        >
          {isSignInForm ? "Sign In" : "Sign Up"}
        </button>

        <p className="inline text-gray-500">
          {isSignInForm ? "New to Netflix?" : "Already a member?"}
        </p>
        <p
          className="inline font-bold text-white cursor-pointer hover:underline"
          onClick={toggleSignInForm}
        >
          {isSignInForm ? "Sign up now." : "Sign in now."}
        </p>
      </form>
    </div>
  );
};

export default Login;
