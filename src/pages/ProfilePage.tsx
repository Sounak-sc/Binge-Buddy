import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMovieContext } from '../context/MovieContext';
import { Edit2, Save, Bell, Moon, Shield, LogOut } from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  if (hour < 21) return 'Good Evening';
  return 'Good Night';
};

const movieQuotes = [
  "Here's looking at you, kid. - Casablanca",
  "May the Force be with you. - Star Wars",
  "Life is like a box of chocolates. - Forrest Gump",
  "To infinity and beyond! - Toy Story",
  "Carpe diem. Seize the day. - Dead Poets Society",
  "Just keep swimming. - Finding Nemo",
  "Hakuna Matata! - The Lion King",
  "There's no place like home. - The Wizard of Oz",
];

const ProfilePage = () => {
  const { userProfile, updateUserProfile, watchlist } = useMovieContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [randomQuote] = useState(movieQuotes[Math.floor(Math.random() * movieQuotes.length)]);

  const handleSave = () => {
    updateUserProfile(editedProfile);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/sign-in');
  };

  const togglePreference = (key: 'darkMode' | 'notifications') => {
    updateUserProfile({
      preferences: {
        ...userProfile.preferences,
        [key]: !userProfile.preferences[key]
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-24 md:py-32"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl p-8 mb-8 text-white"
        >
          <h2 className="text-3xl font-bold mb-2">{getTimeBasedGreeting()}, {user?.firstName || 'Friend'}!</h2>
          <p className="text-blue-100 italic">{randomQuote}</p>
        </motion.div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Profile</h1>
          <div className="flex gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full transition-colors"
            >
              <LogOut size={18} />
              Logout
            </motion.button>

          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <img
                src={user?.imageUrl || 'https://via.placeholder.com/100'}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-2">{user?.fullName}</h2>
              <p className="text-gray-400">{user?.primaryEmailAddress?.emailAddress}</p>
              <p className="text-gray-400">
                Member since {new Date(user?.createdAt || userProfile.joinDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-700 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold">{watchlist.length}</p>
              <p className="text-sm text-gray-400">Watchlist</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-gray-400">Reviews</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-gray-400">Lists</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Preferences</h3>
            
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-xl">
              <div className="flex items-center gap-3">
                <Bell size={20} />
                <span>Notifications</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => togglePreference('notifications')}
                className={`w-12 h-6 rounded-full relative ${
                  userProfile.preferences.notifications ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-all ${
                    userProfile.preferences.notifications ? 'right-0.5' : 'left-0.5'
                  }`}
                />
              </motion.button>
            </div>



            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-xl">
              <div className="flex items-center gap-3">
                <Shield size={20} />
                <span>Privacy Settings</span>
              </div>
              <button className="text-blue-400 hover:text-blue-300">
                Manage
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;