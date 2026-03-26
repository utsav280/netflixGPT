import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS } from "../utils/constants";
import { setGenreList } from "../utils/genreSlice";

const useGenres = () => {
  const dispatch = useDispatch();
  const genreList = useSelector((store) => store.genre.genreList);

  useEffect(() => {
    if (genreList.length > 0) return; // Already loaded
    const fetchGenres = async () => {
      try {
        const res = await fetch(
          "https://api.themoviedb.org/3/genre/movie/list?language=en",
          API_OPTIONS
        );
        const data = await res.json();
        dispatch(setGenreList(data.genres || []));
      } catch (err) {
        console.error("useGenres error:", err);
      }
    };
    fetchGenres();
  }, [dispatch, genreList.length]);
};

export default useGenres;
