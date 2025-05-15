import React from 'react';
import { Film, Github, Twitter, Instagram } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Footer: React.FC = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <footer className={`${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'} border-t transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 text-2xl font-bold mb-4">
              <Film className="text-blue-500" />
              <span>BingeBuddy</span>
            </div>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              Discover, explore, and enjoy the best movies from around the world. Your personal movie recommendation engine.
            </p>
            <div className="flex space-x-4">
              <a href="#" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                <Twitter size={20} />
              </a>
              <a href="#" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                <Instagram size={20} />
              </a>
              <a href="#" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                <Github size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><a href="#" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Popular Movies</a></li>
              <li><a href="#" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Top Rated</a></li>
              <li><a href="#" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Upcoming Releases</a></li>
              <li><a href="#" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Now Playing</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Genres</h3>
            <ul className="space-y-2">
              <li><a href="#" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Action</a></li>
              <li><a href="#" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Comedy</a></li>
              <li><a href="#" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Drama</a></li>
              <li><a href="#" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Science Fiction</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Privacy Policy</a></li>
              <li><a href="#" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Terms of Service</a></li>
              <li><a href="#" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Cookie Policy</a></li>
              <li><a href="#" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>DMCA</a></li>
            </ul>
          </div>
        </div>
        
        <div className={`border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} mt-8 pt-8 text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
          <p>
            This product uses the TMDB API but is not endorsed or certified by TMDB. All movie data and images are provided by The Movie Database (TMDB).
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} BingeBuddy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;