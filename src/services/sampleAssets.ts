import type { GalleryAsset } from '../types/project';

// Helper to encode SVG to data URI
function svgToUri(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}

export const PRESET_ILLUSTRATIONS: GalleryAsset[] = [
  {
    id: 'ill-monstera',
    name: 'Monstera Frond',
    category: 'illustrations',
    type: 'svg',
    createdAt: Date.now() - 50000,
    width: 200,
    height: 240,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" fill="none">
        <path d="M100 230 C95 180 98 120 100 20" stroke="#5E6547" stroke-width="4" stroke-linecap="round"/>
        <path d="M100 30 C120 35 155 55 160 85 C164 110 145 130 135 132 C125 134 115 125 102 120" fill="#777D5E" opacity="0.9"/>
        <path d="M98 50 C75 58 45 80 40 110 C36 135 55 155 65 156 C75 157 85 145 98 138" fill="#777D5E" opacity="0.9"/>
        <path d="M100 110 C125 120 165 145 155 180 C145 200 120 200 102 185" fill="#777D5E" opacity="0.85"/>
        <path d="M98 130 C75 140 35 165 45 200 C55 215 80 205 98 190" fill="#777D5E" opacity="0.85"/>
        <ellipse cx="100" cy="80" rx="3" ry="12" transform="rotate(25 100 80)" fill="#FFFEFA"/>
        <ellipse cx="100" cy="120" rx="4" ry="16" transform="rotate(-25 100 120)" fill="#FFFEFA"/>
        <ellipse cx="100" cy="160" rx="4" ry="14" transform="rotate(20 100 160)" fill="#FFFEFA"/>
      </svg>
    `)
  },
  {
    id: 'ill-olive',
    name: 'Olive Branch',
    category: 'illustrations',
    type: 'svg',
    createdAt: Date.now() - 40000,
    width: 220,
    height: 180,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 180" fill="none">
        <path d="M20 160 Q100 120 200 30" stroke="#777D5E" stroke-width="3" stroke-linecap="round"/>
        <!-- leaves -->
        <path d="M60 135 C50 110 65 95 80 100 C95 105 85 130 60 135 Z" fill="#888E6D"/>
        <path d="M85 125 C105 110 115 90 105 80 C95 70 80 95 85 125 Z" fill="#777D5E"/>
        <path d="M120 105 C110 80 125 65 140 70 C155 75 145 100 120 105 Z" fill="#888E6D"/>
        <path d="M145 90 C165 75 175 55 165 45 C155 35 140 60 145 90 Z" fill="#777D5E"/>
        <path d="M180 60 C185 35 205 30 210 40 C215 55 195 70 180 60 Z" fill="#888E6D"/>
        <!-- olives -->
        <ellipse cx="75" cy="142" rx="7" ry="10" transform="rotate(-20 75 142)" fill="#3D4030"/>
        <ellipse cx="138" cy="108" rx="7" ry="10" transform="rotate(15 138 108)" fill="#3D4030"/>
      </svg>
    `)
  },
  {
    id: 'ill-ginkgo',
    name: 'Ginkgo Biloba',
    category: 'illustrations',
    type: 'svg',
    createdAt: Date.now() - 35000,
    width: 180,
    height: 200,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 200" fill="none">
        <path d="M90 190 Q90 140 90 110" stroke="#A67B5B" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M90 110 C50 105 15 70 30 35 C42 10 75 30 90 60 C105 30 138 10 150 35 C165 70 130 105 90 110 Z" fill="#D99379" opacity="0.9"/>
        <path d="M90 110 Q65 60 45 40" stroke="#FFFEFA" stroke-width="1" opacity="0.6"/>
        <path d="M90 110 Q78 50 65 30" stroke="#FFFEFA" stroke-width="1" opacity="0.6"/>
        <path d="M90 110 Q90 50 90 25" stroke="#FFFEFA" stroke-width="1" opacity="0.6"/>
        <path d="M90 110 Q102 50 115 30" stroke="#FFFEFA" stroke-width="1" opacity="0.6"/>
        <path d="M90 110 Q115 60 135 40" stroke="#FFFEFA" stroke-width="1" opacity="0.6"/>
      </svg>
    `)
  },
  {
    id: 'ill-terracotta-vase',
    name: 'Artisan Vase',
    category: 'illustrations',
    type: 'svg',
    createdAt: Date.now() - 30000,
    width: 160,
    height: 220,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 220" fill="none">
        <ellipse cx="80" cy="50" rx="25" ry="6" fill="#C57E65"/>
        <path d="M55 50 Q55 70 40 100 Q20 140 45 180 Q60 195 80 195 Q100 195 115 180 Q140 140 120 100 Q105 70 105 50 Z" fill="#D99379"/>
        <path d="M40 100 Q15 115 35 140" stroke="#C57E65" stroke-width="6" fill="none" stroke-linecap="round"/>
        <circle cx="80" cy="130" r="18" fill="#EED4C5" opacity="0.6"/>
        <line x1="50" y1="160" x2="110" y2="160" stroke="#FFF" stroke-width="2" stroke-linecap="round" stroke-dasharray="4 4" opacity="0.7"/>
      </svg>
    `)
  },
  {
    id: 'ill-sun-boho',
    name: 'Bohemian Sun',
    category: 'illustrations',
    type: 'svg',
    createdAt: Date.now() - 25000,
    width: 200,
    height: 200,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="40" fill="#E8B07A"/>
        <circle cx="100" cy="100" r="48" stroke="#D99379" stroke-width="2" stroke-dasharray="3 5"/>
        <!-- rays -->
        <line x1="100" y1="20" x2="100" y2="45" stroke="#D99379" stroke-width="3.5" stroke-linecap="round"/>
        <line x1="100" y1="155" x2="100" y2="180" stroke="#D99379" stroke-width="3.5" stroke-linecap="round"/>
        <line x1="20" y1="100" x2="45" y2="100" stroke="#D99379" stroke-width="3.5" stroke-linecap="round"/>
        <line x1="155" y1="100" x2="180" y2="100" stroke="#D99379" stroke-width="3.5" stroke-linecap="round"/>
        <line x1="43" y1="43" x2="61" y2="61" stroke="#D99379" stroke-width="3.5" stroke-linecap="round"/>
        <line x1="139" y1="139" x2="157" y2="157" stroke="#D99379" stroke-width="3.5" stroke-linecap="round"/>
        <line x1="157" y1="43" x2="139" y2="61" stroke="#D99379" stroke-width="3.5" stroke-linecap="round"/>
        <line x1="61" y1="139" x2="43" y2="157" stroke="#D99379" stroke-width="3.5" stroke-linecap="round"/>
      </svg>
    `)
  }
];

export const PRESET_STICKERS: GalleryAsset[] = [
  {
    id: 'stk-washi-sage',
    name: 'Washi Tape Sage',
    category: 'stickers',
    type: 'svg',
    createdAt: Date.now() - 20000,
    width: 180,
    height: 48,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 48" fill="none">
        <path d="M0 6 L12 0 L168 0 L180 6 L175 42 L165 48 L15 48 L0 42 Z" fill="#D8DAC7" opacity="0.9"/>
        <line x1="10" y1="24" x2="170" y2="24" stroke="#777D5E" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.6"/>
      </svg>
    `)
  },
  {
    id: 'stk-idea-badge',
    name: 'Spark of Idea',
    category: 'stickers',
    type: 'svg',
    createdAt: Date.now() - 15000,
    width: 120,
    height: 120,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
        <circle cx="60" cy="60" r="50" fill="#EED4C5"/>
        <circle cx="60" cy="60" r="42" stroke="#D99379" stroke-width="2" stroke-dasharray="4 3"/>
        <path d="M60 30 L66 48 L85 48 L70 59 L75 78 L60 67 L45 78 L50 59 L35 48 L54 48 Z" fill="#D99379"/>
        <text x="60" y="98" font-family="'Caveat', cursive" font-size="16" font-weight="bold" fill="#30312D" text-anchor="middle">idea</text>
      </svg>
    `)
  },
  {
    id: 'stk-flower-bloom',
    name: 'Peach Bloom',
    category: 'stickers',
    type: 'svg',
    createdAt: Date.now() - 10000,
    width: 140,
    height: 140,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140" fill="none">
        <!-- petals -->
        <circle cx="70" cy="40" r="22" fill="#EED4C5" opacity="0.95"/>
        <circle cx="100" cy="70" r="22" fill="#EED4C5" opacity="0.95"/>
        <circle cx="70" cy="100" r="22" fill="#EED4C5" opacity="0.95"/>
        <circle cx="40" cy="70" r="22" fill="#EED4C5" opacity="0.95"/>
        <circle cx="70" cy="70" r="16" fill="#D99379"/>
      </svg>
    `)
  },
  {
    id: 'stk-quote-beauty',
    name: 'Make It Yours Stamp',
    category: 'stickers',
    type: 'svg',
    createdAt: Date.now() - 5000,
    width: 160,
    height: 80,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80" fill="none">
        <rect x="5" y="5" width="150" height="70" rx="12" fill="#FAF6F0" stroke="#777D5E" stroke-width="2"/>
        <text x="80" y="38" font-family="'Caveat', cursive" font-size="22" font-weight="bold" fill="#30312D" text-anchor="middle">made with love</text>
        <path d="M80 50 C75 45 68 50 68 55 C68 62 80 67 80 67 C80 67 92 62 92 55 C92 50 85 45 80 50 Z" fill="#D99379"/>
      </svg>
    `)
  }
];
