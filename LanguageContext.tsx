
// FIX: Removed unused 'useEffect' import.
import React, { createContext, useState, useContext, ReactNode, FC } from 'react';
import { translations, TranslationKeys } from './translations';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getInitialLanguage = (): Language => {
    const storedLang = localStorage.getItem('language') as Language;
    if (storedLang && ['en', 'hi'].includes(storedLang)) {
        return storedLang;
    }
    return 'en';
};

// FIX: Refactored to use a named interface for props. The previous inline type
// might have caused a type inference issue, leading to the error in index.tsx.
interface LanguageProviderProps {
  children: ReactNode;
}

// FIX: Explicitly typing LanguageProvider as a React.FC helps TypeScript correctly
// infer the `children` prop, resolving the type error in `index.tsx`.
export const LanguageProvider: FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage());

  const setLanguage = (lang: Language) => {
      localStorage.setItem('language', lang);
      setLanguageState(lang);
  };

  const t = (key: TranslationKeys): string => {
    const langTranslations = translations[language];
    return (langTranslations as any)[key] || (translations.en as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
