import { useRef } from 'react';
import { useTrail, useChain, useSprings, animated, useSpringRef } from '@react-spring/web';

const GRID_SIZE = 15;
const CELL_SIZE = 10;
const STROKE_WIDTH = 0.5;
const OFFSET = STROKE_WIDTH / 2;
const MAX_WIDTH = GRID_SIZE * CELL_SIZE + OFFSET * 2;
const MAX_HEIGHT = GRID_SIZE * CELL_SIZE + OFFSET * 2;

const colors = [
  '#FF69B4', '#FF7F50', '#FFA500', '#32CD32', '#1E90FF',
  '#00CED1', '#9ACD32', '#FFD700', '#FF4500', '#8A2BE2',
  '#FFF5E1', '#C68642', '#8D5524'
];

export const Block = () => {
  const gridApi = useSpringRef();
  const cellApi = useSpringRef();

  const gridSprings = useTrail(GRID_SIZE * 2, {
    ref: gridApi,
    from: { x2: 0, y2: 0 },
    to: { x2: MAX_WIDTH, y2: MAX_HEIGHT },
  });

  const cellsRef = useRef(Array(GRID_SIZE * GRID_SIZE).fill(null).map(() => ({
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 3000, // Random delay between 0-3000ms
  })));

  const [cellSprings] = useSprings(GRID_SIZE * GRID_SIZE, i => ({
    ref: cellApi,
    from: { scale: 0, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    delay: cellsRef.current[i].delay,
    config: { mass: 1, tension: 280, friction: 60 },
  }));

  useChain([gridApi, cellApi], [0, 0.5], 3000);

  return (
    <svg viewBox={`0 0 w-1/3 sm:w-full md:w-1/4 lg:w-1/2`}>
      <g>
        {gridSprings.map(({ x2 }, index) => (
          <animated.line
            key={`h${index}`}
            x1={0}
            y1={index * CELL_SIZE + OFFSET}
            x2={x2}
            y2={index * CELL_SIZE + OFFSET}
            strokeWidth={STROKE_WIDTH}
            stroke="white"
          />
        ))}
        {gridSprings.map(({ y2 }, index) => (
          <animated.line
            key={`v${index}`}
            x1={index * CELL_SIZE + OFFSET}
            y1={0}
            x2={index * CELL_SIZE + OFFSET}
            y2={y2}
            strokeWidth={STROKE_WIDTH}
            stroke="white"
          />
        ))}
      </g>
      {cellSprings.map(({ scale, opacity }, index) => {
        const row = Math.floor(index / GRID_SIZE);
        const col = index % GRID_SIZE;
        return (
          <animated.rect
            key={index}
            width={CELL_SIZE}
            height={CELL_SIZE}
            fill={cellsRef.current[index].color}
            style={{
              transformOrigin: `${col * CELL_SIZE + CELL_SIZE / 2 + OFFSET}px ${row * CELL_SIZE + CELL_SIZE / 2 + OFFSET}px`,
              transform: scale.to(s => `translate(${col * CELL_SIZE + OFFSET}px, ${row * CELL_SIZE + OFFSET}px) scale(${s})`),
              opacity: opacity.to(String),
            }}
          />
        );
      })}
    </svg>
  );
};