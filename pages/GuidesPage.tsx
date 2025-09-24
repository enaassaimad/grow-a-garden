import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { guides } from '../data/guides';
import { Guide } from '../types';
import { LightbulbIcon } from '../components/Icons';
import { useLocalization } from '../hooks/useLocalization';
import NativeAd from '../components/NativeAd';

const GuideCard = ({ guide }: { guide: Guide }) => {
    return (
        <Link 
            to={`/guides/${guide.id}`} 
            className="block bg-[color:var(--card)] p-4 rounded-lg shadow-md border border-[color:var(--border)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
            <span className="text-xs font-semibold text-[color:var(--primary)] bg-[color:var(--primary)]/10 px-2 py-1 rounded-full">{guide.category}</span>
            <h3 className="font-bold text-lg mt-2 text-[color:var(--card-foreground)]">{guide.title}</h3>
            <p className="text-sm text-[color:var(--foreground)] opacity-80 mt-1">{guide.summary}</p>
        </Link>
    );
};

const GuidesPage: React.FC = () => {
    const { t } = useLocalization();
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = useMemo(() => {
        const cats = new Set(guides.map(g => g.category));
        return ['All', ...Array.from(cats)];
    }, []);

    const filteredGuides = useMemo(() => {
        if (selectedCategory === 'All') {
            return guides;
        }
        return guides.filter(guide => guide.category === selectedCategory);
    }, [selectedCategory]);
    
    const renderItemsWithAds = (items: Guide[]) => {
        const components: JSX.Element[] = [];
        items.forEach((item, index) => {
            components.push(<GuideCard key={item.id} guide={item} />);
            if ((index + 1) % 8 === 0) {
                components.push(<NativeAd key={`ad-${index}`} format="grid" />);
            }
        });
        return components;
    };

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center space-x-3">
                <LightbulbIcon className="w-8 h-8 text-[color:var(--primary)]" />
                <h1 className="text-3xl font-bold text-[color:var(--primary)]">{t('guidesTitle')}</h1>
            </div>
            
            <div className="flex overflow-x-auto space-x-2 pb-2 -mx-4 px-4">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                            selectedCategory === category 
                            ? 'bg-[color:var(--primary)] text-[color:var(--primary-foreground)]' 
                            : 'bg-[color:var(--secondary)] text-[color:var(--secondary-foreground)] hover:bg-opacity-80'
                        }`}
                    >
                        {category === 'All' ? t('tierAll') : category}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                 {renderItemsWithAds(filteredGuides)}
            </div>

            {filteredGuides.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-lg text-[color:var(--foreground)] opacity-80">{t('noGuidesFound')}</p>
                </div>
            )}
        </div>
    );
};

export default GuidesPage;