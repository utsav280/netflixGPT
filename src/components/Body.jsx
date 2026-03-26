import React, { Suspense, lazy } from "react";
import Login from "./Login";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const Browse = lazy(() => import("./Browse"));
const ProfilePage = lazy(() => import("./ProfilePage"));
const PersonPage = lazy(() => import("./PersonPage"));

const Body = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/browse",
      element: <Browse />,
    },
    {
      path: "/profile",
      element: <ProfilePage />,
    },
    {
      path: "/person/:id",
      element: <PersonPage />,
    },
  ]);

  return (
    <div>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#141414] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <RouterProvider router={appRouter} />
      </Suspense>
    </div>
  );
};

export default Body;
