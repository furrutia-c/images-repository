import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setIsOpen(false);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Determinar el idioma actual para mostrar en el botón
  const getCurrentLanguageLabel = () => {
    if (i18n.language === 'es' || i18n.language.startsWith('es-')) {
      return t('language.es');
    }
    return t('language.en');
  };
  
  // Determinar la bandera del idioma actual
  const getCurrentLanguageFlag = () => {
    if (i18n.language === 'es' || i18n.language.startsWith('es-')) {
      return "🇪🇸";
    }
    return "🇬🇧";
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-1 px-2 py-1 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{getCurrentLanguageFlag()}</span>
        <span className="hidden sm:inline">{getCurrentLanguageLabel()}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
            clipRule="evenodd" 
          />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
          <ul className="py-1" role="listbox">
            <li>
              <button
                className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm ${
                  i18n.language === 'en' || i18n.language.startsWith('en-')
                    ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => changeLanguage('en')}
                role="option"
                aria-selected={i18n.language === 'en' || i18n.language.startsWith('en-')}
              >
                <span>🇬🇧</span>
                <span>{t('language.en')}</span>
              </button>
            </li>
            <li>
              <button
                className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm ${
                  i18n.language === 'es' || i18n.language.startsWith('es-')
                    ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => changeLanguage('es')}
                role="option"
                aria-selected={i18n.language === 'es' || i18n.language.startsWith('es-')}
              >
                <span>🇪🇸</span>
                <span>{t('language.es')}</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;