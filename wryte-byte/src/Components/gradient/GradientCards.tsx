import React, { useState, useMemo, useEffect } from 'react';
import { useSpring, animated, config } from 'react-spring';

interface BlockGridProps {
  columns: number;
  rows: number;
  blockSize: number;
  gap: number;
  sizeUnit?: 'px' | 'em' | 'rem' | 'vw' | 'vh';
  mediaQueries?: { [key: string]: Partial<BlockGridProps> };
}

const colors = [
  '#FF69B4', '#FFA500', '#FFD700', '#32CD32', '#87CEEB', '#9370DB', '#20B2AA',
  '#FF6347', '#4682B4', '#00CED1', '#FF4500', '#7B68EE', '#3CB371', '#F4A460'
];

// Fisher-Yates shuffle algorithm
const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const AnimatedBlock: React.FC<{ size: number; sizeUnit: string }> = ({ size, sizeUnit }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hueOffset, setHueOffset] = useState(0);
  const [shiftSpeed] = useState(() => Math.random() * 0.3 + 0.2);
  const [baseColor] = useState(() => {
    const shuffledColors = shuffleArray([...colors]);
    return shuffledColors[Math.floor(Math.random() * shuffledColors.length)];
  });

  const animationProps = useMemo(() => ({
    duration: 2000 + Math.random() * 2000,
    delay: Math.random() * 1000,
    xOffset: -3 + Math.random() * 6,
    yOffset: -3 + Math.random() * 6,
    scaleOffset: 0.98 + Math.random() * 0.04,
  }), []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setHueOffset((prevOffset) => (prevOffset + shiftSpeed) % 360);
    }, 50);

    return () => clearInterval(intervalId);
  }, [shiftSpeed]);

  const hue = (parseInt(baseColor.slice(1), 16) + hueOffset) % 360;

  const bubbleProps = useSpring({
    loop: true,
    to: [
      { 
        transform: `translate(${animationProps.xOffset}${sizeUnit}, ${animationProps.yOffset}${sizeUnit}) scale(${animationProps.scaleOffset})` 
      },
      { 
        transform: 'translate(0px, 0px) scale(1)' 
      }
    ],
    from: { transform: 'translate(0px, 0px) scale(1)' },
    config: {
      tension: 700,
      friction: 1,
      duration: animationProps.duration,
    },
    delay: animationProps.delay,
  });

  const hoverProps = useSpring({
    scale: isHovered ? 1.1 : 1,
    rotate: isHovered ? 5 : 0,
    boxShadow: isHovered 
      ? '0 10px 20px rgba(0,0,0,0.2)' 
      : '0 5px 10px rgba(0,0,0,0.1)',
    config: { ...config.wobbly, tension: 300, friction: 10 }
  });

  const gradientStyle = useMemo(() => ({
    background: `linear-gradient(45deg, 
      hsl(${hue}, 80%, 60%), 
      hsl(${(hue + 30) % 360}, 80%, 60%), 
      hsl(${(hue + 60) % 360}, 80%, 60%), 
      hsl(${(hue + 90) % 360}, 80%, 60%)
    )`,
    backgroundSize: '400% 400%',
    animation: `gradient-shift ${8 / shiftSpeed}s ease infinite`,
  }), [hue, shiftSpeed]);

  return (
    <animated.div
      style={{
        width: `${size}${sizeUnit}`,
        height: `${size}${sizeUnit}`,
        borderRadius: '20%',
        ...gradientStyle,
        ...bubbleProps,
        ...hoverProps
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    />
  );
};

export const BlockGrid: React.FC<BlockGridProps> = ({
  columns,
  rows,
  blockSize,
  gap,
  sizeUnit = 'px',
  mediaQueries = {}
}) => {
  const [gridProps, setGridProps] = useState({ columns, rows, blockSize, gap });

  React.useEffect(() => {
    const handleResize = () => {
      let newProps = { columns, rows, blockSize, gap };
      Object.entries(mediaQueries).forEach(([query, props]) => {
        if (window.matchMedia(query).matches) {
          newProps = { ...newProps, ...props };
        }
      });
      setGridProps(newProps);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [columns, rows, blockSize, gap, mediaQueries]);

  const gridStyle = useSpring({
    to: {
      gap: `${gridProps.gap}${sizeUnit}`,
      gridTemplateColumns: `repeat(${gridProps.columns}, ${gridProps.blockSize}${sizeUnit})`,
      gridTemplateRows: `repeat(${gridProps.rows}, ${gridProps.blockSize}${sizeUnit})`
    },
    config: config.gentle
  });

  return (
    <animated.div
      style={{
        display: 'grid',
        ...gridStyle
      }}
    >
      {Array.from({ length: gridProps.columns * gridProps.rows }).map((_, index) => (
        <AnimatedBlock
          key={index}
          size={gridProps.blockSize}
          sizeUnit={sizeUnit}
        />
      ))}
    </animated.div>
  );
};

export default BlockGrid;