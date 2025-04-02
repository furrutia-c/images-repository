import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en/translation.json';
import esTranslation from './locales/es/translation.json';

// los recursos para nuestros idiomas
const resources = {
  en: {
    translation: enTranslation
  },
  es: {
    translation: esTranslation
  }
};

i18n
  // detecta el idioma del usuario (navegador)
  .use(LanguageDetector)
  // pasa la instancia i18n a react-i18next
  .use(initReactI18next)
  // inicializa i18next
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // no es necesario para React
    }
  });

export default i18n;