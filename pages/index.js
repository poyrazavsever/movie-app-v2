import { useState, useEffect } from "react";
import axios from "axios";
import {
  FiSearch,
  FiArrowRight,
  FiArrowLeft,
  FiPlus,
  FiHeart,
  FiInfo,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import toast from "react-hot-toast"; // Import toast
import { auth, db } from "../firebase"; // Import Firebase
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth"; // Auth state observer

const API_KEY = process.env.NEXT_PUBLIC_TMBD_API;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BANNER_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

export default function Home() {
  const [banners, setBanners] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselOffset, setCarouselOffset] = useState(0);
  const [user, setUser] = useState(null); // User state
  const router = useRouter();

  const cardWidth = 250;
  const gap = 20;

  useEffect(() => {
    axios
      .get(`${TMDB_BASE_URL}/movie/now_playing?api_key=${API_KEY}`)
      .then((response) => setBanners(response.data.results))
      .catch((error) => console.error(error));

    axios
      .get(`${TMDB_BASE_URL}/movie/popular?api_key=${API_KEY}`)
      .then((response) => setPopularMovies(response.data.results))
      .catch((error) => console.error(error));

    // Listen for authentication state changes
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);

  const handleNext = () => {
    setCarouselOffset((prevOffset) => prevOffset - (cardWidth + gap));
  };

  const handlePrev = () => {
    setCarouselOffset((prevOffset) => prevOffset + (cardWidth + gap));
  };

  const goToDetails = (id) => {
    router.push(`/movie/${id}`);
  };

  // Function to handle adding to Firestore
  // Function to handle adding to Firestore
  const handleAddToFirestore = async (collection, movie) => {
    if (!user) {
      toast.error("You need to log in to perform this action.");
      return;
    }

    const docRef = doc(db, collection, `${user.uid}_${movie.id}`);

    try {
      // Check if the document already exists
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
    <div className="pl-80 pr-12">
      <div className="relative w-full h-[40vh] overflow-hidden">
        {banners.length > 0 && (
          <img
            src={`${BANNER_IMAGE_BASE_URL}${banners[currentSlide].backdrop_path}`}
            alt={`Slide ${currentSlide}`}
            className="w-full h-full object-cover transition-opacity opacity-30 duration-1000"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-50">
          <div className="flex flex-col justify-center items-start px-12 h-full">
            <h1 className="text-4xl text-white font-bold mb-4">
              Welcome to <span className="text-neutral-200">Ohrama</span>
              <span className="text-purple-700 text-7xl">.</span>
            </h1>
            <p className="text-white text-lg mb-8">
              Plan what you will watch. Watch more, watch more regularly. Wait
              for everything in its turn. See what your friends are watching.
              Follow the most popular movies and series, add to your list. "Just
              watch!"
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-white mb-6">Trending Movies</h2>
        <div className="relative overflow-hidden">
          {carouselOffset < 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 z-10"
            >
              <FiArrowLeft size={24} />
            </button>
          )}

          <motion.div
            className="flex"
            animate={{ x: carouselOffset }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {popularMovies.map((movie) => (
              <motion.div
                key={movie.id}
                className="w-64 h-80 mx-2 flex-shrink-0 relative group"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <img
                  src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover rounded-lg"
                />
                <h3 className="text-white text-lg text-center mt-2">
                  {movie.title}
                </h3>

                <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    title="Add to your watch list"
                    className="p-1 bg-purple-600 text-white rounded-full hover:bg-purple-700"
                    onClick={() => handleAddToFirestore("movieList", movie)}
                  >
                    <FiPlus size={20} />
                  </button>
                  <button
                    title="Add to your favorites"
                    className="p-1 bg-purple-600 text-white rounded-full hover:bg-purple-700"
                    onClick={() => handleAddToFirestore("favoriteList", movie)}
                  >
                    <FiHeart size={20} />
                  </button>
                  <button
                    title="View details"
                    onClick={() => goToDetails(movie.id)}
                    className="p-1 bg-purple-600 text-white rounded-full hover:bg-purple-700"
                  >
                    <FiInfo size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {carouselOffset > -(cardWidth + gap) * (popularMovies.length - 4) && (
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 z-10"
            >
              <FiArrowRight size={24} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
