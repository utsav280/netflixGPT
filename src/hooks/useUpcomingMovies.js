/* eslint-disable react-hooks/exhaustive-deps */
import { URL_UPCOMING, API_OPTIONS } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUpcomingMovies } from "../utils/movieSlice";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const useUpcomingMovies = () => {
  const dispatch = useDispatch();

  const upcomingMovies = useSelector((store) => store.movies.upcomingMovies);

  const getUpcomingMovies = async () => {
    const data = await fetch(URL_UPCOMING, API_OPTIONS);
    const json = await data.json();
    dispatch(addUpcomingMovies(json.results));
  };

  useEffect(() => {
    if (!upcomingMovies) getUpcomingMovies();
  }, []);
};

export default useUpcomingMovies;
