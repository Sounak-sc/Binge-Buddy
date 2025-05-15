import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import SearchResultsPage from './pages/SearchResultsPage';
import WatchlistPage from './pages/WatchlistPage';
import ExplorePage from './pages/ExplorePage';
import ProfilePage from './pages/ProfilePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';
import Footer from './components/layout/Footer';
import { MovieProvider } from './context/MovieContext';
import { ThemeProvider } from './context/ThemeContext';
import { AnimatePresence } from 'framer-motion';

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <ThemeProvider>
        <MovieProvider>
          <Router>
            <SignedIn>
              <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
                <Navbar />
                <main className="flex-grow pb-20 md:pb-0">
                  <AnimatePresence mode="wait">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/movie/:id" element={<MovieDetailsPage />} />
                      <Route path="/search" element={<SearchResultsPage />} />
                      <Route path="/watchlist" element={<WatchlistPage />} />
                      <Route path="/explore" element={<ExplorePage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </AnimatePresence>
                </main>
                <BottomNav />
                <Footer />
              </div>
            </SignedIn>
            
            <SignedOut>
              <Routes>
                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />
                <Route path="*" element={<Navigate to="/sign-in" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </SignedOut>
          </Router>
        </MovieProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default App;