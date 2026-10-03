import type { ReactNode } from 'react'
import { useMessages } from '../i18n'

type Tone = 'note' | 'tip' | 'warn'

type Props = {
  tone?: Tone
  title?: string
  children: ReactNode
}

export default function Callout({ tone = 'note', title, children }: Props) {
  const t = useMessages()
  return (
    <aside className={`callout callout-${tone}`}>
      <strong className="callout-title">{title ?? t.callout[tone]}</strong>
      <div>{children}</div>
    </aside>
  )
}
