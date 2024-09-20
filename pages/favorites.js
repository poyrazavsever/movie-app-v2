import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // Import Firebase
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast'; // Import toast
import { FiTrash, FiInfo } from 'react-icons/fi';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null); // User state
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        toast.error("You must log in to access this feature");
        router.push('/');
      }
    });

    return () => unsubscribe(); // Clean up subscription
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const q = query(collection(db, 'favoriteList'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const movies = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFavorites(movies);
      } else {
        setFavorites([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'favoriteList', id));
      setFavorites(favorites.filter(movie => movie.id !== id));
      toast.success('Movie removed from your Favorites!');
    } catch (error) {
      toast.error('Failed to remove movie. Please try again.');
      console.error(error);
    }
  };

  const goToDetails = (movieId) => {
    router.push(`/movie/${movieId}`);
  };

  return (
    <div className="pt-6 pl-80 pr-12">
      <h2 className="text-2xl font-bold text-white mb-4">Your Favorites</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {favorites.map((movie) => (
          <div key={movie.id} className="relative group">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
              <button
                className="text-white text-2xl bg-purple-500 p-2 rounded"
                onClick={() => handleDelete(movie.id)}
              >
                <FiTrash />
              </button>
              <button
                className="text-white text-2xl bg-purple-500 p-2 rounded"
                onClick={() => goToDetails(movie.movieId)}
              >
                <FiInfo />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
