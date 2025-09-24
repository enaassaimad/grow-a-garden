// FIX: Create new file with all necessary type definitions.
export enum Theme {
    Dark = 'theme-dark',
    Nature = 'theme-nature',
    Pastel = 'theme-pastel',
    Minimalist = 'theme-minimalist',
}

export enum Language {
    EN = 'en',
    FR = 'fr',
    AR = 'ar',
    ES = 'es',
    ZH = 'zh',
    RU = 'ru',
    DE = 'de',
}

export const languageConfig: Record<Language, { name: string; dir: 'ltr' | 'rtl'; icon: string }> = {
    [Language.EN]: { name: 'English', dir: 'ltr', icon: '🇬🇧' },
    [Language.FR]: { name: 'Français', dir: 'ltr', icon: '🇫🇷' },
    [Language.AR]: { name: 'العربية', dir: 'rtl', icon: '🇸🇦' },
    [Language.ES]: { name: 'Español', dir: 'ltr', icon: '🇪🇸' },
    [Language.ZH]: { name: '中文', dir: 'ltr', icon: '🇨🇳' },
    [Language.RU]: { name: 'Русский', dir: 'ltr', icon: '🇷🇺' },
    [Language.DE]: { name: 'Deutsch', dir: 'ltr', icon: '🇩🇪' },
};

export interface Pet {
    mId: number;
    mName: string;
    mNameIcon: string;
    mTier: string;
    mObtainable: string;
    mObtaining_method: string;
    mHatch_chance: string;
    mPassive: string;
    mGeneral: string;
    mTrivia: string;
    mValue: string;
}

export interface Crop {
    mId: number;
    mName: string;
    mNameIcon: string;
    mTier: string;
    mObtainable: string;
    mMultiharvest: string;
    mPrice: string;
    mPrice_Rb: string;
    mSell_value: string;
    mObtainable_way: string;
    mTrivia: string;
    mShop: number;
    mNameShop: string;
    mStock: string;
    mCoin: string;
    mRb: string;
    mValue: string;
}

export interface Guide {
    id: string;
    title: string;
    category: 'Getting Started' | 'Farming' | 'Pets' | 'Advanced';
    summary: string;
    content: string; // Markdown content
}