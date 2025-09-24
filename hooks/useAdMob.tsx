import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { adConfig } from '../adConfig';
import AdMock from '../components/AdMock';

interface RewardCallback {
    onReward: () => void;
    onClose?: () => void;
}

interface AdMobContextType {
  isAppOpenAdReady: boolean;
  isInterstitialReady: boolean;
  isRewardAdReady: boolean;
  showAppOpenAd: (onClose?: () => void) => boolean;
  showInterstitialAd: (onClose?: () => void) => boolean;
  showRewardAd: (callbacks: RewardCallback) => boolean;
  triggerInterstitialOnClick: () => void;
}

const AdMobContext = createContext<AdMobContextType | undefined>(undefined);

export const AdMobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isShowingAd, setIsShowingAd] = useState(false);
    const [adDetails, setAdDetails] = useState<{ type: 'appOpen' | 'interstitial' | 'reward'; onClose?: () => void; onReward?: () => void} | null>(null);
    const [clickCount, setClickCount] = useState<number>(() => {
        try {
            return parseInt(sessionStorage.getItem('adClickCount') || '0', 10);
        } catch {
            return 0;
        }
    });

    // --- Ad Readiness State ---
    const [isAppOpenAdReady, setAppOpenAdReady] = useState(false);
    const [isInterstitialReady, setInterstitialReady] = useState(false);
    const [isRewardAdReady, setRewardAdReady] = useState(false);

    // --- Timers and Cooldowns ---
    const lastAppOpenTime = useRef(0);
    
    // Simulate loading ads
    useEffect(() => {
        const loadAds = () => {
            setTimeout(() => setAppOpenAdReady(true), 1000);
            setTimeout(() => setInterstitialReady(true), 1500);
            setTimeout(() => setRewardAdReady(true), 2000);
        };
        loadAds();
    }, []);

    const showAd = useCallback((type: 'appOpen' | 'interstitial' | 'reward', callbacks?: { onClose?: () => void; onReward?: () => void}) => {
        setIsShowingAd(true);
        setAdDetails({ type, ...callbacks });
    }, []);

    const handleAdClose = (rewarded: boolean) => {
        if (adDetails?.type === 'reward' && rewarded) {
            adDetails.onReward?.();
        }
        adDetails?.onClose?.();
        setIsShowingAd(false);
        setAdDetails(null);
    };

    const showAppOpenAd = useCallback((onClose?: () => void): boolean => {
        const now = Date.now();
        if (isAppOpenAdReady && !isShowingAd && now - lastAppOpenTime.current > adConfig.appOpenCooldown) {
            lastAppOpenTime.current = now;
            showAd('appOpen', { onClose });
            return true;
        }
        return false;
    }, [isAppOpenAdReady, isShowingAd, showAd]);
    
    const showInterstitialAd = useCallback((onClose?: () => void): boolean => {
        if (isInterstitialReady && !isShowingAd) {
            showAd('interstitial', { onClose });
            return true;
        }
        onClose?.(); 
        return false;
    }, [isInterstitialReady, isShowingAd, showAd]);

    const triggerInterstitialOnClick = useCallback(() => {
        const newCount = clickCount + 1;
        setClickCount(newCount);
        sessionStorage.setItem('adClickCount', newCount.toString());

        if (newCount > 0 && newCount % adConfig.interstitialClickFrequency === 0) {
            showInterstitialAd();
        }
    }, [clickCount, showInterstitialAd]);
    
    const showRewardAd = useCallback((callbacks: RewardCallback): boolean => {
        if (isRewardAdReady && !isShowingAd) {
            showAd('reward', callbacks);
            return true;
        }
        callbacks.onClose?.();
        return false;
    }, [isRewardAdReady, isShowingAd, showAd]);

    const value = { isAppOpenAdReady, isInterstitialReady, isRewardAdReady, showAppOpenAd, showInterstitialAd, showRewardAd, triggerInterstitialOnClick };

    return (
        <AdMobContext.Provider value={value}>
            {children}
            {isShowingAd && adDetails && <AdMock type={adDetails.type} onClose={handleAdClose} />}
        </AdMobContext.Provider>
    );
};

export const useAdMob = (): AdMobContextType => {
  const context = useContext(AdMobContext);
  if (!context) {
    throw new Error('useAdMob must be used within an AdMobProvider');
  }
  return context;
};