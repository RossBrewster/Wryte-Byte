import React, { useState, useEffect, useCallback } from 'react';
import { TextCursor } from './TextCursor';

export interface ContentItem {
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
  content: string;
}

interface TypedTextProps {
  isVisible: boolean;
  isDarkMode: boolean;
  content: ContentItem[];
  typingSpeed?: {
    heading: number;
    paragraph: number;
    backspace: number;
    subHeading: number;
  };
  mobileTypingSpeed?: {
    heading: number;
    paragraph: number;
    backspace: number;
    subHeading: number;
  };
  initialDelay?: number;
  blinking?: boolean;
}

export const TypedText: React.FC<TypedTextProps> = ({
  isVisible,
  content,
  typingSpeed = { heading: 75, paragraph: 3, backspace: 50, subHeading: 45 },
  mobileTypingSpeed = { heading: 70, paragraph: 0.5, backspace: 25, subHeading: 15 },
  initialDelay = 1000,
  isDarkMode = true,
  blinking = false,
}) => {
  const [typedText, setTypedText] = useState<string[]>(new Array(content.length).fill(''));
  const [currentItemIndex, setCurrentItemIndex] = useState<number>(0);
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
  const [startTyping, setStartTyping] = useState<boolean>(false);
  const [isTypingComplete, setIsTypingComplete] = useState<boolean>(false);
  const [showCursor, setShowCursor] = useState<boolean>(false);

  const getTypingSpeed = useCallback(() => {
    const isMobile = window.innerWidth < 768;
    return isMobile ? mobileTypingSpeed : typingSpeed;
  }, [typingSpeed, mobileTypingSpeed]);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setStartTyping(true);
        setShowCursor(true);
      }, initialDelay);
      return () => clearTimeout(timer);
    } else {
      setTypedText(new Array(content.length).fill(''));
      setCurrentItemIndex(0);
      setCurrentCharIndex(0);
      setStartTyping(false);
      setIsTypingComplete(false);
      setShowCursor(false);
    }
  }, [isVisible, initialDelay, content.length]);

  useEffect(() => {
    if (!isVisible || !startTyping) return;

    const { heading: headingSpeed, paragraph: paragraphSpeed, subHeading: subHeadingSpeed } = getTypingSpeed();

    const typeNextCharacter = () => {
      if (currentItemIndex >= content.length) {
        setIsTypingComplete(true);
        setShowCursor(blinking);
        return;
      }

      const currentItem = content[currentItemIndex];

      if (currentCharIndex < currentItem.content.length) {
        setTypedText(prev => {
          const newTypedText = [...prev];
          newTypedText[currentItemIndex] = currentItem.content.slice(0, currentCharIndex + 1);
          return newTypedText;
        });
        setCurrentCharIndex(prev => prev + 1);
      } else if (currentItemIndex < content.length - 1) {
        setCurrentItemIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      } else {
          setShowCursor(blinking);
          setIsTypingComplete(true);
      }
    };

    let speed;
    if (content[currentItemIndex].type === "h5") {
      speed = subHeadingSpeed;
    } else if (content[currentItemIndex].type === "h1") {
      speed = headingSpeed;
    } else {
      speed = paragraphSpeed;
    }

    const timeout = setTimeout(typeNextCharacter, speed);

    return () => clearTimeout(timeout);
  }, [isVisible, startTyping, typedText, currentItemIndex, currentCharIndex, content, getTypingSpeed, blinking]);

  const renderContent = () => {
    return content.map((item, index) => {
      const Tag = item.type as keyof JSX.IntrinsicElements;
      const isCurrentItem = index === currentItemIndex;
      const shouldShowCursor = showCursor && isCurrentItem && !isTypingComplete;

        

        return (
            <Tag
                key={index}
                className={`flex flex-wrap ${isDarkMode ? 'text-white' : 'text-black'} ${
                item.type === 'h1'
                    ? ' justify-center text-[48px] sm:text-[56px] md:text-[64px] lg:text-[72px] font-bold font-["Saira",_sans-serif] mt-8 mb-16 leading-tight text-center'
                    : item.type === 'h5'
                    ? 'text-[32px] sm:text-[28px] md:text-[32px] lg:text-[40px] font-semibold font-["Saira",_sans-serif] mb-8 mt-8 leading-tight'
                    : 'text-base sm:text-lg md:text-xl font-normal font-[sans-serif] whitespace-pre-line leading-relaxed mt-4'
                }`}>
                <span className="">
                    {typedText[index]}
                    {shouldShowCursor && <span className="animate-blink">|</span>}
                </span>
            </Tag>
        );
    });
  };

  if (isTypingComplete && blinking) {
    return (
        <div className="w-full px-4 sm:px-6 lg:px-8">
            {renderContent()}
            <TextCursor />
        </div>
    )
  } else {
      return (
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {renderContent()}
        </div>
      );
  }

};

export default TypedText;