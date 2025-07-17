import React from "react";
import { motion } from "motion/react";
import Loader from "./Loader";

const Splash: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        </div>
        
        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-20 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-32 right-32 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"
          animate={{
            y: [0, 30, 0],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-10 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Logo/Brand Section */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <motion.svg 
              className="w-12 h-12 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              animate={{ 
                rotateY: [0, 360],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </motion.svg>
          </div>
          
          <motion.h1 
            className="text-4xl font-bold text-white mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            ChainDrive
          </motion.h1>
          
          <motion.p 
            className="text-xl text-purple-200"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            Decentralized Car Rental Platform
          </motion.p>
        </motion.div>

        {/* Loading Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="space-y-6"
        >
          {/* Enhanced Loader */}
          <div className="flex justify-center">
            <div className="relative">
              <Loader size="xl" variant="spinner" color="text-blue-400" />
              <motion.div
                className="absolute inset-0 w-12 h-12 border-2 border-purple-500/30 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>

          {/* Loading Text with Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <p className="text-lg text-white font-medium mb-2">
              Preparing Your Experience
            </p>
            <motion.p 
              className="text-sm text-purple-200"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Connecting to blockchain network...
            </motion.p>
          </motion.div>

          {/* Progress Dots */}
          <div className="flex justify-center space-x-2">
            <Loader size="sm" variant="dots" color="text-blue-400" />
          </div>
        </motion.div>

        {/* Bottom Elements */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="mt-12"
        >
          <div className="flex items-center justify-center space-x-6 text-purple-300 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>Decentralized</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>Trusted</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Splash;
