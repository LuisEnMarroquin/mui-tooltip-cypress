import { useSyncExternalStore } from 'react'
import { createI18n } from './createI18n'
import en from './en.json'
import es from './es.json'

export type Language = 'en' | 'es'
export const messages = { en, es }

export const i18n = createI18n({ en: { translation: en }, es: { translation: es } })

function currentLanguage(): Language {
  return i18n.resolvedLanguage === 'es' ? 'es' : 'en'
}

function subscribe(onChange: () => void) {
  i18n.on('languageChanged', onChange)
  return () => i18n.off('languageChanged', onChange)
}

export function useLanguage() {
  return useSyncExternalStore(subscribe, currentLanguage, currentLanguage)
}

export function useMessages() {
  return messages[useLanguage()]
}
