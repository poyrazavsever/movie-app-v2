import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { FiStar } from 'react-icons/fi';
import { FaPlay } from 'react-icons/fa';
import ReactPlayer from 'react-player';

const API_KEY = process.env.NEXT_PUBLIC_TMBD_API;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BANNER_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

export default function MovieDetail() {
  const [movieDetails, setMovieDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      // Fetch movie details and trailer
      axios
        .get(`${TMDB_BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos`)
        .then((response) => {
          setMovieDetails(response.data);
          setCast(response.data.credits.cast);
          
          // Find the trailer from the videos response
          const trailerVideo = response.data.videos.results.find(
            (video) => video.type === 'Trailer' && video.site === 'YouTube'
          );
          setTrailer(trailerVideo ? trailerVideo.key : null);
        })
        .catch((error) => console.error(error));
    }
  }, [id]);

  if (!movieDetails) return <div>Loading...</div>;

  return (
    <div className="pt-6 pl-80 pr-12">
      {/* Movie Header */}
      <div className="flex flex-col md:flex-row mb-12">
        {/* Movie Image */}
        <img
          src={`${BANNER_IMAGE_BASE_URL}${movieDetails.backdrop_path}`}
          alt={movieDetails.title}
          className="w-full md:w-1/3 rounded-lg shadow-lg"
        />

        {/* Movie Info */}
        <div className="md:ml-8 mt-8 md:mt-0 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl text-white font-bold">{movieDetails.title}</h1>
            <p className="text-gray-400 text-lg">{movieDetails.genres.map(genre => genre.name).join(', ')}</p>
            <p className="text-purple-500 font-semibold">Released on: {movieDetails.release_date}</p>
          </div>

          <div className="mt-6">
            {/* Rating */}
            <div className="flex items-center">
              <FiStar className="text-yellow-500" size={24} />
              <span className="ml-2 text-white text-lg">{movieDetails.vote_average}/10</span>
            </div>

            {/* Platforms (assuming available platforms are listed under `release_dates` or `providers`) */}
            <div className="mt-4">
              <h3 className="text-xl text-white">Available on:</h3>
              <p className="text-gray-400">Netflix, Disney+, Amazon Prime</p>
            </div>

            {/* Movie Overview */}
            <div className="mt-6">
              <h3 className="text-xl text-white">Overview</h3>
              <p className="text-gray-300">{movieDetails.overview}</p>
            </div>
          </div>

          {/* Trailer Button */}
          {trailer && (
            <button
              onClick={() => setIsTrailerOpen(true)}
              className="mt-6 w-fit bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <FaPlay className="mr-2" /> Watch Trailer
            </button>
          )}
        </div>
      </div>

      {/* Cast Section */}
      <div>
        <h2 className="text-3xl text-white font-bold mb-4">Cast</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {cast.slice(0, 8).map((actor) => (
            <div key={actor.id} className="flex flex-col items-center text-center">
              <img
                src={`${IMAGE_BASE_URL}${actor.profile_path}`}
                alt={actor.name}
                className="w-32 h-32 object-cover rounded-full"
              />
              <h4 className="text-lg text-white mt-4">{actor.name}</h4>
              <p className="text-gray-400 text-sm">as {actor.character}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trailer Modal */}
      {isTrailerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-neutral-900 p-6 rounded-xl relative w-full max-w-4xl">
            <button
              className="absolute top-2 right-2 text-white text-2xl"
              onClick={() => setIsTrailerOpen(false)}
            >
              &times;
            </button>
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${trailer}`}
              controls
              width="100%"
              height="80vh"
            />
          </div>
        </div>
      )}
    </div>
  );
}
