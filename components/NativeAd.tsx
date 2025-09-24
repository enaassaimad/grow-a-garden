import React from 'react';
import { useLocalization } from '../hooks/useLocalization';

interface NativeAdProps {
    format: 'list' | 'grid' | 'in-content';
}

const NativeAd: React.FC<NativeAdProps> = ({ format }) => {
    const { t } = useLocalization();

    if (format === 'list') {
        return (
             <div className="bg-[color:var(--card)] rounded-lg shadow-md border border-[color:var(--border)] overflow-hidden flex items-center p-2 space-x-4 relative">
                <div className="w-20 h-20 bg-gray-500 rounded-md flex-shrink-0 flex items-center justify-center">
                     <span className="text-white text-xs font-bold">{t('ad')}</span>
                </div>
                <div className="flex-grow">
                     <p className="text-sm font-semibold text-[color:var(--card-foreground)]">{t('adSponsored')}</p>
                     <p className="text-xs text-[color:var(--foreground)] opacity-70">Check out this amazing offer from our partners!</p>
                     <button className="mt-2 text-xs bg-[color:var(--primary)] text-[color:var(--primary-foreground)] px-3 py-1 rounded-full font-bold">Learn More</button>
                </div>
            </div>
        );
    }
    
    if (format === 'in-content') {
        return (
            <div className="bg-[color:var(--card)] p-4 rounded-lg border border-[color:var(--border)]">
                <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 bg-gray-500 rounded-md flex-shrink-0 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{t('ad')}</span>
                    </div>
                    <div className="flex-grow">
                         <p className="text-sm font-semibold text-[color:var(--card-foreground)]">{t('adSponsored')}</p>
                         <p className="text-sm text-[color:var(--foreground)] opacity-70 mt-1">Discover new products and services from our partners. Check out this amazing offer!</p>
                         <button className="mt-3 text-xs bg-[color:var(--primary)] text-[color:var(--primary-foreground)] px-3 py-1.5 rounded-full font-bold">Learn More</button>
                    </div>
                </div>
            </div>
        );
    }
    
    // Default to 'grid' format
    return (
        <div className="bg-[color:var(--card)] rounded-lg shadow-md border border-[color:var(--border)] overflow-hidden flex flex-col relative h-full">
             <div className="relative">
                <div className="w-full h-32 bg-gray-500 flex items-center justify-center">
                    <span className="text-white font-bold">{t('advertisement')}</span>
                </div>
                <span className="absolute top-2 left-2 px-2 py-1 text-xs font-bold rounded bg-yellow-400 text-black">{t('ad')}</span>
            </div>
            <div className="p-4 flex-grow">
                <h3 className="font-bold text-lg text-[color:var(--card-foreground)] truncate">{t('adSponsored')}</h3>
                <p className="text-sm text-[color:var(--foreground)] opacity-80 h-10 overflow-hidden text-ellipsis">Discover new products and services from our partners.</p>
            </div>
        </div>
    );
};

export default NativeAd;