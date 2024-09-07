import { Variants } from 'framer-motion';

export const containerVariants: Variants = {
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

export const slideVariants: Variants = {
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

export const formVariants: Variants = {
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

export const itemVariants: Variants = {
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