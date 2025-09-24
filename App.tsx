// FIX: Create new file to define the main application component and router.
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import PetsPage from './pages/PetsPage';
import PetDetailPage from './pages/PetDetailPage';
import CropsPage from './pages/CropsPage';
import CropDetailPage from './pages/CropDetailPage';
import PlannerPage from './pages/PlannerPage';
import GuidesPage from './pages/GuidesPage';
import GuideDetailPage from './pages/GuideDetailPage';
import SettingsPage from './pages/SettingsPage';
import { useTheme } from './hooks/useTheme';
import { useLocalization } from './hooks/useLocalization';
import { languageConfig } from './types';
import { useAdMob } from './hooks/useAdMob';

const App: React.FC = () => {
  const { theme } = useTheme();
  const { language } = useLocalization();
  const { showAppOpenAd, triggerInterstitialOnClick } = useAdMob();

  useEffect(() => {
    // Show app open ad on initial load or when app becomes visible again
    showAppOpenAd();
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        showAppOpenAd();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [showAppOpenAd]);

  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Trigger for significant actions like navigating or pressing a button
      if (target.closest('a, button')) {
        triggerInterstitialOnClick();
      }
    };
    
    document.body.addEventListener('click', handleGlobalClick, true); // Use capture phase
    
    return () => {
      document.body.removeEventListener('click', handleGlobalClick, true);
    };
  }, [triggerInterstitialOnClick]);

  return (
    <Router>
      <div dir={languageConfig[language].dir} className={`font-sans bg-[color:var(--background)] text-[color:var(--foreground)] min-h-screen pb-20 ${theme}`}>
        <main className="max-w-4xl mx-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/pets" element={<PetsPage />} />
            <Route path="/pets/:petId" element={<PetDetailPage />} />
            <Route path="/crops" element={<CropsPage />} />
            <Route path="/crops/:cropId" element={<CropDetailPage />} />
            <Route path="/planner" element={<PlannerPage />} />
            <Route path="/guides" element={<GuidesPage />} />
            <Route path="/guides/:guideId" element={<GuideDetailPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </Router>
  );
};

export default App;