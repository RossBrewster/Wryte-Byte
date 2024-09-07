import React from 'react';
import { motion } from 'framer-motion';
import { slideVariants, itemVariants } from './animations';

export const SuccessMessage: React.FC = () => (
  <motion.div
    className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-green-100 flex items-center justify-center p-8"
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
        Thank You!
      </motion.h3>
      <motion.p
        variants={itemVariants}
      >
        We've received your information and will be in touch soon.
      </motion.p>
    </div>
  </motion.div>
);