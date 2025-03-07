import { API_OPTIONS } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addTrailer } from "../utils/movieSlice";
import { useEffect } from "react";

const useMovieTrailer = (movieId) => {
  const dispatch = useDispatch();

  // console.log(trailerVideo);
  const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`;

  const getMovieTrailer = async () => {
    const data = await fetch(url, API_OPTIONS);
    const json = await data.json();
    // console.log(json);

    const filterData = json.results.filter((video) => video.type === "Trailer");
    const trailer = filterData.length ? filterData[0] : json.results[0];
    // console.log(trailer);
    dispatch(addTrailer(trailer));
  };

  useEffect(() => {
    getMovieTrailer();
  }, []);
};
export default useMovieTrailer;
