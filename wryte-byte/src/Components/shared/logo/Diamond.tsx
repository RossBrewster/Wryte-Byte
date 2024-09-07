import React, { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';

interface DiamondProps {
  color?: string;
  maxSize?: number; // Maximum size of the diamond in pixels
  minSize?: number; // Minimum size of the diamond in pixels
  sizeUnit?: 'px' | 'em' | 'rem' | 'vw' | 'vh' | '%';
  animationPeriod?: number; // Animation period in seconds, undefined for continuous movement
}

const Diamond: React.FC<DiamondProps> = ({ 
  color = '#3498db', 
  maxSize = 300, 
  minSize = 100,
  animationPeriod
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(maxSize);
  const [isMoving, setIsMoving] = useState(true);

  const [, api] = useSpring(() => ({
    from: { x: 0, y: 0 },
    config: { tension: 120, friction: 14 },
  }));

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const containerSize = Math.min(containerWidth, containerHeight);
        const viewportSize = Math.min(viewportWidth, viewportHeight);

        const scaleFactor = Math.min(1, viewportSize / 1000);

        let newSize = containerSize * scaleFactor;
        newSize = Math.max(minSize, Math.min(newSize, maxSize));

        setSize(newSize);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [maxSize, minSize]);

  useEffect(() => {
    if (animationPeriod !== undefined) {
      const timer = setTimeout(() => setIsMoving(false), animationPeriod * 1000);
      return () => clearTimeout(timer);
    }
  }, [animationPeriod]);

  useEffect(() => {
    if (isMoving) {
      const interval = setInterval(() => {
        api.start({
          x: Math.random() * 80 - 40,
          y: Math.random() * 80 - 40,
        });
      }, 1000);
      return () => clearInterval(interval);
    } else {
      api.start({ x: 0, y: 0 });
    }
  }, [isMoving, api]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full flex justify-center items-center m-0 p-0 relative"
    >
      <animated.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d="M50 0 L100 50 L50 100 L0 50 Z"
          fill={color}
        />
      </animated.svg>
    </div>
  );
};

export default Diamond;