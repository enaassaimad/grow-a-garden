import React, { useEffect, useRef, useState, ReactNode } from 'react';

interface AnimatedListItemProps {
  children: ReactNode;
  index: number;
}

const AnimatedListItem: React.FC<AnimatedListItemProps> = ({ children, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '0px 0px -50px 0px', // Trigger a little before it's fully on screen
        threshold: 0.1,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={isVisible ? 'animate-fade-in-up' : 'opacity-0'}
      style={{ animationDelay: `${(index % 12) * 40}ms` }} // Faster, shorter stagger wave
    >
      {children}
    </div>
  );
};

export default AnimatedListItem;