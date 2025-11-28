// i18n configuration
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// translation resources
const resources = {
  en: {
    translation: {
      home: 'Home',
      menu: 'Menu',
      ourStory: 'Our Story',
      contact: 'Contact',
      login: 'Login',
      logout: 'Logout',
    },
  },
  ps: {
    translation: {
      home: 'کور',
      menu: 'مینو',
      ourStory: 'زموږ کیسه',
      contact: 'اړیکه',
      login: 'ننوتل',
      logout: 'وتل',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
