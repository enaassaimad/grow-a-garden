import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { Theme, Language, languageConfig } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import Modal from '../components/Modal';

const SettingsPage: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const { language, setLanguage, t } = useLocalization();
    const [isPrivacyModalOpen, setPrivacyModalOpen] = useState(false);
    const [isTermsModalOpen, setTermsModalOpen] = useState(false);

    const themes = [
        { id: Theme.Dark, name: t('themeDarkMode') },
        { id: Theme.Nature, name: t('themeNatureGreen') },
        { id: Theme.Pastel, name: t('themePastel') },
        { id: Theme.Minimalist, name: t('themeMinimalist') },
    ];

    const handleResetSettings = () => {
        if (confirm(t('resetSettingsConfirmation'))) {
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <div className="p-4 space-y-8">
            <h1 className="text-3xl font-bold text-[color:var(--primary)]">{t('settingsTitle')}</h1>

             <section>
                <h2 className="text-xl font-semibold text-[color:var(--card-foreground)] mb-3">{t('settingsLanguage')}</h2>
                <div className="bg-[color:var(--card)] p-4 rounded-lg border border-[color:var(--border)]">
                     <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as Language)}
                        className="w-full p-3 rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] focus:ring-2 focus:ring-[color:var(--primary)] outline-none"
                    >
                        {Object.entries(languageConfig).map(([langCode, { name, icon }]) => (
                            <option key={langCode} value={langCode}>{icon} {name}</option>
                        ))}
                    </select>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-[color:var(--card-foreground)] mb-3">{t('settingsTheme')}</h2>
                <div className="grid grid-cols-2 gap-4">
                    {themes.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTheme(t.id)}
                            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                                theme === t.id ? 'border-[color:var(--primary)] ring-2 ring-[color:var(--primary)]' : 'border-[color:var(--border)]'
                            }`}
                        >
                            <div className={`w-full h-12 rounded mb-2 ${t.id}-preview`}></div>
                            <span className="font-medium text-[color:var(--foreground)]">{t.name}</span>
                        </button>
                    ))}
                </div>
                 <style>{`
                    .theme-dark-preview { background: linear-gradient(135deg, #111827, #1f2937, #22c55e); }
                    .theme-nature-preview { background: linear-gradient(135deg, #f0fdf4, #bbf7d0, #22c55e); }
                    .theme-pastel-preview { background: linear-gradient(135deg, #FFF7ED, #FED7AA, #FB923C); }
                    .theme-minimalist-preview { background: linear-gradient(135deg, #F9FAFB, #E5E7EB, #6B7280); }
                `}</style>
            </section>
            
            <section>
                <h2 className="text-xl font-semibold text-[color:var(--card-foreground)] mb-3">{t('settingsInformation')}</h2>
                <div className="bg-[color:var(--card)] p-4 rounded-lg border border-[color:var(--border)] divide-y divide-[color:var(--border)]">
                    <div className="py-2 flex justify-between items-center">
                        <span className="font-medium">{t('appVersion')}</span>
                        <span className="text-[color:var(--foreground)] opacity-80">1.1.0</span>
                    </div>
                     <button onClick={() => setPrivacyModalOpen(true)} className="w-full text-left py-3 font-medium hover:text-[color:var(--primary)] transition-colors">{t('settingsPrivacyPolicy')}</button>
                    <button onClick={() => setTermsModalOpen(true)} className="w-full text-left py-3 font-medium hover:text-[color:var(--primary)] transition-colors">{t('settingsTermsOfUse')}</button>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-[color:var(--card-foreground)] mb-3">{t('settingsDataManagement')}</h2>
                <div className="bg-[color:var(--card)] p-4 rounded-lg border border-[color:var(--border)]">
                    <p className="text-[color:var(--foreground)] opacity-80 mb-4">{t('settingsResetDesc')}</p>
                    <button 
                        onClick={handleResetSettings}
                        className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        {t('settingsResetButton')}
                    </button>
                </div>
            </section>

            <Modal isOpen={isPrivacyModalOpen} onClose={() => setPrivacyModalOpen(false)} title={t('privacyPolicyTitle')}>
                <p className="whitespace-pre-wrap leading-relaxed">{t('privacyPolicyContent')}</p>
            </Modal>
             <Modal isOpen={isTermsModalOpen} onClose={() => setTermsModalOpen(false)} title={t('termsOfUseTitle')}>
                <p className="whitespace-pre-wrap leading-relaxed">{t('termsOfUseContent')}</p>
            </Modal>
        </div>
    );
};

export default SettingsPage;