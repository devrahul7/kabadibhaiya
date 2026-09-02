'use client';
import { useLang } from '@/context/LanguageContext';

export default function LanguageToggle() {
  const { lang, toggleLang, t } = useLang();

  return (
    <button 
      onClick={toggleLang}
      className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-full font-medium transition-colors text-sm"
    >
      {lang === 'en' ? '🇳🇵 NP' : '🇬🇧 EN'}
    </button>
  );
}
