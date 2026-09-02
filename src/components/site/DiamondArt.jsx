// A small procedural diamond illustration so each product has a distinct,
// on-brand visual without shipping binary image assets.
export default function DiamondArt({ tone = '#c9a877', className = '' }) {
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Diamond illustration">
      <defs>
        <linearGradient id={`bg-${tone}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a2029" />
          <stop offset="100%" stopColor="#12161c" />
        </linearGradient>
        <linearGradient id={`facet-${tone}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tone} stopOpacity="0.95" />
          <stop offset="100%" stopColor={tone} stopOpacity="0.45" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#bg-${tone})`} />
      <g transform="translate(100 100)" stroke={tone} strokeOpacity="0.9" strokeWidth="1">
        {/* crown outline */}
        <polygon points="-46,-16 -28,-40 28,-40 46,-16 0,52" fill={`url(#facet-${tone})`} fillOpacity="0.55" />
        {/* table + facet lines */}
        <line x1="-46" y1="-16" x2="46" y2="-16" />
        <line x1="-28" y1="-40" x2="-18" y2="-16" />
        <line x1="28" y1="-40" x2="18" y2="-16" />
        <line x1="0" y1="-40" x2="0" y2="-16" strokeOpacity="0.5" />
        <line x1="-46" y1="-16" x2="0" y2="52" />
        <line x1="46" y1="-16" x2="0" y2="52" />
        <line x1="-18" y1="-16" x2="0" y2="52" strokeOpacity="0.5" />
        <line x1="18" y1="-16" x2="0" y2="52" strokeOpacity="0.5" />
        <line x1="0" y1="-16" x2="0" y2="52" strokeOpacity="0.35" />
      </g>
    </svg>
  )
}
