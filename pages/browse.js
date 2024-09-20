import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiHeart, FiInfo, FiPlus } from "react-icons/fi";
import { useRouter } from "next/router";
import toast from "react-hot-toast"; // Import toast
import { auth, db } from "../firebase"; // Import Firebase
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth"; // Auth state observer

const API_KEY = process.env.NEXT_PUBLIC_TMBD_API;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function Browse() {
  const [movies, setMovies] = useState([]);
  const [originalMovies, setOriginalMovies] = useState([]); // Original movie list
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    sortBy: "popularity.desc",
    genre: "",
  });
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null); // User state
  const router = useRouter();

  // Fetch movies with applied filters
  const fetchMovies = (reset = false) => {
    axios
      .get(`${TMDB_BASE_URL}/discover/movie`, {
        params: {
          api_key: API_KEY,
          sort_by: filters.sortBy,
          with_genres: filters.genre,
          page,
        },
      })
      .then((response) => {
        const fetchedMovies = response.data.results;
        setMovies((prevMovies) =>
          reset ? fetchedMovies : [...prevMovies, ...fetchedMovies]
        );

        // Update original movie list on reset
        if (reset) {
          setOriginalMovies(fetchedMovies);
        }
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchMovies(true); // Initial fetch
    // Listen for authentication state changes
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, [filters]);

  // Search Functionality
  const handleSearch = (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);

    if (searchQuery === "") {
      // Reset to original movies
      setMovies(originalMovies);
    } else {
      axios
        .get(`${TMDB_BASE_URL}/search/movie`, {
          params: {
            api_key: API_KEY,
            query: searchQuery,
            page: 1,
          },
        })
        .then((response) => {
          setMovies(response.data.results);
        })
        .catch((error) => console.error(error));
    }
  };

  // Load more movies
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMovies(); // Fetch next page of movies
  };

  // Function to handle adding to Firestore
  const handleAddToFirestore = async (collection, movie) => {
    if (!user) {
      toast.error("You need to log in to perform this action.");
      return;
    }

    const docRef = doc(db, collection, `${user.uid}_${movie.id}`);

    try {
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        toast.error(
          `${movie.title} is already in your ${
            collection === "movieList" ? "Watch List" : "Favorites"
          }!`
        );
        return;
      }

      await setDoc(docRef, {
        userId: user.uid,
        movieId: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        addedAt: new Date(),
      });
      toast.success(
        `${movie.title} added to your ${
          collection === "movieList" ? "Watch List" : "Favorites"
        }!`
      );
    } catch (error) {
      toast.error("Failed to add movie. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="pt-6 pl-80 pr-12">
      {/* Search Bar */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search for a movie..."
          className="bg-gray-800 text-white py-2 px-4 rounded-lg w-full"
        />
      </div>

      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        <select
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          className="bg-gray-800 text-white py-2 px-4 rounded-lg"
        >
          <option value="popularity.desc">Popularity Descending</option>
          <option value="popularity.asc">Popularity Ascending</option>
          <option value="release_date.desc">Release Date Descending</option>
          <option value="release_date.asc">Release Date Ascending</option>
          <option value="vote_average.desc">Rating Descending</option>
        </select>
        <select
          onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
          className="bg-gray-800 text-white py-2 px-4 rounded-lg"
        >
          <option value="">All Genres</option>
          <option value="28">Action</option>
          <option value="35">Comedy</option>
          <option value="12">Adventure</option>
          <option value="16">Animation</option>
        </select>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="relative group">
            <img
              src={`${IMAGE_BASE_URL}${movie.poster_path}`}
              alt={movie.title}
              className="w-full rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
              <button
                className="text-white text-2xl bg-purple-500 p-2 rounded"
                onClick={() => handleAddToFirestore("movieList", movie)}
              >
                <FiPlus />
              </button>
              <button
                className="text-white text-2xl bg-purple-500 p-2 rounded"
                onClick={() => handleAddToFirestore("favoriteList", movie)}
              >
                <FiHeart />
              </button>
              <button
                className="text-white text-2xl bg-purple-500 p-2 rounded"
                onClick={() => router.push(`/movie/${movie.id}`)}
              >
                <FiInfo />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleLoadMore}
          className="bg-purple-500 text-white py-2 px-6 rounded-lg"
        >
          Load More
        </button>
      </div>
    </div>
  );
}
