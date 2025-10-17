// LogoAnimation.js
import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

const LogoAnimation = () => {
  return (
    <motion.div
      className="flex items-center justify-center gap-2 text-indigo-600"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        animate={{ rotate: [0, 20, -20, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <Brain size={32} />
      </motion.div>
      <motion.h1
        className="text-2xl font-bold tracking-wide"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        Campus AI
      </motion.h1>
    </motion.div>
  );
};

export default LogoAnimation;
