'use client';
import { createContext, useContext, useState } from 'react';
import { TRANSLATIONS } from '@/lib/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');
  
  const t = (section, key) => {
    try {
      return TRANSLATIONS[lang]?.[section]?.[key] || TRANSLATIONS['en']?.[section]?.[key] || key;
    } catch(e) {
      return key;
    }
  };
  
  const toggleLang = () => setLang(l => l === 'en' ? 'np' : 'en');
  
  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
