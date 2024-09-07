import React from 'react';
import { motion } from 'framer-motion';
import { itemVariants } from './animations';

export const SignUpInfo: React.FC = () => (
  <motion.div 
    className="bg-blue-600 p-8 flex flex-col justify-center text-white md:col-span-1 col-span-2"
    variants={itemVariants}
  >
    <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
    <p className="mb-6">Discover amazing features and connect with like-minded individuals.</p>
  </motion.div>
);