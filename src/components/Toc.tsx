import { useEffect } from 'react'
import type { Section } from '../content/types'
import { useMessages } from '../i18n'

type Props = {
  sections: Section[]
  active: string
}

export default function Toc({ sections, active }: Props) {
  const t = useMessages()
  // Keep the active entry visible when the list scrolls (sticky column or phone pill bar).
  useEffect(() => {
    document
      .querySelector('.toc [aria-current="true"]')
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [active])

  return (
    <nav className="toc" aria-label={t.navigation.contents}>
      <p className="toc-label">{t.navigation.contents}</p>
      <ol>
        {sections.map((section, index) => (
          <li key={section.id}>
            <a href={`#${section.id}`} aria-current={active === section.id ? 'true' : undefined}>
              <span className="toc-num">{String(index + 1).padStart(2, '0')}</span>
              {section.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
