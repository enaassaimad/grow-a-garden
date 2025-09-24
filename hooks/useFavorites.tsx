import { useState, useEffect, useCallback } from 'react';

export const useFavorites = (key: string) => {
  const [favorites, setFavorites] = useState<Set<number>>(() => {
    try {
      const storedFavorites = localStorage.getItem(key);
      return storedFavorites ? new Set(JSON.parse(storedFavorites)) : new Set();
    } catch (error) {
      console.error('Error reading favorites from localStorage', error);
      return new Set();
    }
  });

  const toggleFavorite = useCallback((id: number) => {
    setFavorites(prevFavorites => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      
      try {
        localStorage.setItem(key, JSON.stringify(Array.from(newFavorites)));
      } catch (error) {
        console.error('Error writing favorites to localStorage', error);
      }
      
      return newFavorites;
    });
  }, [key]);

  return { favorites, toggleFavorite };
};
