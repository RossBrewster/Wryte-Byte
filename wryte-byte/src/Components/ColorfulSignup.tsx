import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSpring, animated, config } from 'react-spring';
import ButtonGrid from './ButtonGrid';

interface IndustryCardProps {
  baseHue: number;
  title: string;
  description: string;
}

export const IndustryCard: React.FC<IndustryCardProps> = ({ baseHue, title, description }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimationReady, setIsAnimationReady] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const [springs, api] = useSpring(() => ({ 
    scale: 1,
    opacity: 0,
    y: 50,
    config: { ...config.wobbly, tension: 300, friction: 10 }
  }));

  const [hueOffset, setHueOffset] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setHueOffset((prevOffset) => (prevOffset + 1) % 360);
    }, 64);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimationReady(true);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && isAnimationReady) {
          setIsVisible(true);
        }
      },
      { threshold: 0.99999999999 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [isAnimationReady]);

  useEffect(() => {
    if (isVisible) {
      api.start({ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        config: { ...config.wobbly, tension: 300, friction: 10 }
      });
    }
  }, [isVisible, api]);

  const gradientColors = useMemo(() => {
    const hue1 = (baseHue + hueOffset) % 360;
    const hue2 = (hue1 + 15) % 360;
    const hue3 = (hue1 - 15) % 360;
    return [
      `hsl(${hue1}, 100%, 50%)`,
      `hsl(${hue2}, 100%, 50%)`,
      `hsl(${hue3}, 100%, 50%)`,
      `hsl(${hue1}, 100%, 50%)`
    ];
  }, [baseHue, hueOffset]);

  const gradientStyle = useMemo(() => ({
    backgroundImage: `linear-gradient(45deg, ${gradientColors.join(', ')})`,
    backgroundSize: '400% 400%',
    animation: 'gradient-shift 3s ease infinite',
  }), [gradientColors]);

  return (
    <>
      <div className="flex items-center justify-center bg-gray-900 p-8 cursor-pointer my-6" ref={cardRef}>
        
        <animated.div 
          className="relative w-80 group"
          style={{
            ...springs,
            transform: springs.scale.to(s => `scale(${s})`)
          }}
          onMouseEnter={() => api.start({ scale: 1.05 })}
          onMouseLeave={() => api.start({ scale: 1 })}
        >
          <div 
            className="absolute -inset-1.5 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"
            style={gradientStyle}
          ></div>
          <div className="relative px-7 py-6 bg-white rounded-xl leading-none flex flex-col">
            <div className="text-slate-900 font-semibold text-3xl mb-2 font-['Saira',_sans-serif]">
              {title}
            </div>
            <p className="text-slate-500 text-sm mb-4">
              {description}
            </p>
            <a href="#" className="text-indigo-600 font-semibold inline-flex items-center group">
              Learn more
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </animated.div>
        <ButtonGrid />
      </div>
      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </>
  );
};
