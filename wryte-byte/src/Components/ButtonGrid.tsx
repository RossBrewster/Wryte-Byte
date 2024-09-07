import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSpring, animated, config, useTrail, SpringValue } from 'react-spring';

const colors = [
  '#FF69B4', '#FFA500', '#FFD700', '#32CD32', '#87CEEB', '#9370DB', '#20B2AA',
];

const buttonTexts = [
  "AI Writing Assistant", "Grammar Checker", "Style Enhancer", "Idea Generator",
  "Plagiarism Detector", "Vocabulary Builder", "Creative Writing AI",
];

interface AnimatedStyle {
  opacity: SpringValue<number>;
  transform: SpringValue<string>;
  scale?: SpringValue<number>;
  rotateZ?: SpringValue<number>;
}

interface ColorfulButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  colorIndex?: number;
  style?: AnimatedStyle;
}

// Function to calculate perceived brightness (0-255)
const getPerceivedBrightness = (hue: number, saturation = 80, lightness = 60) => {
  const a = saturation * Math.min(lightness, 100 - lightness) / 10000;
  const x = a * (1 - Math.abs((lightness / 100 - 0.5) * 2 - 1));
  const y = lightness / 100 + a / 2;
  const z = lightness / 100 - a / 2;

  const hueRad = hue * Math.PI / 180;
  const r = y * Math.cos(hueRad) + z;
  const g = x * Math.sin(hueRad) + y * Math.cos(hueRad - 2 * Math.PI / 3) + z;
  const b = x * Math.sin(hueRad - 2 * Math.PI / 3) + y * Math.cos(hueRad + 2 * Math.PI / 3) + z;

  return Math.round((r * 0.299 + g * 0.587 + b * 0.114) * 255);
};

// Function to determine text color based on gradient brightness and hover effect
const getTextColor = (hue: number, brightness: number) => {
  const numSamples = 5;
  const brightnessSamples = [];

  for (let i = 0; i < numSamples; i++) {
    const sampleHue = (hue + (i * 360 / numSamples)) % 360;
    brightnessSamples.push(getPerceivedBrightness(sampleHue));
  }

  const avgBrightness = brightnessSamples.reduce((a, b) => a + b, 0) / numSamples;
  const adjustedBrightness = avgBrightness * brightness;

  return adjustedBrightness < 128 ? 'white' : 'black';
};

const ColorfulButton: React.FC<ColorfulButtonProps> = ({ children, onClick, colorIndex = 0, style }) => {
  const [hueOffset, setHueOffset] = useState(0);
  const [shiftSpeed] = useState(() => Math.random() * 0.3 + 0.2);
  const [hoverEffect] = useState(() => Math.floor(Math.random() * 4));
  const [gradientAngle] = useState(() => Math.floor(Math.random() * 360));
  const [isHovered, setIsHovered] = useState(false);

  const [springs, api] = useSpring(() => ({ 
    scale: 1,
    brightness: 1,
    grainOpacity: 0.15,
    config: { ...config.wobbly, tension: 300, friction: 10 }
  }));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setHueOffset((prevOffset) => (prevOffset + shiftSpeed) % 360);
    }, 50);

    return () => clearInterval(intervalId);
  }, [shiftSpeed]);

  const baseColor = colors[colorIndex % colors.length];
  const hue = (parseInt(baseColor.slice(1), 16) + hueOffset) % 360;

  const textColor = useMemo(() => {
    let brightnessAdjustment = 1;
    if (isHovered) {
      switch (hoverEffect) {
        case 0: // Flash
          brightnessAdjustment = 1.1;
          break;
        case 1: // Darken
          brightnessAdjustment = 0.9;
          break;
        default:
          brightnessAdjustment = 1;
      }
    }
    return getTextColor(hue, brightnessAdjustment);
  }, [hue, isHovered, hoverEffect]);

  const gradientStyle = useMemo(() => ({
    backgroundImage: `linear-gradient(${gradientAngle}deg, 
      hsl(${hue}, 80%, 60%), 
      hsl(${(hue + 30) % 360}, 80%, 60%), 
      hsl(${(hue - 30 + 360) % 360}, 80%, 60%), 
      hsl(${hue}, 80%, 60%))`,
    backgroundSize: '400% 400%',
    animation: `gradient-shift ${8 / shiftSpeed}s ease infinite`,
  }), [hue, shiftSpeed, gradientAngle]);

  const noiseStyle = useMemo(() => ({
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
  }), []);

  const handleHover = (hovering: boolean) => {
    setIsHovered(hovering);
    switch (hoverEffect) {
      case 0: // Flash
        api.start({ scale: hovering ? 1.05 : 1, brightness: hovering ? 1.1 : 1 });
        break;
      case 1: // Darken
        api.start({ scale: hovering ? 1.05 : 1, brightness: hovering ? 0.9 : 1 });
        break;
      case 2: // Remove grain
        api.start({ scale: hovering ? 1.05 : 1, grainOpacity: hovering ? 0 : 0.15 });
        break;
      case 3: // Flat hue
        api.start({ scale: hovering ? 1.05 : 1 });
        break;
    }
  };

  return (
    <animated.button
      className="relative px-6 py-3 rounded-xl overflow-hidden group cursor-pointer"
      style={{
        ...springs,
        transform: springs.scale.to(s => `scale(${s})`),
        filter: springs.brightness.to(b => `brightness(${b})`),
        ...style,
      }}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      onClick={onClick}
    >
      <div 
        className="absolute inset-0 opacity-80 group-hover:opacity-100 transition duration-300"
        style={isHovered && hoverEffect === 3 ? { backgroundColor: `hsl(${hue}, 80%, 60%)` } : gradientStyle}
      ></div>
      <animated.div 
        className="absolute inset-0 mix-blend-overlay"
        style={{
          ...noiseStyle,
          opacity: springs.grainOpacity
        }}
      ></animated.div>
      <div className={`relative font-semibold z-10`} style={{ color: textColor }}>
        {children}
      </div>
    </animated.button>
  );
};

const ButtonGrid: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 7200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const trail = useTrail<AnimatedStyle>(buttonTexts.length, {
    opacity: isVisible && isIntersecting ? 1 : 0,
    transform: isVisible && isIntersecting ? 'translateY(0px)' : 'translateY(20px)',
    config: { mass: 1, tension: 280, friction: 60 },
    from: { opacity: 0, transform: 'translateY(20px)' },
  });

  return (
    <div ref={containerRef} className="flex flex-wrap gap-4 p-8 bg-gray-900 justify-center items-center">
      {isVisible && isIntersecting && trail.map((style, index) => (
        <ColorfulButton key={index} colorIndex={index} style={style}>
          {buttonTexts[index]}
        </ColorfulButton>
      ))}
    </div>
  );
};

export default ButtonGrid;