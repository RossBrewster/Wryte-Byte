import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants, useAnimation } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface FormData {
  name: string;
  email: string;
}

const DynamicSignUp: React.FC = () => {
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '' });
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    const readyTimer = setTimeout(() => {
      setIsReady(true);
    }, 3000); // 15 seconds delay

    return () => clearTimeout(readyTimer);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          controls.start('visible');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 } // Trigger when 10% of the element is visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [controls, isReady]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const toggleForm = (): void => {
    if (isFormVisible) {
      setIsSubmitted(true);
    } else {
      setIsFormVisible(true);
    }
  };

  const containerVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 15,
        when: 'beforeChildren',
        staggerChildren: 0.1
      }
    }
  };

  const slideVariants: Variants = {
    hidden: { x: '100%' },
    visible: { 
      x: '0%',
      transition: { 
        type: 'spring',
        stiffness: 120,
        damping: 20
      }
    },
    exit: { 
      x: '-100%',
      transition: { 
        type: 'spring',
        stiffness: 120,
        damping: 20
      }
    }
  };

  const formVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <motion.div 
      ref={containerRef}
      className="w-full max-w-4xl mx-auto pb-40"
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      {isReady && (
        <div className="relative overflow-hidden rounded-lg shadow-lg">
          <div className="grid grid-cols-2 h-96">
            <motion.div 
              className="bg-blue-600 p-8 flex flex-col justify-center text-white"
              variants={itemVariants}
            >
              <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
              <p className="mb-6">Discover amazing features and connect with like-minded individuals.</p>
            </motion.div>

            <div className="bg-white p-8 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {isFormVisible && !isSubmitted && (
                  <motion.form 
                    onSubmit={handleSubmit}
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <motion.div variants={itemVariants}>
                      <Input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        className="mb-4"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <Input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        className="mb-4"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <Button type="submit" className="w-full">Submit</Button>
                    </motion.div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isFormVisible && (
              <motion.div
                className="absolute top-0 right-0 w-1/2 h-full bg-gray-100 flex items-center justify-center p-8"
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
                    <Button onClick={toggleForm} className="bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                      Sign Up Now
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isSubmitted && (
              <motion.div
                className="absolute top-0 right-0 w-1/2 h-full bg-green-100 flex items-center justify-center p-8"
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
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default DynamicSignUp;