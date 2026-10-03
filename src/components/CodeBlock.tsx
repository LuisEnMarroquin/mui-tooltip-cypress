import { useState, type ReactNode } from 'react'
import { useMessages } from '../i18n'

type Props = {
  code: string
  caption?: string
  lang?: 'js' | 'plain'
}

// Comments, strings, keywords, numbers and axe/Cypress calls in short samples.
const TOKEN =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`)|\b(const|let|var|function|return|if|else|import|from|export|default|new|true|false|null|undefined|type|declare|interface|await|async|describe|it)\b|\b(\d+(?:\.\d+)?)\b|\b(axe|cy)\b/g

const CLASSES = ['', 'c', 's', 'k', 'n', 'p']

function highlight(code: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0

  for (const match of code.matchAll(TOKEN)) {
    if (match.index > last) out.push(code.slice(last, match.index))
    const group = match.findIndex((value, i) => i > 0 && value !== undefined)
    out.push(
      <span key={match.index} className={`tok-${CLASSES[group]}`}>
        {match[0]}
      </span>,
    )
    last = match.index + match[0].length
  }

  if (last < code.length) out.push(code.slice(last))
  return out
}

export default function CodeBlock({ code, caption, lang = 'js' }: Props) {
  const t = useMessages()
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard access can be blocked; the code stays selectable.
    }
  }

  return (
    <figure className="code">
      <figcaption className="code-bar">
        <span>{caption ?? ''}</span>
        <button type="button" className="code-copy" onClick={copy}>
          {copied ? t.code.copied : t.code.copy}
        </button>
      </figcaption>
      <pre tabIndex={0}>
        <code>{lang === 'js' ? highlight(code) : code}</code>
      </pre>
    </figure>
  )
}
