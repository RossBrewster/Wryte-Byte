import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { useSignUpState } from './useSignUpState';
import { slideVariants, itemVariants } from './animations';

export const CallToAction: React.FC = () => {
  const { setIsFormVisible } = useSignUpState();

  return (
    <motion.div
      className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-gray-100 flex items-center justify-center p-8"
      variants={slideVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="text-center">
        <motion.h3 
          className="text-2xl font-bold mb-4"
          variants={itemVariants}
        >
          Ready to Get Started?
        </motion.h3>
        <motion.p 
          className="mb-6"
          variants={itemVariants}
        >
          Click the button below to sign up and join our community today!
        </motion.p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button onClick={() => setIsFormVisible(true)} className="bg-blue-500 text-white hover:bg-blue-600 transition-colors">
            Sign Up Now
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};