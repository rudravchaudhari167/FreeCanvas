import type { GalleryAsset } from '../types/project';

// Helper to encode SVG to valid data URI with proper charset
function svgToUri(svgString: string): string {
  const clean = svgString.trim();
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(clean)}`;
}

export const PRESET_ILLUSTRATIONS: GalleryAsset[] = [
  {
    id: 'ill-monstera',
    name: 'Monstera Frond',
    category: 'illustrations',
    type: 'svg',
    createdAt: Date.now() - 150000,
    width: 200,
    height: 240,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="240" viewBox="0 0 200 240" fill="none">
        <path d="M100 230 C95 180 98 120 100 20" stroke="#5E6547" stroke-width="4" stroke-linecap="round"/>
        <path d="M100 30 C120 35 155 55 160 85 C164 110 145 130 135 132 C125 134 115 125 102 120 Z" fill="#777D5E" opacity="0.9"/>
        <path d="M98 50 C75 58 45 80 40 110 C36 135 55 155 65 156 C75 157 85 145 98 138 Z" fill="#777D5E" opacity="0.9"/>
        <path d="M100 110 C125 120 165 145 155 180 C145 200 120 200 102 185 Z" fill="#777D5E" opacity="0.85"/>
        <path d="M98 130 C75 140 35 165 45 200 C55 215 80 205 98 190 Z" fill="#777D5E" opacity="0.85"/>
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
    createdAt: Date.now() - 140000,
    width: 220,
    height: 180,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="220" height="180" viewBox="0 0 220 180" fill="none">
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
    createdAt: Date.now() - 130000,
    width: 180,
    height: 200,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="180" height="200" viewBox="0 0 180 200" fill="none">
        <path d="M90 190 Q90 140 90 110" stroke="#A67B5B" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M90 110 C50 105 15 70 30 35 C42 10 75 30 90 60 C105 30 138 10 150 35 C165 70 130 105 90 110 Z" fill="#D99379" opacity="0.9"/>
        <path d="M90 110 Q65 60 45 40" stroke="#FFFEFA" stroke-width="1.2" opacity="0.7"/>
        <path d="M90 110 Q78 50 65 30" stroke="#FFFEFA" stroke-width="1.2" opacity="0.7"/>
        <path d="M90 110 Q90 50 90 25" stroke="#FFFEFA" stroke-width="1.2" opacity="0.7"/>
        <path d="M90 110 Q102 50 115 30" stroke="#FFFEFA" stroke-width="1.2" opacity="0.7"/>
        <path d="M90 110 Q115 60 135 40" stroke="#FFFEFA" stroke-width="1.2" opacity="0.7"/>
      </svg>
    `)
  },
  {
    id: 'ill-terracotta-vase',
    name: 'Artisan Vase',
    category: 'illustrations',
    type: 'svg',
    createdAt: Date.now() - 120000,
    width: 160,
    height: 220,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="160" height="220" viewBox="0 0 160 220" fill="none">
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
    createdAt: Date.now() - 110000,
    width: 200,
    height: 200,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" fill="none">
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
  },
  {
    id: 'ill-lavender',
    name: 'Lavender Sprig',
    category: 'illustrations',
    type: 'svg',
    createdAt: Date.now() - 100000,
    width: 160,
    height: 240,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="160" height="240" viewBox="0 0 160 240" fill="none">
        <path d="M80 230 Q82 140 80 40" stroke="#6F7B57" stroke-width="2.5" stroke-linecap="round"/>
        <!-- subtle leaves at base -->
        <path d="M80 190 Q60 180 50 170 Q68 175 80 185" fill="#889571"/>
        <path d="M80 175 Q100 165 110 155 Q92 160 80 170" fill="#778460"/>
        <path d="M80 150 Q62 140 54 130 Q70 135 80 145" fill="#889571"/>
        <!-- floral florets -->
        <ellipse cx="80" cy="35" rx="7" ry="11" fill="#8B7E99"/>
        <ellipse cx="71" cy="48" rx="8" ry="6" transform="rotate(-25 71 48)" fill="#9A8C98"/>
        <ellipse cx="89" cy="52" rx="8" ry="6" transform="rotate(25 89 52)" fill="#A89CB0"/>
        <ellipse cx="70" cy="66" rx="9" ry="7" transform="rotate(-30 70 66)" fill="#7D6F8A"/>
        <ellipse cx="90" cy="70" rx="9" ry="7" transform="rotate(30 90 70)" fill="#9A8C98"/>
        <ellipse cx="69" cy="86" rx="9" ry="7" transform="rotate(-25 69 86)" fill="#8B7E99"/>
        <ellipse cx="91" cy="90" rx="9" ry="7" transform="rotate(25 91 90)" fill="#7D6F8A"/>
        <ellipse cx="70" cy="106" rx="8" ry="6" transform="rotate(-20 70 106)" fill="#9A8C98"/>
        <ellipse cx="90" cy="110" rx="8" ry="6" transform="rotate(20 90 110)" fill="#A89CB0"/>
        <ellipse cx="72" cy="126" rx="7" ry="5" transform="rotate(-20 72 126)" fill="#8B7E99"/>
        <ellipse cx="88" cy="128" rx="7" ry="5" transform="rotate(20 88 128)" fill="#7D6F8A"/>
      </svg>
    `)
  },
  {
    id: 'ill-eucalyptus',
    name: 'Eucalyptus Branch',
    category: 'illustrations',
    type: 'svg',
    createdAt: Date.now() - 90000,
    width: 180,
    height: 240,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="180" height="240" viewBox="0 0 180 240" fill="none">
        <path d="M40 230 Q100 170 140 20" stroke="#777D5E" stroke-width="2.5" stroke-linecap="round"/>
        <!-- paired circular eucalyptus leaves -->
        <ellipse cx="60" cy="185" rx="20" ry="15" transform="rotate(-15 60 185)" fill="#95A38F" opacity="0.95"/>
        <ellipse cx="88" cy="175" rx="20" ry="15" transform="rotate(25 88 175)" fill="#84937E" opacity="0.95"/>
        <ellipse cx="82" cy="135" rx="19" ry="14" transform="rotate(-20 82 135)" fill="#A2B09C" opacity="0.92"/>
        <ellipse cx="110" cy="125" rx="19" ry="14" transform="rotate(20 110 125)" fill="#95A38F" opacity="0.95"/>
        <ellipse cx="106" cy="85" rx="17" ry="13" transform="rotate(-25 106 85)" fill="#84937E" opacity="0.95"/>
        <ellipse cx="130" cy="75" rx="17" ry="13" transform="rotate(18 130 75)" fill="#A2B09C" opacity="0.92"/>
        <ellipse cx="125" cy="42" rx="14" ry="11" transform="rotate(-15 125 42)" fill="#95A38F" opacity="0.95"/>
        <ellipse cx="145" cy="35" rx="14" ry="11" transform="rotate(15 145 35)" fill="#84937E" opacity="0.95"/>
        <circle cx="140" cy="18" r="9" fill="#A2B09C"/>
      </svg>
    `)
  },
  {
    id: 'ill-palm-fan',
    name: 'Boho Sun Palm',
    category: 'illustrations',
    type: 'svg',
    createdAt: Date.now() - 80000,
    width: 200,
    height: 220,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="220" viewBox="0 0 200 220" fill="none">
        <path d="M100 215 L100 135" stroke="#B08968" stroke-width="3" stroke-linecap="round"/>
        <!-- fan pleats radiating from base (100, 135) -->
        <path d="M100 135 L40 90 L50 65 L100 135 Z" fill="#D99379" opacity="0.9"/>
        <path d="M100 135 L50 65 L68 45 L100 135 Z" fill="#E8B07A" opacity="0.95"/>
        <path d="M100 135 L68 45 L86 32 L100 135 Z" fill="#E0A472" opacity="0.9"/>
        <path d="M100 135 L86 32 L100 25 L100 135 Z" fill="#D99379" opacity="0.95"/>
        <path d="M100 135 L100 25 L114 32 L100 135 Z" fill="#D99379" opacity="0.95"/>
        <path d="M100 135 L114 32 L132 45 L100 135 Z" fill="#E0A472" opacity="0.9"/>
        <path d="M100 135 L132 45 L150 65 L100 135 Z" fill="#E8B07A" opacity="0.95"/>
        <path d="M100 135 L150 65 L160 90 L100 135 Z" fill="#D99379" opacity="0.9"/>
        <!-- arched top contour binding line -->
        <path d="M40 90 Q100 10 160 90" stroke="#FAF5EE" stroke-width="1.8" stroke-dasharray="3 3"/>
      </svg>
    `)
  },
  {
    id: 'ill-peony',
    name: 'Wild Peony',
    category: 'illustrations',
    type: 'svg',
    createdAt: Date.now() - 70000,
    width: 220,
    height: 220,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220" fill="none">
        <!-- stem & sepals -->
        <path d="M110 160 Q108 190 105 215" stroke="#6F7B57" stroke-width="3" stroke-linecap="round"/>
        <path d="M108 165 C85 170 70 190 75 200 C88 200 102 185 108 175 Z" fill="#778460"/>
        <path d="M110 168 C130 172 145 185 142 195 C130 198 116 186 110 175 Z" fill="#889571"/>
        <!-- outer petals -->
        <path d="M110 160 C60 160 40 120 55 85 C70 55 105 65 110 80 C115 65 150 55 165 85 C180 120 160 160 110 160 Z" fill="#EED4C5" opacity="0.95"/>
        <path d="M65 95 C55 130 85 155 110 155 C135 155 165 130 155 95 C145 70 125 80 110 90 C95 80 75 70 65 95 Z" fill="#D99379" opacity="0.85"/>
        <!-- inner layered bloom -->
        <path d="M80 105 C75 130 95 145 110 145 C125 145 145 130 140 105 C135 90 120 98 110 105 C100 98 85 90 80 105 Z" fill="#C57E65" opacity="0.9"/>
        <!-- golden pistil center -->
        <circle cx="110" cy="118" r="9" fill="#E8B07A"/>
        <circle cx="106" cy="115" r="2.5" fill="#FAF5EE"/>
        <circle cx="114" cy="115" r="2.5" fill="#FAF5EE"/>
        <circle cx="110" cy="121" r="2" fill="#FAF5EE"/>
      </svg>
    `)
  },
  {
    id: 'ill-fern',
    name: 'Arching Fern',
    category: 'illustrations',
    type: 'svg',
    createdAt: Date.now() - 60000,
    width: 180,
    height: 250,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="180" height="250" viewBox="0 0 180 250" fill="none">
        <path d="M50 240 Q105 150 130 20" stroke="#485135" stroke-width="2.5" stroke-linecap="round"/>
        <!-- pairs of pinnate leaflets -->
        <path d="M60 215 C45 210 40 200 48 195 C62 195 68 205 70 212 Z" fill="#5E6547"/>
        <path d="M72 210 C85 200 95 202 96 208 C90 218 78 216 72 210 Z" fill="#777D5E"/>
        <path d="M72 185 C55 178 52 168 60 164 C74 164 80 174 82 181 Z" fill="#5E6547"/>
        <path d="M84 179 C98 170 108 172 108 179 C102 188 90 185 84 179 Z" fill="#777D5E"/>
        <path d="M84 150 C68 142 66 132 75 128 C88 129 93 140 94 146 Z" fill="#5E6547"/>
        <path d="M96 144 C110 134 120 137 120 144 C114 153 103 150 96 144 Z" fill="#777D5E"/>
        <path d="M96 115 C82 108 81 98 89 95 C102 96 106 106 107 112 Z" fill="#5E6547"/>
        <path d="M108 109 C121 100 130 103 130 110 C124 118 114 115 108 109 Z" fill="#777D5E"/>
        <path d="M108 80 C97 73 98 65 105 62 C116 63 118 72 119 77 Z" fill="#5E6547"/>
        <path d="M119 75 C130 68 138 71 137 77 C132 84 125 81 119 75 Z" fill="#777D5E"/>
        <path d="M120 48 C112 42 114 36 120 34 C128 35 129 42 129 46 Z" fill="#5E6547"/>
        <path d="M129 44 C136 38 143 41 142 46 C138 51 133 49 129 44 Z" fill="#777D5E"/>
      </svg>
    `)
  },
  {
    id: 'ill-matisse-portrait',
    name: 'Minimalist Muse',
    category: 'illustrations',
    type: 'svg',
    createdAt: Date.now() - 50000,
    width: 200,
    height: 240,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="240" viewBox="0 0 200 240" fill="none">
        <!-- organic background color blotches -->
        <path d="M40 70 Q20 120 50 160 Q80 190 120 180 Q160 160 150 110 Q140 50 90 55 Q50 55 40 70 Z" fill="#EED4C5" opacity="0.6"/>
        <circle cx="140" cy="80" r="32" fill="#E8B07A" opacity="0.45"/>
        <circle cx="65" cy="165" r="24" fill="#D8DAC7" opacity="0.7"/>
        <!-- continuous line-art profile -->
        <path d="M85 55 C98 52 115 60 118 72 C120 80 110 88 108 96 C115 97 122 100 122 106 C116 110 110 112 110 118 C115 122 120 126 115 132 C108 136 95 138 90 148 C85 160 88 185 88 200" stroke="#30312D" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- closed eye curve -->
        <path d="M96 86 Q103 91 110 86" stroke="#30312D" stroke-width="2" stroke-linecap="round"/>
        <!-- gentle ear and neck line -->
        <path d="M88 102 C82 102 78 108 80 114 C82 120 88 122 92 120" stroke="#30312D" stroke-width="2" stroke-linecap="round"/>
        <!-- accent leaf sprig in hair -->
        <path d="M105 52 Q120 30 145 28" stroke="#5E6547" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M120 40 Q135 36 138 45 Q126 48 120 40 Z" fill="#777D5E"/>
        <path d="M135 32 Q150 25 152 35 Q140 38 135 32 Z" fill="#777D5E"/>
      </svg>
    `)
  },
  {
    id: 'ill-ceramic-pitcher',
    name: 'Artisan Pitcher',
    category: 'illustrations',
    type: 'svg',
    createdAt: Date.now() - 40000,
    width: 180,
    height: 240,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="180" height="240" viewBox="0 0 180 240" fill="none">
        <!-- botanical stems emerging from pitcher -->
        <path d="M85 110 Q70 60 55 35" stroke="#777D5E" stroke-width="2" stroke-linecap="round"/>
        <ellipse cx="55" cy="35" rx="5" ry="12" transform="rotate(-30 55 35)" fill="#889571"/>
        <ellipse cx="66" cy="55" rx="4" ry="10" transform="rotate(-20 66 55)" fill="#777D5E"/>
        <path d="M95 110 Q105 50 120 25" stroke="#B08968" stroke-width="2" stroke-linecap="round"/>
        <ellipse cx="120" cy="25" rx="5" ry="14" transform="rotate(25 120 25)" fill="#E8B07A"/>
        <ellipse cx="110" cy="50" rx="4" ry="11" transform="rotate(20 110 50)" fill="#D99379"/>
        <!-- handle -->
        <path d="M60 120 C30 120 30 175 60 185" stroke="#A85D48" stroke-width="6" fill="none" stroke-linecap="round"/>
        <!-- body of terracotta pitcher -->
        <ellipse cx="90" cy="110" rx="22" ry="6" fill="#A85D48"/>
        <path d="M70 110 L68 130 Q50 155 58 190 Q65 210 90 210 Q115 210 122 190 Q130 155 112 130 L110 110 Z" fill="#C57E65"/>
        <!-- hand-painted decorative band -->
        <path d="M60 160 Q90 170 120 160" stroke="#FAF5EE" stroke-width="2.5" stroke-dasharray="4 4"/>
        <ellipse cx="90" cy="182" rx="14" ry="10" fill="#EED4C5" opacity="0.6"/>
      </svg>
    `)
  },
  {
    id: 'ill-crescent-flora',
    name: 'Celestial Crescent',
    category: 'illustrations',
    type: 'svg',
    createdAt: Date.now() - 30000,
    width: 200,
    height: 220,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="220" viewBox="0 0 200 220" fill="none">
        <!-- crescent moon -->
        <path d="M120 25 C65 35 45 95 65 150 C80 185 115 200 145 195 C100 180 85 130 100 85 C108 60 125 40 140 32 C133 28 126 26 120 25 Z" fill="#E8B07A"/>
        <!-- trailing vine around curve -->
        <path d="M55 150 Q75 110 105 75 Q125 50 140 32" stroke="#5E6547" stroke-width="2" stroke-linecap="round"/>
        <!-- small leaves & starry blooms -->
        <path d="M80 120 C70 115 65 105 75 102 C85 105 82 116 80 120 Z" fill="#777D5E"/>
        <path d="M96 95 C105 90 112 92 110 98 C102 105 95 100 96 95 Z" fill="#888E6D"/>
        <circle cx="85" cy="140" r="4.5" fill="#FAF5EE"/>
        <circle cx="108" cy="80" r="4" fill="#FAF5EE"/>
        <!-- four-point stars -->
        <path d="M155 70 L158 80 L168 83 L158 86 L155 96 L152 86 L142 83 L152 80 Z" fill="#D99379"/>
        <path d="M135 130 L137 136 L143 138 L137 140 L135 146 L133 140 L127 138 L133 136 Z" fill="#EED4C5"/>
        <circle cx="160" cy="120" r="2.5" fill="#E8B07A"/>
      </svg>
    `)
  },
  {
    id: 'ill-lotus',
    name: 'Zen Lotus',
    category: 'illustrations',
    type: 'svg',
    createdAt: Date.now() - 20000,
    width: 220,
    height: 180,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="220" height="180" viewBox="0 0 220 180" fill="none">
        <!-- ripple base rings -->
        <ellipse cx="110" cy="150" rx="75" ry="10" stroke="#777D5E" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.6"/>
        <ellipse cx="110" cy="158" rx="45" ry="6" stroke="#889571" stroke-width="1.2" opacity="0.5"/>
        <!-- outer petals -->
        <path d="M110 145 C60 145 35 110 45 90 C65 95 85 115 110 145 Z" fill="#D99379" opacity="0.85"/>
        <path d="M110 145 C160 145 185 110 175 90 C155 95 135 115 110 145 Z" fill="#D99379" opacity="0.85"/>
        <!-- mid petals -->
        <path d="M110 145 C75 135 55 85 75 60 C90 80 102 110 110 145 Z" fill="#EED4C5" opacity="0.95"/>
        <path d="M110 145 C145 135 165 85 145 60 C130 80 118 110 110 145 Z" fill="#EED4C5" opacity="0.95"/>
        <!-- center crown petal -->
        <path d="M110 145 C92 115 90 70 110 40 C130 70 128 115 110 145 Z" fill="#C57E65"/>
        <!-- golden center bead -->
        <circle cx="110" cy="115" r="7" fill="#E8B07A"/>
      </svg>
    `)
  },
  {
    id: 'ill-succulent',
    name: 'Succulent Rosette',
    category: 'illustrations',
    type: 'svg',
    createdAt: Date.now() - 10000,
    width: 200,
    height: 200,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" fill="none">
        <!-- bottom tier petals radiating 8 directions -->
        <path d="M100 100 C80 60 85 30 100 20 C115 30 120 60 100 100 Z" fill="#6B7858"/>
        <path d="M100 100 C100 120 115 170 100 180 C85 170 80 120 100 100 Z" fill="#6B7858"/>
        <path d="M100 100 C60 80 30 85 20 100 C30 115 60 120 100 100 Z" fill="#6B7858"/>
        <path d="M100 100 C120 100 170 115 180 100 C170 85 120 80 100 100 Z" fill="#6B7858"/>
        <!-- diagonal tier 1 -->
        <path d="M100 100 C70 70 42 45 50 35 C62 42 85 70 100 100 Z" fill="#788763"/>
        <path d="M100 100 C130 70 155 42 165 50 C158 62 130 85 100 100 Z" fill="#788763"/>
        <path d="M100 100 C70 130 45 155 35 150 C42 138 70 115 100 100 Z" fill="#788763"/>
        <path d="M100 100 C130 130 155 158 150 165 C138 158 115 130 100 100 Z" fill="#788763"/>
        <!-- middle tier in soft sage & peach blush -->
        <path d="M100 100 C85 75 90 50 100 45 C110 50 115 75 100 100 Z" fill="#8E9E78"/>
        <path d="M100 100 C75 85 50 90 45 100 C50 110 75 115 100 100 Z" fill="#8E9E78"/>
        <path d="M100 100 C115 100 150 110 155 100 C150 90 115 85 100 100 Z" fill="#8E9E78"/>
        <path d="M100 100 C100 115 110 150 100 155 C90 150 85 115 100 100 Z" fill="#8E9E78"/>
        <!-- center rosette heart with blush pink tips -->
        <circle cx="100" cy="100" r="16" fill="#A4B58D"/>
        <circle cx="100" cy="100" r="9" fill="#D99379" opacity="0.85"/>
        <circle cx="100" cy="100" r="4" fill="#FAF5EE"/>
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
    createdAt: Date.now() - 140000,
    width: 180,
    height: 48,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="180" height="48" viewBox="0 0 180 48" fill="none">
        <path d="M0 6 L12 0 L168 0 L180 6 L175 42 L165 48 L15 48 L0 42 Z" fill="#D8DAC7" opacity="0.9"/>
        <line x1="10" y1="24" x2="170" y2="24" stroke="#777D5E" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.6"/>
      </svg>
    `)
  },
  {
    id: 'stk-washi-terracotta',
    name: 'Washi Tape Terracotta',
    category: 'stickers',
    type: 'svg',
    createdAt: Date.now() - 130000,
    width: 180,
    height: 48,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="180" height="48" viewBox="0 0 180 48" fill="none">
        <path d="M0 5 L10 0 L170 0 L180 5 L176 43 L168 48 L8 48 L0 41 Z" fill="#E5A995" opacity="0.92"/>
        <!-- subtle decorative diagonal stripes -->
        <line x1="30" y1="4" x2="45" y2="44" stroke="#D99379" stroke-width="3" opacity="0.45"/>
        <line x1="60" y1="4" x2="75" y2="44" stroke="#D99379" stroke-width="3" opacity="0.45"/>
        <line x1="90" y1="4" x2="105" y2="44" stroke="#D99379" stroke-width="3" opacity="0.45"/>
        <line x1="120" y1="4" x2="135" y2="44" stroke="#D99379" stroke-width="3" opacity="0.45"/>
        <line x1="150" y1="4" x2="165" y2="44" stroke="#D99379" stroke-width="3" opacity="0.45"/>
        <!-- central stitched line -->
        <line x1="12" y1="24" x2="168" y2="24" stroke="#FAF5EE" stroke-width="1.6" stroke-dasharray="5 3"/>
      </svg>
    `)
  },
  {
    id: 'stk-wax-seal',
    name: 'Artisan Wax Seal',
    category: 'stickers',
    type: 'svg',
    createdAt: Date.now() - 120000,
    width: 120,
    height: 120,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none">
        <!-- organic melted wax perimeter -->
        <path d="M60 10 C78 9 92 18 102 30 C114 44 112 62 108 78 C104 94 92 108 74 111 C56 114 40 106 28 96 C16 84 10 68 12 50 C14 34 26 18 42 12 C48 10 54 10 60 10 Z" fill="#B85B43"/>
        <circle cx="60" cy="60" r="40" fill="#A24E38"/>
        <circle cx="60" cy="60" r="37" stroke="#FAF5EE" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.6"/>
        <!-- debossed botanical branch in center -->
        <path d="M60 82 Q58 60 60 38" stroke="#EED4C5" stroke-width="2" stroke-linecap="round"/>
        <ellipse cx="52" cy="48" rx="4" ry="7" transform="rotate(-30 52 48)" fill="#EED4C5"/>
        <ellipse cx="68" cy="52" rx="4" ry="7" transform="rotate(30 68 52)" fill="#EED4C5"/>
        <ellipse cx="51" cy="64" rx="4" ry="7" transform="rotate(-35 51 64)" fill="#EED4C5"/>
        <ellipse cx="69" cy="68" rx="4" ry="7" transform="rotate(35 69 68)" fill="#EED4C5"/>
        <circle cx="60" cy="36" r="3" fill="#EED4C5"/>
      </svg>
    `)
  },
  {
    id: 'stk-coffee-cup',
    name: 'Morning Coffee',
    category: 'stickers',
    type: 'svg',
    createdAt: Date.now() - 110000,
    width: 130,
    height: 130,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="130" height="130" viewBox="0 0 130 130" fill="none">
        <!-- steam wisps -->
        <path d="M50 36 C45 28 55 20 48 12" stroke="#B08968" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="M65 34 C60 24 70 18 64 8" stroke="#B08968" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="M80 36 C75 28 85 20 78 12" stroke="#B08968" stroke-width="2" stroke-linecap="round" fill="none"/>
        <!-- saucer -->
        <ellipse cx="65" cy="108" rx="46" ry="9" fill="#D8DAC7"/>
        <ellipse cx="65" cy="108" rx="36" ry="6" fill="#FAF5EE"/>
        <!-- cup handle -->
        <path d="M86 54 C104 54 104 84 86 84" stroke="#C57E65" stroke-width="6" fill="none" stroke-linecap="round"/>
        <!-- cup body -->
        <path d="M36 48 L42 94 Q65 102 88 94 L94 48 Z" fill="#EED4C5"/>
        <ellipse cx="65" cy="48" rx="29" ry="8" fill="#C57E65"/>
        <!-- latte art foam & heart -->
        <ellipse cx="65" cy="48" rx="25" ry="6.5" fill="#FAF5EE"/>
        <path d="M65 52 C61 48 57 50 57 53 C57 56 65 59 65 59 C65 59 73 56 73 53 C73 50 69 48 65 52 Z" fill="#C57E65"/>
      </svg>
    `)
  },
  {
    id: 'stk-gold-stars',
    name: 'Top Pick Stars',
    category: 'stickers',
    type: 'svg',
    createdAt: Date.now() - 100000,
    width: 140,
    height: 140,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 140 140" fill="none">
        <!-- ribbon tails below -->
        <path d="M48 85 L35 125 L55 115 L68 125 L60 85 Z" fill="#D99379"/>
        <path d="M92 85 L80 125 L92 115 L112 125 L100 85 Z" fill="#C57E65"/>
        <!-- rosette circular badge -->
        <circle cx="70" cy="65" r="48" fill="#E8B07A"/>
        <circle cx="70" cy="65" r="41" fill="#FAF5EE"/>
        <circle cx="70" cy="65" r="37" stroke="#E8B07A" stroke-width="1.8" stroke-dasharray="3 3"/>
        <!-- 3 central gold stars -->
        <polygon points="70,40 73,50 84,50 75,56 78,66 70,60 62,66 65,56 56,50 67,50" fill="#E8B07A"/>
        <polygon points="50,56 52,63 60,63 54,67 56,74 50,70 44,74 46,67 40,63 48,63" fill="#D99379"/>
        <polygon points="90,56 92,63 100,63 94,67 96,74 90,70 84,74 86,67 80,63 88,63" fill="#D99379"/>
        <!-- curved banner ribbon label -->
        <path d="M36 82 Q70 74 104 82 L100 95 Q70 87 40 95 Z" fill="#5E6547"/>
        <text x="70" y="90" font-family="'Cinzel', serif, sans-serif" font-size="8.5" font-weight="bold" fill="#FAF5EE" text-anchor="middle" letter-spacing="1.5">FAVORITE</text>
      </svg>
    `)
  },
  {
    id: 'stk-postage-stamp',
    name: 'Vintage Postage',
    category: 'stickers',
    type: 'svg',
    createdAt: Date.now() - 90000,
    width: 130,
    height: 150,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="130" height="150" viewBox="0 0 130 150" fill="none">
        <!-- stamp paper with perforated edge simulation -->
        <rect x="10" y="10" width="110" height="130" rx="3" fill="#FAF5EE" stroke="#E8DFD3" stroke-width="2"/>
        <!-- scalloped perforations on borders -->
        <circle cx="10" cy="25" r="3.5" fill="#FAF5EE"/>
        <circle cx="10" cy="45" r="3.5" fill="#FAF5EE"/>
        <circle cx="10" cy="65" r="3.5" fill="#FAF5EE"/>
        <circle cx="10" cy="85" r="3.5" fill="#FAF5EE"/>
        <circle cx="10" cy="105" r="3.5" fill="#FAF5EE"/>
        <circle cx="10" cy="125" r="3.5" fill="#FAF5EE"/>
        <circle cx="120" cy="25" r="3.5" fill="#FAF5EE"/>
        <circle cx="120" cy="45" r="3.5" fill="#FAF5EE"/>
        <circle cx="120" cy="65" r="3.5" fill="#FAF5EE"/>
        <circle cx="120" cy="85" r="3.5" fill="#FAF5EE"/>
        <circle cx="120" cy="105" r="3.5" fill="#FAF5EE"/>
        <circle cx="120" cy="125" r="3.5" fill="#FAF5EE"/>
        <!-- inner vignette frame -->
        <rect x="22" y="22" width="86" height="106" rx="2" fill="#FAF6F0" stroke="#777D5E" stroke-width="1.8"/>
        <!-- botanical motif inside stamp -->
        <path d="M65 92 Q64 68 65 44" stroke="#5E6547" stroke-width="2" stroke-linecap="round"/>
        <ellipse cx="54" cy="58" rx="6" ry="11" transform="rotate(-30 54 58)" fill="#777D5E"/>
        <ellipse cx="76" cy="64" rx="6" ry="11" transform="rotate(30 76 64)" fill="#889571"/>
        <circle cx="65" cy="42" r="5" fill="#D99379"/>
        <!-- cancellation wavy postal lines -->
        <path d="M15 40 Q40 32 65 40 Q90 48 115 40" stroke="#30312D" stroke-width="1" opacity="0.35"/>
        <path d="M15 48 Q40 40 65 48 Q90 56 115 48" stroke="#30312D" stroke-width="1" opacity="0.35"/>
        <text x="65" y="118" font-family="'Caveat', cursive" font-size="12" font-weight="bold" fill="#777D5E" text-anchor="middle">postale • 12c</text>
      </svg>
    `)
  },
  {
    id: 'stk-pushpin-tag',
    name: 'Memo Pushpin Tag',
    category: 'stickers',
    type: 'svg',
    createdAt: Date.now() - 80000,
    width: 130,
    height: 130,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="130" height="130" viewBox="0 0 130 130" fill="none">
        <!-- drop shadow -->
        <rect x="22" y="32" width="88" height="88" rx="8" fill="rgba(60,50,40,0.1)"/>
        <!-- angled memo note -->
        <g transform="rotate(-5 65 65)">
          <rect x="20" y="24" width="88" height="86" rx="7" fill="#FAF0D7" stroke="#E2D4B6" stroke-width="1.5"/>
          <!-- folded corner top right -->
          <path d="M92 24 L108 40 L92 40 Z" fill="#D8C6A5"/>
          <!-- note lines -->
          <line x1="32" y1="52" x2="94" y2="52" stroke="#D8DAC7" stroke-width="1.8" stroke-linecap="round"/>
          <line x1="32" y1="68" x2="94" y2="68" stroke="#D8DAC7" stroke-width="1.8" stroke-linecap="round"/>
          <line x1="32" y1="84" x2="74" y2="84" stroke="#D8DAC7" stroke-width="1.8" stroke-linecap="round"/>
          <circle cx="34" cy="52" r="2.5" fill="#D99379"/>
          <circle cx="34" cy="68" r="2.5" fill="#D99379"/>
          <circle cx="34" cy="84" r="2.5" fill="#D99379"/>
          <!-- pushpin at top center -->
          <circle cx="64" cy="24" r="7.5" fill="#C57E65"/>
          <circle cx="62" cy="22" r="2.5" fill="#FAF5EE"/>
          <path d="M64 31 L64 38" stroke="#79766F" stroke-width="2" stroke-linecap="round"/>
        </g>
      </svg>
    `)
  },
  {
    id: 'stk-good-vibes',
    name: 'Good Vibes Banner',
    category: 'stickers',
    type: 'svg',
    createdAt: Date.now() - 70000,
    width: 160,
    height: 80,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="160" height="80" viewBox="0 0 160 80" fill="none">
        <!-- swallowtail ribbon fold shadow -->
        <path d="M12 48 L28 42 L28 58 Z" fill="#C28751"/>
        <path d="M148 48 L132 42 L132 58 Z" fill="#C28751"/>
        <!-- ribbon swallowtail ends -->
        <path d="M28 22 L8 22 L18 36 L8 50 L28 50 Z" fill="#D99379"/>
        <path d="M132 22 L152 22 L142 36 L152 50 L132 50 Z" fill="#D99379"/>
        <!-- central ribbon banner body -->
        <rect x="22" y="16" width="116" height="40" rx="8" fill="#E8B07A" stroke="#FAF5EE" stroke-width="2"/>
        <!-- text -->
        <text x="80" y="42" font-family="'Caveat', cursive, sans-serif" font-size="21" font-weight="bold" fill="#30312D" text-anchor="middle">good vibes</text>
        <circle cx="34" cy="36" r="3" fill="#FAF5EE"/>
        <circle cx="126" cy="36" r="3" fill="#FAF5EE"/>
      </svg>
    `)
  },
  {
    id: 'stk-done-stamp',
    name: 'Approved Done Seal',
    category: 'stickers',
    type: 'svg',
    createdAt: Date.now() - 60000,
    width: 120,
    height: 120,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none">
        <!-- circular stamp ring -->
        <circle cx="60" cy="60" r="50" fill="#F4F6EE" stroke="#5E6547" stroke-width="2.5"/>
        <circle cx="60" cy="60" r="43" stroke="#777D5E" stroke-width="1.5" stroke-dasharray="4 3"/>
        <!-- large green checkmark -->
        <path d="M42 60 L54 72 L78 46" stroke="#5E6547" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- curved approval label -->
        <text x="60" y="94" font-family="'Cinzel', serif, sans-serif" font-size="10.5" font-weight="bold" fill="#5E6547" text-anchor="middle" letter-spacing="3">COMPLETE</text>
        <circle cx="34" cy="60" r="2" fill="#777D5E"/>
        <circle cx="86" cy="60" r="2" fill="#777D5E"/>
      </svg>
    `)
  },
  {
    id: 'stk-heart-boho',
    name: 'Bohemian Heart',
    category: 'stickers',
    type: 'svg',
    createdAt: Date.now() - 50000,
    width: 130,
    height: 130,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="130" height="130" viewBox="0 0 130 130" fill="none">
        <!-- soft watercolor peach aura -->
        <path d="M65 108 C35 88 16 68 16 48 C16 30 30 18 46 18 C56 18 62 24 65 29 C68 24 74 18 84 18 C100 18 114 30 114 48 C114 68 95 88 65 108 Z" fill="#EED4C5" opacity="0.85"/>
        <!-- sketched inner heart contour -->
        <path d="M65 100 C39 82 24 64 24 48 C24 34 35 24 48 24 C57 24 62 29 65 33 C68 29 73 24 82 24 C95 24 106 34 106 48 C106 64 91 82 65 100 Z" stroke="#C57E65" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- starry sparkles -->
        <path d="M98 22 L100 27 L105 29 L100 31 L98 36 L96 31 L91 29 L96 27 Z" fill="#E8B07A"/>
        <circle cx="28" cy="74" r="3" fill="#D99379"/>
        <circle cx="102" cy="68" r="2.5" fill="#E8B07A"/>
      </svg>
    `)
  },
  {
    id: 'stk-boho-arch',
    name: 'Aesthetic Boho Arch',
    category: 'stickers',
    type: 'svg',
    createdAt: Date.now() - 40000,
    width: 130,
    height: 160,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="130" height="160" viewBox="0 0 130 160" fill="none">
        <!-- outer arch container -->
        <path d="M20 148 L20 65 A45 45 0 0 1 110 65 L110 148 Z" fill="#FAF5EE" stroke="#E8DFD3" stroke-width="2"/>
        <!-- nested terracotta arch with sun -->
        <path d="M30 148 L30 65 A35 35 0 0 1 100 65 L100 148 Z" fill="#EED4C5"/>
        <!-- rising sun -->
        <circle cx="65" cy="100" r="22" fill="#E8B07A"/>
        <!-- radiating sun beams -->
        <line x1="65" y1="70" x2="65" y2="62" stroke="#D99379" stroke-width="2" stroke-linecap="round"/>
        <line x1="44" y1="79" x2="38" y2="73" stroke="#D99379" stroke-width="2" stroke-linecap="round"/>
        <line x1="86" y1="79" x2="92" y2="73" stroke="#D99379" stroke-width="2" stroke-linecap="round"/>
        <!-- sage green lower horizon band -->
        <path d="M30 124 L100 124 L100 148 L30 148 Z" fill="#777D5E"/>
        <circle cx="65" cy="136" r="4" fill="#FAF5EE"/>
      </svg>
    `)
  },
  {
    id: 'stk-idea-badge',
    name: 'Spark of Idea',
    category: 'stickers',
    type: 'svg',
    createdAt: Date.now() - 30000,
    width: 120,
    height: 120,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none">
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
    createdAt: Date.now() - 20000,
    width: 140,
    height: 140,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 140 140" fill="none">
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
    createdAt: Date.now() - 10000,
    width: 160,
    height: 80,
    url: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" width="160" height="80" viewBox="0 0 160 80" fill="none">
        <rect x="5" y="5" width="150" height="70" rx="12" fill="#FAF6F0" stroke="#777D5E" stroke-width="2"/>
        <text x="80" y="38" font-family="'Caveat', cursive" font-size="22" font-weight="bold" fill="#30312D" text-anchor="middle">made with love</text>
        <path d="M80 50 C75 45 68 50 68 55 C68 62 80 67 80 67 C80 67 92 62 92 55 C92 50 85 45 80 50 Z" fill="#D99379"/>
      </svg>
    `)
  }
];
