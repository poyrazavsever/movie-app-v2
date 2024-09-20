import React, { useEffect, useState } from 'react';
import { FiHome, FiSearch, FiBookmark, FiHeart, FiStar, FiSettings, FiLogOut, FiChevronDown, FiSun, FiMoon } from 'react-icons/fi';
import Link from 'next/link'; 
import { onAuthStateChanged, signOut } from 'firebase/auth'; 
import { auth } from '@/firebase';
import { useRouter } from 'next/router';

function Sidebar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [language, setLanguage] = useState("English");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    // Additional logic to apply dark/light mode styles can be added here
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setIsDropdownOpen(false);
  };

  const linkClassName = (path) => 
    `flex items-center space-x-4 hover:text-purple-500 ${router.pathname === path ? 'text-purple-500' : ''}`;

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-neutral-950 border-r border-neutral-700 text-white flex flex-col items-start p-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-wide">
          Ohrama<span className="text-purple-500">.</span>
        </h1>
      </div>

      <div className="w-full">
        <p className="text-gray-400 uppercase text-sm mb-4">Menu</p>
        <ul className="space-y-4">
          <li className={linkClassName("/")}>
            <FiHome size={20} />
            <Link href="/">Home</Link>
          </li>
          <li className={linkClassName("/browse")}>
            <FiSearch size={20} />
            <Link href="/browse">Browse</Link>
          </li>
          <li className={linkClassName("/watch-list")}>
            <FiBookmark size={20} />
            <Link href="/watch-list">Watch List</Link>
          </li>
          <li className={linkClassName("/favorites")}>
            <FiHeart size={20} />
            <Link href="/favorites">Favorites</Link>
          </li>
        </ul>
      </div>

      <div className="mt-10 w-full">
        <p className="text-gray-400 uppercase text-sm mb-4">Other</p>
        <ul className="space-y-4">
          <li className={linkClassName("/soon")}>
            <FiStar size={20} />
            <Link href="/soon">Soon</Link>
          </li>
        </ul>
      </div>

      <div className="mt-10 w-full">
        <p className="text-gray-400 uppercase text-sm mb-4">General</p>
        <ul className="space-y-4">
          {isAuthenticated ? (
            <>
              <li className={linkClassName("/settings")}>
                <FiSettings size={20} />
                <Link href="/settings">Settings</Link>
              </li>
              <li className="flex items-center space-x-4 hover:text-purple-500">
                <FiLogOut size={20} />
                <button
                  className="text-left"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </li>
            </>
          ) : (
            <li className={linkClassName("/login")}>
              <FiLogOut size={20} />
              <Link href="/login">Login</Link>
            </li>
          )}
        </ul>
      </div>

      {/* Language Dropdown and Dark/Light Mode Toggle */}
      <div className="mt-4 w-full">
        <div className="relative mb-4">
          <button
            className="flex items-center p-2 bg-neutral-800 rounded hover:bg-neutral-700 w-full justify-between"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          >
            {language} <FiChevronDown size={16} className="ml-1" />
          </button>
          {isDropdownOpen && (
            <ul className="absolute left-0 w-full bg-neutral-800 border border-neutral-700 rounded mt-1">
              <li className="p-2 hover:bg-neutral-700 cursor-pointer" onClick={() => handleLanguageChange("English")}>English</li>
              <li className="p-2 hover:bg-neutral-700 cursor-pointer" onClick={() => handleLanguageChange("Turkish")}>Turkish</li>
              {/* Add more languages here */}
            </ul>
          )}
        </div>
        <button
          className="flex items-center p-2 bg-neutral-800 rounded hover:bg-neutral-700 w-full"
          onClick={toggleDarkMode}
        >
          {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          <span className="ml-2">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
