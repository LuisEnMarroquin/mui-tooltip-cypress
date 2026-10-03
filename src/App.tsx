import { useEffect, useRef, useState } from 'react'
import Toc from './components/Toc'
import { EN_SECTIONS } from './content/en'
import { ES_SECTIONS } from './content/es'
import { i18n, messages, useLanguage } from './i18n'

const WORDS_PER_MINUTE = 200

export default function App() {
  const language = useLanguage()
  const sections = language === 'es' ? ES_SECTIONS : EN_SECTIONS
  const t = messages[language]
  const [active, setActive] = useState(EN_SECTIONS[0].id)
  const [minutes, setMinutes] = useState<number | null>(null)
  const article = useRef<HTMLElement>(null)

  useEffect(() => {
    const words = article.current?.innerText.split(/\s+/).filter(Boolean).length ?? 0
    setMinutes(Math.max(1, Math.round(words / WORDS_PER_MINUTE)))
  }, [language])

  useEffect(() => {
    document.documentElement.lang = language
    document.title = t.page.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.page.description)
  }, [language, t])

  useEffect(() => {
    // The observer only says "something crossed the band"; the active section is then
    // recomputed from real positions, so jumping across several sections stays correct.
    const update = () => {
      const line = window.innerHeight * 0.25
      let current = sections[0].id
      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element && element.getBoundingClientRect().top <= line) current = section.id
      }
      setActive(current)
    }

    const observer = new IntersectionObserver(update, { rootMargin: '-15% 0px -75% 0px' })
    for (const section of sections) {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
    }
    update()

    return () => observer.disconnect()
  }, [sections])

  return (
    <>
      <a className="skip" href="#contenido">
        {t.page.skip}
      </a>

      <header className="hero">
        <div className="wrap">
          <div className="hero-top">
            <p className="kicker">{t.page.kicker}</p>
            <div className="language-switch" role="group" aria-label={t.language.label}>
              <button type="button" lang="en" aria-pressed={language === 'en'} onClick={() => void i18n.changeLanguage('en')}>{t.language.english}</button>
              <button type="button" lang="es" aria-pressed={language === 'es'} onClick={() => void i18n.changeLanguage('es')}>{t.language.spanish}</button>
            </div>
          </div>
          <h1>
            axe, <em>{t.page.heading}</em>
          </h1>
          <p className="hero-lead">{t.page.lead}</p>
          <ul className="meta">
            {minutes !== null && <li>{minutes} {t.page.readingTime}</li>}
            <li>{sections.length} {t.page.sections}</li>
            <li>{t.page.reviewed}</li>
          </ul>
        </div>
      </header>

      <div className="wrap shell">
        <Toc sections={sections} active={active} />

        <main id="contenido" className="article" ref={article}>
          {sections.map((section, index) => (
            <section id={section.id} key={section.id} className="section">
              <header>
                <span className="section-num">{String(index + 1).padStart(2, '0')}</span>
                <h2>
                  <a href={`#${section.id}`}>{section.title}</a>
                </h2>
              </header>
              <p className="section-lead">{section.lead}</p>
              {section.body}
            </section>
          ))}
        </main>
      </div>

      <footer className="footer">
        <div className="wrap">
          <p>{t.page.footer}</p>
        </div>
      </footer>
    </>
  )
}
