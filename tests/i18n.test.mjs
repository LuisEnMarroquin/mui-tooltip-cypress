import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { createI18n } from '../src/i18n/createI18n.ts'

const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator')

afterEach(() => {
  if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow)
  else delete globalThis.window
  if (originalNavigator) Object.defineProperty(globalThis, 'navigator', originalNavigator)
  else delete globalThis.navigator
})

function browser(language, savedLanguage) {
  const values = new Map()
  if (savedLanguage) values.set('axe-guide-language', savedLanguage)
  const localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  }
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { localStorage } })
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: { language, languages: [language] },
  })
  return values
}

function instance() {
  return createI18n({
    en: { translation: { heading: 'What is axe?' } },
    es: { translation: { heading: 'Qué es axe' } },
  })
}

test('saved selection takes priority over browser language', () => {
  browser('en-US', 'es')
  const i18n = instance()
  assert.equal(i18n.resolvedLanguage, 'es')
  assert.equal(i18n.t('heading'), 'Qué es axe')
})

test('Spanish regional browser language resolves to Spanish', () => {
  const saved = browser('es-MX')
  const i18n = instance()
  assert.equal(i18n.resolvedLanguage, 'es')
  assert.equal(saved.get('axe-guide-language'), 'es-MX')
})

test('unsupported browser language falls back to English and switching persists', async () => {
  const saved = browser('fr-FR')
  const i18n = instance()
  assert.equal(i18n.resolvedLanguage, 'en')
  await i18n.changeLanguage('es')
  assert.equal(i18n.resolvedLanguage, 'es')
  assert.equal(saved.get('axe-guide-language'), 'es')
})
