import React, { useState, useMemo, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { usePlanner, PlannedCrop } from '../hooks/usePlanner';
import { crops } from '../data/crops';
import { Crop } from '../types';
import { PlusIcon, TrashIcon, CalendarDaysIcon, CalendarWeekIcon, ArrowLeftIcon, ArrowRightIcon, SearchIcon, CalendarIcon, CalculatorIcon, ChartBarIcon, StarIcon } from '../components/Icons';
import { getDaysForMonthView, getDaysForWeekView, formatDate, formatTime, formatDateTime } from '../utils/dateUtils';
import { estimateGrowthTimeMinutes, parseSellValue } from '../utils/cropUtils';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { useLocalization } from '../hooks/useLocalization';
import { useAdMob } from '../hooks/useAdMob';

// --- Main Planner Page ---
const PlannerPage: React.FC = () => {
  const { t } = useLocalization();
  const [activeTab, setActiveTab] = useState<'planning' | 'calculators' | 'ai'>('planning');

  const tabs = [
    { id: 'planning', label: t('plannerTabPlanning'), icon: <CalendarIcon className="w-5 h-5"/> },
    { id: 'calculators', label: t('plannerTabCalculators'), icon: <CalculatorIcon className="w-5 h-5"/> },
    { id: 'ai', label: t('plannerTabAI'), icon: <ChartBarIcon className="w-5 h-5"/> },
  ];

  return (
    <div className="p-4 space-y-4">
        <h1 className="text-3xl font-bold text-[color:var(--primary)]">{t('plannerTitle')}</h1>
        
        <div className="border-b border-[color:var(--border)]">
            <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`${
                    activeTab === tab.id
                        ? 'border-[color:var(--primary)] text-[color:var(--primary)]'
                        : 'border-transparent text-[color:var(--foreground)] opacity-70 hover:opacity-100 hover:border-gray-300'
                    } flex items-center space-x-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
                >
                    {tab.icon}
                    <span>{tab.label}</span>
                </button>
                ))}
            </nav>
        </div>

        <div>
            {activeTab === 'planning' && <PlanningView />}
            {activeTab === 'calculators' && <CalculatorsView />}
            {activeTab === 'ai' && <AIAdvisorView />}
        </div>
    </div>
  );
};


// --- Full Component Implementations ---

const CropSelectorModal = ({ isOpen, onClose, onSelect }: { isOpen: boolean, onClose: () => void, onSelect: (crop: Crop) => void }) => {
    const { t } = useLocalization();
    const [searchTerm, setSearchTerm] = useState('');
    const filteredCrops = useMemo(() => {
        if (!searchTerm) return crops;
        return crops.filter(c => c.mName.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm]);

    return (
        <div className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 ${isOpen ? '' : 'hidden'}`}>
            <div className="bg-[color:var(--card)] rounded-lg shadow-xl w-full max-w-sm max-h-[80vh] flex flex-col">
                <div className="p-4 border-b border-[color:var(--border)]">
                    <h2 className="text-xl font-bold">{t('selectCrop')}</h2>
                    <input type="text" placeholder={t('searchCrops')} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full mt-2 p-2 rounded-md bg-[color:var(--background)] border border-[color:var(--border)]"/>
                </div>
                <div className="overflow-y-auto p-2">
                    {filteredCrops.map(crop => (
                        <button key={crop.mId} onClick={() => { onSelect(crop); onClose(); }} className="w-full text-left p-2 flex items-center space-x-3 rounded-md hover:bg-[color:var(--secondary)]">
                             <img src={`https://firebasestorage.googleapis.com/v0/b/grow-a-garden-guide.appspot.com/o/Crops%2F${crop.mNameIcon}?alt=media`} alt={crop.mName} className="w-8 h-8 object-contain rounded-sm" />
                             <span>{crop.mName}</span>
                        </button>
                    ))}
                </div>
                 <div className="p-2 border-t border-[color:var(--border)] text-right">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-[color:var(--secondary)] hover:opacity-80">{t('buttonCancel')}</button>
                </div>
            </div>
        </div>
    );
}

