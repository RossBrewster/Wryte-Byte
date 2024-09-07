import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignUpProvider, useSignUpState } from './useSignUpState';
import { containerVariants } from './animations';
import { SignUpInfo } from './SignUpInfo';
import { SignUpForm } from './SignUpForm';
import { SuccessMessage } from './SuccessMessage';
import { CallToAction } from './CallToAction';

const DynamicSignUpContent: React.FC = () => {
  const { isFormVisible, isSubmitted } = useSignUpState();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isTimeoutComplete, setIsTimeoutComplete] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Timeout complete');
      setIsTimeoutComplete(true);
      
      if (ref.current) {
        observer.observe(ref.current);
      }
      
    }, 6700); // Adjust this value as needed
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          console.log('Component is 10% visible');
          setIsScrolled(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: .5 } // 10% visibility threshold
    );
    

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
      clearTimeout(timer);
    };
  }, []);

  const isReady = isScrolled && isTimeoutComplete;

  return (
    <motion.div 
      ref={ref}
      className={`w-full max-w-4xl mx-auto pb-40 ${!isReady ? 'invisible' : 'visible'}`}
      variants={containerVariants}
      initial="hidden"
      animate={isReady ? "visible" : "hidden"}
    >
      <div className="relative overflow-hidden rounded-lg shadow-lg">
        <div className="grid md:grid-cols-2 grid-cols-1 md:h-96">
          <SignUpInfo />
          <div className="bg-white p-8 flex flex-col justify-center md:col-span-1 col-span-2">
            <AnimatePresence mode="wait">
              {isFormVisible && !isSubmitted && <SignUpForm />}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isFormVisible && <CallToAction />}
          {isSubmitted && <SuccessMessage />}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export const DynamicSignUp: React.FC = () => (
  <SignUpProvider>
    <DynamicSignUpContent />
  </SignUpProvider>
);

export default DynamicSignUp;