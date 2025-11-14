import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from './locales/translations';

i18n
  .use(initReactI18next)
  .init({
    resources: {
        en: { translation: translations.en},
        fi: { translation: translations.fi}
    },
    lng: localStorage.getItem('language') || 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    
  });

export default i18n;