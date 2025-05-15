import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Bookmark, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-800">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-around py-3">
            <Link to="/" className={`flex flex-col items-center ${isActive('/') ? 'text-blue-500' : 'text-gray-400'}`}>
              <Home size={24} />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link to="/explore" className={`flex flex-col items-center ${isActive('/explore') ? 'text-blue-500' : 'text-gray-400'}`}>
              <Compass size={24} />
              <span className="text-xs mt-1">Explore</span>
            </Link>
            

            
            <Link to="/watchlist" className={`flex flex-col items-center ${isActive('/watchlist') ? 'text-blue-500' : 'text-gray-400'}`}>
              <Bookmark size={24} />
              <span className="text-xs mt-1">Watchlist</span>
            </Link>
            <Link to="/profile" className={`flex flex-col items-center ${isActive('/profile') ? 'text-blue-500' : 'text-gray-400'}`}>
              <User size={24} />
              <span className="text-xs mt-1">Profile</span>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;