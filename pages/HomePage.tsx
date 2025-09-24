import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PawIcon, LeafIcon, CalendarIcon, LightbulbIcon, StarIcon, InfoIcon } from '../components/Icons';
import Modal from '../components/Modal';
import { useLocalization } from '../hooks/useLocalization';

const FeatureCard = ({ to, icon, title, description }: { to: string, icon: React.ReactNode, title: string, description: string }) => (
  <Link to={to} className="bg-[color:var(--card)] p-4 rounded-lg shadow-md border border-[color:var(--border)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-start space-x-4">
    <div className="text-[color:var(--primary)] bg-[color:var(--primary)]/10 p-3 rounded-full">
      {icon}
    </div>
    <div>
      <h3 className="font-bold text-lg text-[color:var(--card-foreground)]">{title}</h3>
      <p className="text-sm text-[color:var(--foreground)] opacity-80">{description}</p>
    </div>
  </Link>
);

const HomePage: React.FC = () => {
    const { t } = useLocalization();
    const [isAboutModalOpen, setAboutModalOpen] = useState(false);
    const [isRateModalOpen, setRateModalOpen] = useState(false);
    const [rating, setRating] = useState(0);

  return (
    <div className="p-4 space-y-8">
      <header className="text-center py-8 bg-[color:var(--card)] rounded-xl border border-[color:var(--border)] overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <style>{`.bg-grid-pattern { background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(to right, var(--border) 1px, var(--card) 1px); background-size: 20px 20px; }`}</style>
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center">
                <LeafIcon className="w-12 h-12 text-[color:var(--primary)] -rotate-12 transform transition-transform duration-500 group-hover:rotate-0"/>
                <div className="text-left ml-2">
                    <h1 className="text-4xl font-bold text-[color:var(--primary)] drop-shadow-sm">{t('homeHeaderTitle')}</h1>
                    <h2 className="text-xl text-[color:var(--foreground)] opacity-90">{t('homeHeaderSubtitle')}</h2>
                </div>
            </div>
            <p className="max-w-md mx-auto mt-4 text-[color:var(--foreground)] opacity-80">
                {t('homeDescription')}
            </p>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FeatureCard 
          to="/pets" 
          icon={<PawIcon />} 
          title={t('homePetsCardTitle')} 
          description={t('homePetsCardDesc')} 
        />
        <FeatureCard 
          to="/crops" 
          icon={<LeafIcon />} 
          title={t('homeCropsCardTitle')} 
          description={t('homeCropsCardDesc')} 
        />
        <FeatureCard 
          to="/planner" 
          icon={<CalendarIcon />} 
          title={t('homePlannerCardTitle')} 
          description={t('homePlannerCardDesc')} 
        />
        <FeatureCard 
          to="/guides" 
          icon={<LightbulbIcon />} 
          title={t('homeGuidesCardTitle')} 
          description={t('homeGuidesCardDesc')} 
        />
      </div>

       <div className="flex justify-center items-center gap-4 pt-4">
            <button onClick={() => setRateModalOpen(true)} className="flex items-center gap-2 font-semibold text-sm py-2 px-4 rounded-lg bg-[color:var(--secondary)] text-[color:var(--secondary-foreground)] hover:opacity-80 transition-opacity">
                <StarIcon className="w-5 h-5"/> {t('buttonRateApp')}
            </button>
            <button onClick={() => setAboutModalOpen(true)} className="flex items-center gap-2 font-semibold text-sm py-2 px-4 rounded-lg bg-[color:var(--secondary)] text-[color:var(--secondary-foreground)] hover:opacity-80 transition-opacity">
                <InfoIcon className="w-5 h-5"/> {t('buttonAbout')}
            </button>
        </div>

        <Modal isOpen={isAboutModalOpen} onClose={() => setAboutModalOpen(false)} title={t('aboutModalTitle')}>
            <div className="space-y-4 text-[color:var(--foreground)] opacity-90">
                <p>{t('aboutModalContent1')}</p>
                <p>{t('aboutModalContent2')}</p>
                <p><strong>{t('appVersion')}:</strong> 1.1.0</p>
            </div>
        </Modal>

        <Modal isOpen={isRateModalOpen} onClose={() => setRateModalOpen(false)} title={t('rateModalTitle')}>
            <div className="text-center space-y-4">
                <p className="text-[color:var(--foreground)] opacity-90">{t('rateModalContent')}</p>
                <div className="flex justify-center items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} onClick={() => setRating(star)} onMouseOver={() => setRating(star)} onMouseLeave={() => setRating(rating)}>
                            <StarIcon className={`w-10 h-10 transition-colors ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-500'}`} />
                        </button>
                    ))}
                </div>
                {rating > 0 && <p className="font-semibold text-[color:var(--primary)]">{t('rateModalThanks')}</p>}
            </div>
        </Modal>
    </div>
  );
};

export default HomePage;