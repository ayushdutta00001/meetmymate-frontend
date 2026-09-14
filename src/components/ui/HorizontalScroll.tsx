import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
  showScrollButtons?: boolean;
  fadeEdges?: boolean;
}

export function HorizontalScroll({ 
  children, 
  className = '', 
  showScrollButtons = false,
  fadeEdges = true 
}: HorizontalScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        scrollElement.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative group">
      {/* Left Fade Edge */}
      {fadeEdges && canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />
      )}

      {/* Scrollable Content */}
      <div
        ref={scrollRef}
        className={`
          overflow-x-auto 
          horizontal-scroll
          ${className}
        `}
        style={{
          scrollbarWidth: 'thin',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {children}
      </div>

      {/* Right Fade Edge */}
      {fadeEdges && canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />
      )}

      {/* Scroll Buttons (Optional) */}
      {showScrollButtons && (
        <>
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="
                absolute left-2 top-1/2 -translate-y-1/2 z-20
                bg-white dark:bg-gray-800
                border border-gray-300 dark:border-gray-600
                rounded-full p-2
                shadow-lg
                hover:bg-gray-50 dark:hover:bg-gray-700
                transition-all
                opacity-0 group-hover:opacity-100
              "
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="
                absolute right-2 top-1/2 -translate-y-1/2 z-20
                bg-white dark:bg-gray-800
                border border-gray-300 dark:border-gray-600
                rounded-full p-2
                shadow-lg
                hover:bg-gray-50 dark:hover:bg-gray-700
                transition-all
                opacity-0 group-hover:opacity-100
              "
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          )}
        </>
      )}
    </div>
  );
}
