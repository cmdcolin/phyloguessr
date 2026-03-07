import { useState } from 'react'

export function ShareButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      className="share-icon-btn"
      title={copied ? 'Copied!' : 'Share link'}
      onClick={() => {
        navigator.clipboard.writeText(url).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
      }}
    >
      {copied ? '✓' : '🔗'}
    </button>
  )
}