const CalculatorsView: React.FC = () => {
    const { t } = useLocalization();
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [calculatorMode, setCalculatorMode] = useState<'growth' | 'profit' | null>(null);
    
    const [growthCrop, setGrowthCrop] = useState<Crop | null>(null);
    const [plantTime, setPlantTime] = useState(new Date().toISOString().slice(0, 16));
    const [harvestTime, setHarvestTime] = useState<Date | null>(null);
    
    const [profitCrop, setProfitCrop] = useState<Crop | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [profitResult, setProfitResult] = useState<{cost: number, revenue: number, profit: number} | null>(null);

    const openSelector = (mode: 'growth' | 'profit') => {
        setCalculatorMode(mode);
        setIsSelectorOpen(true);
    }
    
    const handleSelectCrop = (crop: Crop) => {
        if (calculatorMode === 'growth') {
            setGrowthCrop(crop);
            calculateGrowth(crop, new Date(plantTime));
        } else if (calculatorMode === 'profit') {
            setProfitCrop(crop);
             calculateProfit(crop, quantity);
        }
    };

    const calculateGrowth = (crop: Crop | null, date: Date) => {
        if (!crop) return;
        const growthMinutes = estimateGrowthTimeMinutes(crop.mTier);
        const harvest = new Date(date.getTime() + growthMinutes * 60000);
        setHarvestTime(harvest);
    };
    
    const calculateProfit = (crop: Crop | null, num: number) => {
        if (!crop || num <= 0) return;
        const cost = (parseInt(crop.mPrice.replace(/,/g, '')) || 0) * num;
        const [avgSell] = parseSellValue(crop.mSell_value);
        const revenue = avgSell * num;
        setProfitResult({ cost, revenue, profit: revenue - cost });
    }

    return (
        <div className="space-y-6">
            <CropSelectorModal isOpen={isSelectorOpen} onClose={() => setIsSelectorOpen(false)} onSelect={handleSelectCrop} />
            {/* Growth Calculator */}
            <div className="bg-[color:var(--card)] p-4 rounded-lg border border-[color:var(--border)]">
                <h3 className="font-bold text-lg mb-3">{t('growthTimer')}</h3>
                <div className="space-y-4">
                    <button onClick={() => openSelector('growth')} className="w-full p-3 rounded-lg border border-dashed border-[color:var(--border)] hover:border-[color:var(--primary)] transition-colors">
                        {growthCrop ? (
                             <div className="flex items-center space-x-3"><img src={`https://firebasestorage.googleapis.com/v0/b/grow-a-garden-guide.appspot.com/o/Crops%2F${growthCrop.mNameIcon}?alt=media`} className="w-8 h-8" /> <span>{growthCrop.mName}</span></div>
                        ) : t('clickToSelectCrop')}
                    </button>
                    <input type="datetime-local" value={plantTime} onChange={e => { setPlantTime(e.target.value); calculateGrowth(growthCrop, new Date(e.target.value))}} className="w-full p-2 rounded-lg bg-[color:var(--background)] border border-[color:var(--border)]"/>
                    {harvestTime && (
                        <div className="bg-[color:var(--primary)]/10 p-3 rounded-lg text-center">
                            <p className="text-sm">{t('estimatedHarvest')}</p>
                            <p className="font-bold text-lg text-[color:var(--primary)]">{formatDateTime(harvestTime)}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Profit Calculator */}
             <div className="bg-[color:var(--card)] p-4 rounded-lg border border-[color:var(--border)]">
                <h3 className="font-bold text-lg mb-3">{t('profitCalculator')}</h3>
                <div className="space-y-4">
                    <button onClick={() => openSelector('profit')} className="w-full p-3 rounded-lg border border-dashed border-[color:var(--border)] hover:border-[color:var(--primary)] transition-colors">
                        {profitCrop ? (
                             <div className="flex items-center space-x-3"><img src={`https://firebasestorage.googleapis.com/v0/b/grow-a-garden-guide.appspot.com/o/Crops%2F${profitCrop.mNameIcon}?alt=media`} className="w-8 h-8" /> <span>{profitCrop.mName}</span></div>
                        ) : t('clickToSelectCrop')}
                    </button>
                    <input type="number" value={quantity} onChange={e => { setQuantity(parseInt(e.target.value)); calculateProfit(profitCrop, parseInt(e.target.value))}} min="1" className="w-full p-2 rounded-lg bg-[color:var(--background)] border border-[color:var(--border)]"/>
                    {profitResult && (
                        <div className="bg-[color:var(--primary)]/10 p-3 rounded-lg space-y-2">
                           <div className="flex justify-between text-sm"><span className="opacity-80">{t('totalCost')}</span> <span className="font-semibold">{profitResult.cost.toLocaleString()}</span></div>
                           <div className="flex justify-between text-sm"><span className="opacity-80">{t('estRevenue')}</span> <span className="font-semibold">{profitResult.revenue.toLocaleString()}</span></div>
                           <div className="flex justify-between font-bold text-[color:var(--primary)]"><span className="text-[color:var(--foreground)]">{t('netProfit')}</span> <span>{profitResult.profit.toLocaleString()}</span></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const AIAdvisorView: React.FC = () => {
    const { t } = useLocalization();
    const { plannedCrops } = usePlanner();
    const { showRewardAd, isRewardAdReady } = useAdMob();
    const [isLoading, setIsLoading] = useState(false);
    const [isRewardLoading, setIsRewardLoading] = useState(false);
    const [analysis, setAnalysis] = useState('');
    const [proTip, setProTip] = useState('');
    const [error, setError] = useState('');
    
    const getCropSummary = useCallback(() => {
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
        
        const weeklyCrops = plannedCrops.filter(pc => {
            const plantDate = new Date(pc.plantDate);
            return plantDate >= startOfWeek && plantDate <= endOfWeek;
        });

        if (weeklyCrops.length === 0) return null;

        return weeklyCrops.map(item => `- ${item.crop.mName} (Tier: ${item.crop.mTier}, Sell Value: ${item.crop.mSell_value})`).join('\n');
    }, [plannedCrops]);

    const handleAnalyze = async () => {
        setIsLoading(true);
        setError('');
        setAnalysis('');
        setProTip('');

        const cropSummary = getCropSummary();
        if (!cropSummary) {
            setAnalysis(t('aiAdvisorNoCrops'));
            setIsLoading(false);
            return;
        }
        
        const prompt = `Based on the game 'Grow a Garden', here is my planned crop list for this week:\n${cropSummary}\n\nAnalyze this plan. Focus on profitability, crop diversity, and efficiency. Provide 2-3 specific, actionable suggestions for improvement. For example, suggest swapping a crop for a more profitable one or point out better opportunities. Keep the advice concise, encouraging, and easy to understand.`;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                 config: {
                    systemInstruction: "You are a friendly and expert 'Grow a Garden' game advisor. Analyze the user's weekly crop plan and provide actionable advice to improve their profits and efficiency. Be encouraging and format your response with Markdown, using bullet points for suggestions."
                }
            });
            setAnalysis(response.text);
        } catch (e: any) {
            console.error(e);
            setError(t('aiAdvisorError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleGetProTip = () => {
        showRewardAd({
            onReward: async () => {
                setIsRewardLoading(true);
                setProTip('');
                setError('');
                const cropSummary = getCropSummary();
                if (!cropSummary) {
                     setProTip(t('aiAdvisorNoCrops'));
                     setIsRewardLoading(false);
                     return;
                }
                const prompt = `Based on this weekly crop plan:\n${cropSummary}\n\nProvide one 'pro-level' or 'secret' tip that an expert player would use to maximize their gains. This could involve a specific pet-crop synergy, an advanced mutation strategy, or a clever use of game mechanics. Make it sound like an insider secret.`;
                try {
                     const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                     const response = await ai.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents: prompt,
                        config: { systemInstruction: "You are an elite 'Grow a Garden' player sharing a rare, secret strategy. Be concise and impactful."}
                     });
                     setProTip(response.text);
                } catch (e) {
                     setError(t('aiAdvisorError'));
                } finally {
                    setIsRewardLoading(false);
                }
            },
        });
    };

    return (
        <div className="space-y-4">
            <div className="bg-[color:var(--card)] p-4 rounded-lg border border-[color:var(--border)] text-center">
                <h3 className="font-bold text-lg mb-2">{t('aiAdvisorTitle')}</h3>
                <p className="text-sm opacity-80 mb-4">{t('aiAdvisorDesc')}</p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <button onClick={handleAnalyze} disabled={isLoading} className="bg-[color:var(--primary)] text-[color:var(--primary-foreground)] font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-wait">
                        {isLoading ? t('aiAdvisorAnalyzing') : t('aiAdvisorButton')}
                    </button>
                    <button onClick={handleGetProTip} disabled={!isRewardAdReady || isRewardLoading} className="flex items-center justify-center gap-2 bg-[color:var(--secondary)] text-[color:var(--secondary-foreground)] font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-wait">
                         <StarIcon className="w-5 h-5 text-yellow-400"/> {isRewardLoading ? t('aiAdvisorAnalyzing') : t('aiAdvisorProTipButton')}
                    </button>
                </div>
            </div>
            {(isLoading || isRewardLoading) && <div className="text-center p-4"> <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[color:var(--primary)] mx-auto"></div> </div>}
            {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm">{error}</div>}
            {analysis && (
                <div className="bg-[color:var(--card)] p-4 rounded-lg border border-[color:var(--border)]">
                     <MarkdownRenderer content={analysis} />
                </div>
            )}
             {proTip && (
                <div className="bg-yellow-400/10 border border-yellow-400/50 p-4 rounded-lg">
                    <h4 className="font-bold text-yellow-300 flex items-center gap-2"><StarIcon className="w-5 h-5"/> {t('aiAdvisorProTipTitle')}</h4>
                     <div className="mt-2">
                        <MarkdownRenderer content={proTip} />
                     </div>
                </div>
            )}
        </div>
    );
};

const PlanningAddCropModal = ({ isOpen, onClose, onAddCrop }: { isOpen: boolean; onClose: () => void; onAddCrop: (crop: Crop, date: Date) => void }) => {
    const { t } = useLocalization();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
    const [plantDate, setPlantDate] = useState(new Date().toISOString().slice(0, 16));

    const filteredCrops = useMemo(() => {
        if (!searchTerm) return crops.slice(0, 100);
        return crops.filter(c => c.mName.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm]);

    const handleAdd = () => {
        if (selectedCrop) {
            onAddCrop(selectedCrop, new Date(plantDate));
            onClose();
            setSelectedCrop(null);
            setSearchTerm('');
        }
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-[color:var(--card)] rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
                <div className="p-4 border-b border-[color:var(--border)]"><h2 className="text-xl font-bold">{t('addCropToPlanner')}</h2></div>
                <div className="p-4 space-y-4 overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium mb-1">{t('plantingTime')}</label>
                        <input type="datetime-local" value={plantDate} onChange={(e) => setPlantDate(e.target.value)} className="w-full p-2 rounded-lg bg-[color:var(--background)] border border-[color:var(--border)]"/>
                    </div>
                    <div>
                         <label className="block text-sm font-medium mb-1">{t('selectCrop')}</label>
                        <input type="text" placeholder={t('searchCrops')} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full p-2 rounded-md bg-[color:var(--background)] border border-[color:var(--border)]"/>
                        <div className="max-h-60 overflow-y-auto mt-2 border border-[color:var(--border)] rounded-lg">
                            {filteredCrops.map(crop => (
                                <button key={crop.mId} onClick={() => setSelectedCrop(crop)} className={`w-full text-left p-2 flex items-center space-x-3 transition-colors ${selectedCrop?.mId === crop.mId ? 'bg-[color:var(--primary)] text-[color:var(--primary-foreground)]' : 'hover:bg-[color:var(--secondary)]'}`}>
                                     <img src={`https://firebasestorage.googleapis.com/v0/b/grow-a-garden-guide.appspot.com/o/Crops%2F${crop.mNameIcon}?alt=media`} alt={crop.mName} className="w-8 h-8 object-contain rounded-sm" />
                                    <span>{crop.mName}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t border-[color:var(--border)] flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-[color:var(--secondary)] hover:opacity-80">{t('buttonCancel')}</button>
                    <button onClick={handleAdd} disabled={!selectedCrop} className="px-4 py-2 rounded-lg bg-[color:var(--primary)] text-[color:var(--primary-foreground)] disabled:opacity-50">{t('buttonAdd')}</button>
                </div>
            </div>
        </div>
    );
};

const PlanningView: React.FC = () => {
    const { t } = useLocalization();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { plannedCrops, addPlannedCrop, removePlannedCrop } = usePlanner();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

    const calendarDays = useMemo(() => {
        return viewMode === 'month' ? getDaysForMonthView(currentDate) : getDaysForWeekView(currentDate).map(d => ({ date: d, isCurrentMonth: true }));
    }, [currentDate, viewMode]);

    const eventsByDate = useMemo(() => {
        const events = new Map<string, { crop: Crop, id: string, plantDate: string }[]>();
        plannedCrops.forEach(crop => {
            const dateKey = new Date(crop.plantDate).toDateString();
            if (!events.has(dateKey)) events.set(dateKey, []);
            events.get(dateKey)!.push(crop);
        });
        return events;
    }, [plannedCrops]);
    
    const harvestEventsByDate = useMemo(() => {
        const events = new Map<string, { crop: Crop, id: string }[]>();
        plannedCrops.forEach(pc => {
            const growthMinutes = estimateGrowthTimeMinutes(pc.crop.mTier);
            const harvestDate = new Date(new Date(pc.plantDate).getTime() + growthMinutes * 60000);
            const dateKey = harvestDate.toDateString();
            if (!events.has(dateKey)) events.set(dateKey, []);
            events.get(dateKey)!.push(pc);
        });
        return events;
    },[plannedCrops]);

    const handlePrev = () => setCurrentDate(prev => { const d = new Date(prev); if (viewMode === 'month') d.setMonth(d.getMonth() - 1); else d.setDate(d.getDate() - 7); return d; });
    const handleNext = () => setCurrentDate(prev => { const d = new Date(prev); if (viewMode === 'month') d.setMonth(d.getMonth() + 1); else d.setDate(d.getDate() + 7); return d; });
    
    return(
        <div className="space-y-4">
            <PlanningAddCropModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddCrop={addPlannedCrop} />
            <div className="bg-[color:var(--card)] p-3 rounded-lg border border-[color:var(--border)] space-y-3">
                 <div className="flex justify-between items-center flex-wrap gap-2">
                    <div className="flex items-center space-x-2">
                        <button onClick={handlePrev} className="p-2 rounded-md hover:bg-[color:var(--secondary)]"><ArrowLeftIcon /></button>
                        <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1.5 text-sm font-semibold rounded-md border border-[color:var(--border)] hover:bg-[color:var(--secondary)]">{t('today')}</button>
                        <button onClick={handleNext} className="p-2 rounded-md hover:bg-[color:var(--secondary)]"><ArrowRightIcon /></button>
                    </div>
                    <h2 className="text-lg font-semibold text-center order-first w-full sm:order-none sm:w-auto">{formatDate(currentDate).replace(`, ${currentDate.getFullYear()}`, '')}, {currentDate.getFullYear()}</h2>
                    <div className="flex items-center space-x-2">
                        <div className="flex gap-1 bg-[color:var(--background)] border border-[color:var(--border)] p-1 rounded-lg">
                            <button onClick={() => setViewMode('month')} className={`p-1.5 rounded-md ${viewMode === 'month' ? 'bg-[color:var(--primary)] text-[color:var(--primary-foreground)]' : 'hover:bg-[color:var(--secondary)]'}`}><CalendarDaysIcon /></button>
                            <button onClick={() => setViewMode('week')} className={`p-1.5 rounded-md ${viewMode === 'week' ? 'bg-[color:var(--primary)] text-[color:var(--primary-foreground)]' : 'hover:bg-[color:var(--secondary)]'}`}><CalendarWeekIcon /></button>
                        </div>
                         <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 bg-[color:var(--primary)] text-[color:var(--primary-foreground)] p-2 rounded-lg hover:opacity-90"><PlusIcon className="w-5 h-5"/></button>
                    </div>
                </div>

                <div className={`grid ${viewMode === 'month' ? 'grid-cols-7' : 'grid-cols-1 md:grid-cols-7'} gap-1`}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => <div key={i} className="text-center font-bold text-xs p-1 opacity-70 hidden md:block">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}</div>)}
                    
                    {calendarDays.map(({ date, isCurrentMonth }, index) => {
                         const dayEvents = eventsByDate.get(date.toDateString()) || [];
                         const dayHarvests = harvestEventsByDate.get(date.toDateString()) || [];
                         const isToday = date.toDateString() === new Date().toDateString();
                         return (
                            <div key={index} className={`border border-[color:var(--border)] rounded-md p-1 min-h-[100px] ${isCurrentMonth ? '' : 'bg-[color:var(--secondary)]/50'}`}>
                                <time dateTime={date.toISOString()} className={`text-xs font-bold ${isToday ? 'bg-[color:var(--primary)] text-[color:var(--primary-foreground)] rounded-full w-5 h-5 flex items-center justify-center' : ''}`}>{date.getDate()}</time>
                                <div className="text-[10px] mt-1 space-y-0.5 overflow-y-auto max-h-[70px]">
                                    {dayEvents.map(event => (
                                         <div key={event.id} className="bg-blue-500/20 text-blue-300 p-1 rounded-sm truncate flex justify-between items-center" title={`Plant: ${event.crop.mName} at ${formatTime(event.plantDate)}`}>
                                            <span className="truncate">{event.crop.mName}</span>
                                            <button onClick={() => removePlannedCrop(event.id)}><TrashIcon className="w-3 h-3 text-blue-400 hover:text-red-500 flex-shrink-0"/></button>
                                        </div>
                                    ))}
                                     {dayHarvests.map(event => (
                                         <div key={event.id} className="bg-green-500/20 text-green-300 p-1 rounded-sm truncate" title={`Harvest: ${event.crop.mName}`}>
                                            <span className="truncate">{event.crop.mName}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                         );
                    })}
                </div>
            </div>
        </div>
    );
}

export default PlannerPage;