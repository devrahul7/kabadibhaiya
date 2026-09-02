'use client';
import { useLang } from '@/context/LanguageContext';

export default function LanguageToggle({ className = '' }) {
  const { lang, setLang } = useLang();

  return (
    <div className={`inline-flex items-center bg-gray-100 p-1 rounded-full border border-gray-200 shadow-xs ${className}`}>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
          lang === 'en'
            ? 'bg-primary text-white shadow-xs'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
        }`}
        title="Switch language to English"
      >
        <span className="text-sm">🇬🇧</span>
        <span>English</span>
      </button>

      <button
        type="button"
        onClick={() => setLang('np')}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
          lang === 'np'
            ? 'bg-primary text-white shadow-xs'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
        }`}
        title="नेपाली भाषामा हेर्नुहोस्"
      >
        <span className="text-sm">🇳🇵</span>
        <span>नेपाली</span>
      </button>
    </div>
  );
}
