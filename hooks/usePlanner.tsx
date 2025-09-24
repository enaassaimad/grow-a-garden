import { useState, useEffect, useCallback } from 'react';
import { Crop } from '../types';

export interface PlannedCrop {
  id: string;
  crop: Crop;
  plantDate: string; // ISO string
}

const PLANNER_STORAGE_KEY = 'gardenPlanner';

export const usePlanner = () => {
  const [plannedCrops, setPlannedCrops] = useState<PlannedCrop[]>(() => {
    try {
      const storedData = localStorage.getItem(PLANNER_STORAGE_KEY);
      return storedData ? JSON.parse(storedData) : [];
    } catch (error) {
      console.error('Error reading planner data from localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(plannedCrops));
    } catch (error) {
      console.error('Error writing planner data to localStorage', error);
    }
  }, [plannedCrops]);

  const addPlannedCrop = useCallback((crop: Crop, plantDate: Date) => {
    const newPlannedCrop: PlannedCrop = {
      id: `${plantDate.toISOString()}-${crop.mId}-${Math.random()}`,
      crop,
      plantDate: plantDate.toISOString(),
    };
    setPlannedCrops(prev => [...prev, newPlannedCrop].sort((a,b) => new Date(a.plantDate).getTime() - new Date(b.plantDate).getTime()));
  }, []);

  const removePlannedCrop = useCallback((id: string) => {
    setPlannedCrops(prev => prev.filter(item => item.id !== id));
  }, []);

  return { plannedCrops, addPlannedCrop, removePlannedCrop };
};
