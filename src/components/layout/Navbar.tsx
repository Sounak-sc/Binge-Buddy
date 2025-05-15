import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Film, Bookmark, Menu, X, Mic, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        navigate(`/search?q=${encodeURIComponent(transcript.trim())}`);
      };

      recognition.start();
    }
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900/95 backdrop-blur-sm shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
            <Film className="text-blue-500" />
            <span className="hidden sm:inline">BingeBuddy</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
            <Link to="/explore" className="hover:text-blue-400 transition-colors">Explore</Link>
            <Link to="/watchlist" className="hover:text-blue-400 transition-colors">Watchlist</Link>
            <Link to="/profile" className="hover:text-blue-400 transition-colors">Profile</Link>
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800 rounded-full py-2 pl-4 pr-20 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleVoiceSearch}
                  className={`p-1 rounded-full ${isListening ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}
                >
                  <Mic size={18} />
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  type="submit" 
                  className="text-gray-400 hover:text-white"
                >
                  <Search size={18} />
                </motion.button>
              </div>
            </form>
          </div>

          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-gray-900 shadow-lg"
          >
            <div className="container mx-auto px-4 py-4">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search movies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-800 rounded-full py-2 pl-4 pr-20 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={handleVoiceSearch}
                      className={`p-1 rounded-full ${isListening ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}
                    >
                      <Mic size={18} />
                    </motion.button>
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      type="submit" 
                      className="text-gray-400 hover:text-white"
                    >
                      <Search size={18} />
                    </motion.button>
                  </div>
                </div>
              </form>

              <nav className="flex flex-col space-y-4">
                <Link to="/" className="py-2 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <Film size={20} />
                  Home
                </Link>
                <Link to="/explore" className="py-2 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <Search size={20} />
                  Explore
                </Link>
                <Link to="/watchlist" className="py-2 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <Bookmark size={20} />
                  Watchlist
                </Link>
                <Link to="/profile" className="py-2 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <User size={20} />
                  Profile
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;