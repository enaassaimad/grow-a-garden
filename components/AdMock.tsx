import React, { useState, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';

interface AdMockProps {
  type: 'appOpen' | 'interstitial' | 'reward';
  onClose: (rewarded: boolean) => void;
}

const AdMock: React.FC<AdMockProps> = ({ type, onClose }) => {
    const { t } = useLocalization();
    const [canClose, setCanClose] = useState(false);
    const [rewardCountdown, setRewardCountdown] = useState(5);

    const isSkippable = type !== 'reward';

    useEffect(() => {
        const closeTimer = setTimeout(() => {
            setCanClose(true);
        }, isSkippable ? 3000 : 5000);

        let rewardInterval: number | undefined;
        if (type === 'reward') {
            rewardInterval = setInterval(() => {
                setRewardCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(rewardInterval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            clearTimeout(closeTimer);
            if (rewardInterval) clearInterval(rewardInterval);
        };
    }, [isSkippable, type]);
    
    const handleClose = () => {
        const rewarded = type === 'reward' && rewardCountdown === 0;
        onClose(rewarded);
    }

    return (
        <div className="fixed inset-0 bg-gray-900 z-[100] flex flex-col items-center justify-center text-white p-4">
            <div className="absolute top-4 left-4 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-md">{t('advertisement')}</div>
            
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">
                    {type === 'appOpen' && 'App is ready!'}
                    {type === 'interstitial' && 'A word from our sponsors'}
                    {type === 'reward' && 'Watch this ad for a reward!'}
                </h2>
                <p className="text-gray-400 mb-6">This is a placeholder for a real ad.</p>
                <div className="w-80 h-48 bg-gray-700 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">[ Ad Content Area ]</p>
                </div>
            </div>

            {type === 'reward' && (
                <div className="absolute bottom-6 bg-green-600/50 text-white font-bold py-2 px-4 rounded-full">
                    {rewardCountdown > 0 ? `${t('adRewardIn')} ${rewardCountdown}...` : t('adRewardGranted')}
                </div>
            )}
            
            <button 
                onClick={handleClose}
                disabled={!canClose}
                className="absolute top-4 right-4 bg-gray-800 rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-opacity"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

export default AdMock;
