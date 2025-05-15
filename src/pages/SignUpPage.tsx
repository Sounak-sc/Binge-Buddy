import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Film } from 'lucide-react';

const SignUpPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 text-3xl font-bold mb-4">
            <Film className="text-blue-500" size={32} />
            <span>BingeBuddy</span>
          </div>
          <p className="text-gray-400">Create an account to start your movie journey</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800 p-8 rounded-xl shadow-xl"
        >
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
                card: 'bg-transparent shadow-none',
                headerTitle: 'text-white',
                headerSubtitle: 'text-gray-400',
                socialButtonsBlockButton: 'bg-gray-700 hover:bg-gray-600 border-gray-600',
                socialButtonsBlockButtonText: 'text-white',
                formFieldInput: 'bg-gray-700 border-gray-600 text-white',
                formFieldLabel: 'text-gray-300',
                footerActionLink: 'text-blue-400 hover:text-blue-300',
              },
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default SignUpPage;