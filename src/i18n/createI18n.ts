import i18next, { type Resource } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

export function createI18n(resources: Resource) {
  const instance = i18next.createInstance()
  instance.use(LanguageDetector).init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'es'],
    load: 'languageOnly',
    initAsync: false,
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'axe-guide-language',
      caches: ['localStorage'],
    },
  })
  return instance
}
