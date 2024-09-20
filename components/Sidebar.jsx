import React, { useEffect, useState } from 'react';
import { FiHome, FiSearch, FiBookmark, FiHeart, FiStar, FiSettings, FiLogOut } from 'react-icons/fi';
import Link from 'next/link'; // Next.js'in Link bileşeni
import { onAuthStateChanged, signOut } from 'firebase/auth'; // Firebase'den Auth modülü
import { auth } from '@/firebase';

function Sidebar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Kullanıcı giriş yapma durumu

  useEffect(() => {
    // Firebase ile oturum durumunu dinle
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Kullanıcı giriş yaptıysa
        setIsAuthenticated(true);
      } else {
        // Kullanıcı giriş yapmadıysa
        setIsAuthenticated(false);
      }
    });

    // Bileşen unmount olduğunda dinleyiciyi temizle
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase'den çıkış yap
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-neutral-950 border-r border-neutral-700 text-white flex flex-col items-start p-6">
      {/* Logo */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-wide">
          Ohrama<span className="text-purple-500">.</span>
        </h1>
      </div>

      {/* Menu */}
      <div className="w-full">
        <p className="text-gray-400 uppercase text-sm mb-4">Menu</p>
        <ul className="space-y-4">
          <li className="flex items-center space-x-4 hover:text-purple-500">
            <FiHome size={20} />
            <Link href="/home">Home</Link>
          </li>
          <li className="flex items-center space-x-4 hover:text-purple-500">
            <FiSearch size={20} />
            <Link href="/browse">Browse</Link>
          </li>
          <li className="flex items-center space-x-4 hover:text-purple-500">
            <FiBookmark size={20} />
            <Link href="/watch-list">Watch List</Link>
          </li>
          <li className="flex items-center space-x-4 hover:text-purple-500">
            <FiHeart size={20} />
            <Link href="/favorites">Favorites</Link>
          </li>
        </ul>
      </div>

      {/* Other */}
      <div className="mt-10 w-full">
        <p className="text-gray-400 uppercase text-sm mb-4">Other</p>
        <ul className="space-y-4">
          <li className="flex items-center space-x-4 hover:text-purple-500">
            <FiStar size={20} />
            <Link href="/soon">Soon</Link>
          </li>
        </ul>
      </div>

      {/* Authenticated Section */}
      <div className="mt-10 w-full">
        <p className="text-gray-400 uppercase text-sm mb-4">General</p>
        <ul className="space-y-4">
          {isAuthenticated ? (
            <>
              <li className="flex items-center space-x-4 hover:text-purple-500">
                <FiSettings size={20} />
                <Link href="/settings">Settings</Link>
              </li>
              <li className="flex items-center space-x-4">
                <FiLogOut size={20} />
                <button
                  className="text-left hover:text-purple-500"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </li>
            </>
          ) : (
            <li className="flex items-center space-x-4 hover:text-purple-500">
              <FiLogOut size={20} />
              <Link href="/login">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
