'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 }); // Initial position off-screen
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // To make cursor visible after first mouse move

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;
      if (target.closest('[data-cursor-hoverable="true"]')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false); // Hide cursor when mouse leaves the window
    };

    const handleMouseEnter = () => {
      setIsVisible(true); // Show cursor when mouse enters the window
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed rounded-full pointer-events-none z-[9999] transition-transform duration-200 ease-out',
        'bg-accent shadow-md', // Using accent color from theme
        isVisible ? 'opacity-100' : 'opacity-0',
        isHovering ? 'w-10 h-10' : 'w-5 h-5' // Tailwind classes for size change
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        // transition for opacity as well to avoid jump on first mouse enter
        transitionProperty: 'transform, width, height, opacity', 
      }}
    />
  );
}
