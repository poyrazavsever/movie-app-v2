import { useState, useEffect } from 'react';
import { FiSearch, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Slider için örnek görseller
const sliderImages = [
  '/Images/slider1.png',
  '/Images/slider2.png',
  '/Images/slider3.png',
];

const trendingMovies = [
  { title: 'Movie 1', image: '/Images/movie1.jpg' },
  { title: 'Movie 2', image: '/Images/movie2.jpg' },
  { title: 'Movie 3', image: '/Images/movie1.jpg' },
  { title: 'Movie 4', image: '/Images/movie1.jpg' },
  { title: 'Movie 5', image: '/Images/movie2.jpg' },
  { title: 'Movie 6', image: '/Images/movie1.jpg' },
  { title: 'Movie 7', image: '/Images/movie1.jpg' },
  { title: 'Movie 8', image: '/Images/movie1.jpg' },
  { title: 'Movie 9', image: '/Images/movie1.jpg' },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselOffset, setCarouselOffset] = useState(0);

  const cardWidth = 250; // Film kartlarının genişliği
  const gap = 20; // Kartlar arasındaki boşluk

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % sliderImages.length);
    }, 5000); // 5 saniyede bir otomatik geçiş
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    // Sağ butona tıklandığında, film kartları sağa doğru kayar
    setCarouselOffset((prevOffset) => prevOffset - (cardWidth + gap));
  };

  const handlePrev = () => {
    // Sol butona tıklandığında, film kartları sola doğru kayar
    setCarouselOffset((prevOffset) => prevOffset + (cardWidth + gap));
  };

  return (
    <div className="pl-80 pr-12">
      {/* Background Slider */}
      <div className="relative w-full h-[40vh] overflow-hidden">
        <img
          src={sliderImages[currentSlide]}
          alt={`Slide ${currentSlide}`}
          className="w-full h-full object-cover transition-opacity opacity-30 duration-1000"
        />
        {/* Title, text, and search input overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
          <h1 className="text-4xl text-white font-bold mb-4">
            Welcome to <span className='text-neutral-200'>Ohrama</span><span className='text-purple-700 text-7xl'>.</span>
          </h1>
          <p className="text-white text-lg mb-8">Find your favorite movies and series</p>
          <div className="relative w-3/4 md:w-1/2">
            <input
              type="text"
              placeholder="Search for a movie..."
              className="w-full p-4 pl-12 rounded bg-neutral-800 text-white placeholder-neutral-400 focus-within:outline-purple-800"
            />
            <FiSearch className="absolute left-4 top-4 text-white" size={24} />
          </div>
        </div>
      </div>

      {/* Trending Movies Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-white mb-6">Trending Movies</h2>
        <div className="relative overflow-hidden">
          {/* Sol Buton */}
          {carouselOffset < 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 z-10"
            >
              <FiArrowLeft size={24} />
            </button>
          )}

          {/* Film Slider */}
          <motion.div
            className="flex"
            animate={{ x: carouselOffset }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            {trendingMovies.map((movie, index) => (
              <motion.div
                key={index}
                className="w-64 h-80 mx-2 flex-shrink-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-full object-cover rounded-lg"
                />
                <h3 className="text-white text-lg text-center mt-2">{movie.title}</h3>
              </motion.div>
            ))}
          </motion.div>

          {/* Sağ Buton */}
          {carouselOffset > -(cardWidth + gap) * (trendingMovies.length - 4) && (
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
