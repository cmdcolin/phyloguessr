export default function TreeIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <line x1="4" y1="16" x2="12" y2="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="12" y1="16" x2="12" y2="8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="12" y1="16" x2="12" y2="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="12" y1="8" x2="20" y2="8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="20" y1="8" x2="20" y2="4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="20" y1="8" x2="20" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="20" y1="4" x2="28" y2="4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="20" y1="12" x2="28" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="12" y1="24" x2="28" y2="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="28" cy="4" r="2.5" fill="#2a7a2a" />
      <circle cx="28" cy="12" r="2.5" fill="#2a7a2a" />
      <circle cx="28" cy="24" r="2.5" fill="#888" />
    </svg>
  )
}
