export default function TreeIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient
          id="treeRainbow"
          gradientUnits="userSpaceOnUse"
          x1="4"
          y1="4"
          x2="28"
          y2="24"
        >
          <stop offset="0%" stopColor="#ff3333" />
          <stop offset="40%" stopColor="#ff9000" />
          <stop offset="70%" stopColor="#ffe600" />
          <stop offset="100%" stopColor="#00b0ff" />
        </linearGradient>
      </defs>
      <line
        x1="4"
        y1="16"
        x2="12"
        y2="16"
        stroke="url(#treeRainbow)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="16"
        x2="12"
        y2="8"
        stroke="url(#treeRainbow)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="16"
        x2="12"
        y2="24"
        stroke="url(#treeRainbow)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="8"
        x2="20"
        y2="8"
        stroke="url(#treeRainbow)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="20"
        y1="8"
        x2="20"
        y2="4"
        stroke="url(#treeRainbow)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="20"
        y1="8"
        x2="20"
        y2="12"
        stroke="url(#treeRainbow)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="20"
        y1="4"
        x2="28"
        y2="4"
        stroke="url(#treeRainbow)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="20"
        y1="12"
        x2="28"
        y2="12"
        stroke="url(#treeRainbow)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="24"
        x2="28"
        y2="24"
        stroke="url(#treeRainbow)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="28" cy="4" r="2.5" fill="url(#treeRainbow)" />
      <circle cx="28" cy="12" r="2.5" fill="url(#treeRainbow)" />
      <circle cx="28" cy="24" r="2.5" fill="url(#treeRainbow)" />
    </svg>
  );
}
