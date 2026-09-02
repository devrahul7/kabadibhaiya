'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS } from '@/lib/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  // Load persisted language from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kb_lang');
      if (saved === 'en' || saved === 'np') {
        setLang(saved);
      }
    } catch {}
  }, []);

  const changeLang = (newLang) => {
    setLang(newLang);
    try {
      localStorage.setItem('kb_lang', newLang);
    } catch {}
  };

  const toggleLang = () => {
    const next = lang === 'en' ? 'np' : 'en';
    changeLang(next);
  };

  const t = (section, key) => {
    try {
      return (
        TRANSLATIONS[lang]?.[section]?.[key] ||
        TRANSLATIONS['en']?.[section]?.[key] ||
        key
      );
    } catch {
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
