import React, { useState, useEffect, useMemo } from 'react';
import { useSpring, animated, config } from 'react-spring';

const services = [
  {
    title: "Comprehension Accessibility Analyzer",
    description: "Helps students write at appropriate reading levels."
  },
  {
    title: "Abstract Synthesis Coach",
    description: "Guides students in distilling key information from texts."
  },
  {
    title: "Inquiry-Based Research Companion",
    description: "Facilitates the research process using guided inquiry."
  },
  {
    title: "Structural Organization Mentor",
    description: "Teaches outlining and logical arrangement of ideas."
  },
  {
    title: "Precision Language Tutor",
    description: "Refines proofreading skills beyond basic grammar."
  },
  {
    title: "Digital Literacy Optimizer",
    description: "Educates on writing for online audiences and search engines."
  },
  {
    title: "Creative Stimulus Generator",
    description: "Provides writing prompts to spark imagination and practice."
  },
  {
    title: "Multimodal Composition Tool",
    description: "Teaches conversion of text to speech for diverse communication."
  }
];

interface CardProps {
  title: string;
  description: string;
  colorIndex: number;
}

const Card: React.FC<CardProps> = ({ title, description, colorIndex }) => {
  const [, setIsHovered] = useState(false);
  const [hueOffset, setHueOffset] = useState(0);

  const baseHue = (colorIndex * 45) % 360;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setHueOffset((prevOffset) => (prevOffset + 1) % 360);
    }, 50);

    return () => clearInterval(intervalId);
  }, []);

  const [springs, api] = useSpring(() => ({ 
    scale: 1,
    config: { ...config.wobbly, tension: 300, friction: 7 }
  }));

  const gradientStyle = useMemo(() => {
    const hue = (baseHue + hueOffset) % 360;
    return {
      backgroundImage: `linear-gradient(45deg, 
        hsl(${hue}, 100%, 50%), 
        hsl(${(hue + 60) % 360}, 100%, 50%), 
        hsl(${(hue + 120) % 360}, 100%, 50%), 
        hsl(${hue}, 100%, 50%))`,
      backgroundSize: '400% 400%',
      animation: 'gradient-shift 3s ease infinite',
    };
  }, [baseHue, hueOffset]);

  const handleHover = (hovering: boolean) => {
    setIsHovered(hovering);
    api.start({ scale: hovering ? 1.05 : 1 });
  };

  return (
    <animated.div
      className="rounded-xl overflow-hidden cursor-pointer shadow-lg"
      style={{
        ...springs,
        transform: springs.scale.to(s => `scale(${s})`),
      }}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      <div className="h-full" style={gradientStyle}>
        <div className="bg-white bg-opacity-90 h-full p-6 flex flex-col">
          <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600 mb-4">{description}</p>
          <a href="#" className="mt-auto text-indigo-600 font-semibold inline-flex items-center group">
            Learn more
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </animated.div>
  );
};

const CTACard: React.FC = () => {
  const [springs, api] = useSpring(() => ({ 
    scale: 1,
    config: { ...config.wobbly, tension: 300, friction: 10 }
  }));

  const handleHover = (hovering: boolean) => {
    api.start({ scale: hovering ? 1.05 : 1 });
  };

  return (
    <animated.div
      className="rounded-xl overflow-hidden cursor-pointer shadow-lg z-2"
      style={{
        ...springs,
        transform: springs.scale.to(s => `scale(${s})`),
      }}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 h-full p-6 flex flex-col items-center justify-center text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Elevate Your Teaching</h2>
        <p className="mb-6">Discover how our AI-powered tools can transform your classroom.</p>
        <button className="bg-white text-indigo-600 font-semibold py-2 px-4 rounded-full hover:bg-opacity-90 transition-colors">
          Get Started
        </button>
      </div>
    </animated.div>
  );
};

const EducationServicesGrid: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.slice(0, 4).map((service, index) => (
          <Card key={index} {...service} colorIndex={index} />
        ))}
        <CTACard />
        {services.slice(4).map((service, index) => (
          <Card key={index + 4} {...service} colorIndex={index + 4} />
        ))}
      </div>
      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default EducationServicesGrid;