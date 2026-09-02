// Catalogue for the public marketing site (Part 1). Kept separate from the
// inventory API so the website is fully static and deployable on its own.
// Images use a small inline SVG generator so the project ships with zero
// binary assets while still showing distinct visuals per product.

export const SITE_PRODUCTS = [
  {
    id: 'solitaire-ring',
    name: 'Aurora Solitaire Ring',
    category: 'Engagement Rings',
    carat: '1.02 ct',
    cut: 'Round Brilliant',
    description:
      'A single round-brilliant centre stone set in a whisper-thin platinum band. GIA-certified, D colour, VVS1 clarity.',
    tone: '#c9a877',
  },
  {
    id: 'tennis-necklace',
    name: 'Ligne Tennis Necklace',
    category: 'Necklaces',
    carat: '5.40 ct total',
    cut: 'Round Brilliant',
    description:
      'Forty-two graduated diamonds in a continuous line, each individually claw-set for uninterrupted brilliance.',
    tone: '#8fb3c9',
  },
  {
    id: 'halo-ring',
    name: 'Céleste Halo Ring',
    category: 'Engagement Rings',
    carat: '0.90 ct',
    cut: 'Cushion',
    description:
      'A cushion-cut centre framed by a micro-pavé halo that lifts the stone and amplifies its spread.',
    tone: '#d4b483',
  },
  {
    id: 'drop-earrings',
    name: 'Rosée Drop Earrings',
    category: 'Earrings',
    carat: '2.10 ct pair',
    cut: 'Pear',
    description:
      'Pear-shaped drops suspended from a diamond-set bail, engineered to move with the wearer and catch the light.',
    tone: '#c9a877',
  },
  {
    id: 'diamond-bangle',
    name: 'Méridien Diamond Bangle',
    category: 'Bracelets',
    carat: '3.75 ct total',
    cut: 'Baguette',
    description:
      'Channel-set baguettes in an architectural bangle — a clean, contemporary line for the modern collection.',
    tone: '#9aa7b8',
  },
  {
    id: 'loose-round',
    name: 'Round Brilliant Loose',
    category: 'Loose Diamonds',
    carat: '1.00 ct',
    cut: 'Round Brilliant',
    description:
      'Individually certified loose stones for jewellers and bespoke commissions. Full grading report with every diamond.',
    tone: '#e2d3b0',
  },
]

export const WHY_CHOOSE_US = [
  {
    title: 'Certified at source',
    body: 'Every diamond ships with GIA or IGI certification. No exceptions, no substitutions — the report matches the stone.',
  },
  {
    title: 'Global reach',
    body: 'Bonded logistics and insured shipping to 40+ countries, with customs documentation handled end to end.',
  },
  {
    title: 'Conflict-free supply',
    body: 'Full Kimberley Process compliance and audited supplier chains, from rough to polished.',
  },
  {
    title: 'Reliable supply',
    body: 'Consistent grading and dependable lead times, so your inventory planning is never a guessing game.',
  },
]
