import React, { useState, useEffect } from 'react';

export const TextCursor: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((prev) => !prev);
    }, 530); // Blink every 530ms

    return () => clearInterval(interval);
  }, []);

  return (
    <span
    className={`w-1 bg-white ${
        visible ? 'opacity-100' : 'opacity-0'
    } transition-opacity duration-100 ease-in-out h-full`}
    >|</span>
  );
};