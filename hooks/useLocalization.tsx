import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Language, languageConfig } from '../types';

interface LocalizationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

function isValidLanguage(value: any): value is Language {
  return Object.values(Language).includes(value);
}

const getInitialLanguage = (): Language => {
    const savedLang = localStorage.getItem('language');
    if (savedLang && isValidLanguage(savedLang)) {
        return savedLang;
    }
    const browserLang = navigator.language.split('-')[0];
    if (isValidLanguage(browserLang)) {
        return browserLang;
    }
    return Language.EN;
};

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // Always load English as a fallback
        const enResponse = await fetch('./locales/en.json');
        const enData = await enResponse.json();
        
        let langData = enData;
        if (language !== Language.EN) {
          const langResponse = await fetch(`./locales/${language}.json`);
          if (langResponse.ok) {
              const specificLangData = await langResponse.json();
              // Merge with English, so English is the fallback for missing keys
              langData = { ...enData, ...specificLangData };
          }
        }
        
        setTranslations(langData);
      } catch (error) {
        console.error('Failed to load translations:', error);
        // Fallback to English if the selected language fails to load
        const enResponse = await fetch('./locales/en.json');
        const enData = await enResponse.json();
        setTranslations(enData);
      } finally {
        setIsLoaded(true);
      }
    };

    loadTranslations();
  }, [language]);


  useEffect(() => {
    const root = window.document.documentElement;
    root.lang = language;
    root.dir = languageConfig[language].dir;
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = useCallback((newLanguage: Language) => {
    if (isValidLanguage(newLanguage)) {
        setIsLoaded(false); // Set to unloaded while new language is fetching
        setLanguageState(newLanguage);
    }
  }, []);
  
  const t = useCallback((key: string): string => {
    return translations[key] || key;
  }, [translations]);

  // Render children only after translations are loaded to prevent flicker
  if (!isLoaded) {
      return null;
  }

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
