export interface FontOption {
  name: string;
  family: string;
  category: 'Modern Sans' | 'Elegant Serif' | 'Script & Cursive' | 'Display & Creative' | 'Monospace & Retro';
}

export const FONT_CATEGORIES = [
  'Modern Sans',
  'Elegant Serif',
  'Script & Cursive',
  'Display & Creative',
  'Monospace & Retro'
] as const;

export const TEXT_STYLES: FontOption[] = [
  // 1. Modern Sans (12 fonts)
  { name: 'Plus Jakarta Sans', family: 'Plus Jakarta Sans', category: 'Modern Sans' },
  { name: 'Inter', family: 'Inter', category: 'Modern Sans' },
  { name: 'Roboto', family: 'Roboto', category: 'Modern Sans' },
  { name: 'Open Sans', family: 'Open Sans', category: 'Modern Sans' },
  { name: 'Montserrat', family: 'Montserrat', category: 'Modern Sans' },
  { name: 'Poppins', family: 'Poppins', category: 'Modern Sans' },
  { name: 'Lato', family: 'Lato', category: 'Modern Sans' },
  { name: 'Raleway', family: 'Raleway', category: 'Modern Sans' },
  { name: 'Work Sans', family: 'Work Sans', category: 'Modern Sans' },
  { name: 'Nunito', family: 'Nunito', category: 'Modern Sans' },
  { name: 'Rubik', family: 'Rubik', category: 'Modern Sans' },
  { name: 'Outfit', family: 'Outfit', category: 'Modern Sans' },

  // 2. Elegant Serif (10 fonts)
  { name: 'Newsreader', family: 'Newsreader', category: 'Elegant Serif' },
  { name: 'Playfair Display', family: 'Playfair Display', category: 'Elegant Serif' },
  { name: 'Merriweather', family: 'Merriweather', category: 'Elegant Serif' },
  { name: 'Lora', family: 'Lora', category: 'Elegant Serif' },
  { name: 'Cinzel', family: 'Cinzel', category: 'Elegant Serif' },
  { name: 'Cormorant Garamond', family: 'Cormorant Garamond', category: 'Elegant Serif' },
  { name: 'Bodoni Moda', family: 'Bodoni Moda', category: 'Elegant Serif' },
  { name: 'EB Garamond', family: 'EB Garamond', category: 'Elegant Serif' },
  { name: 'Libre Baskerville', family: 'Libre Baskerville', category: 'Elegant Serif' },
  { name: 'DM Serif Display', family: 'DM Serif Display', category: 'Elegant Serif' },

  // 3. Script & Cursive (12 fonts)
  { name: 'Caveat', family: 'Caveat', category: 'Script & Cursive' },
  { name: 'Pacifico', family: 'Pacifico', category: 'Script & Cursive' },
  { name: 'Dancing Script', family: 'Dancing Script', category: 'Script & Cursive' },
  { name: 'Shadows Into Light', family: 'Shadows Into Light', category: 'Script & Cursive' },
  { name: 'Satisfy', family: 'Satisfy', category: 'Script & Cursive' },
  { name: 'Great Vibes', family: 'Great Vibes', category: 'Script & Cursive' },
  { name: 'Kaushan Script', family: 'Kaushan Script', category: 'Script & Cursive' },
  { name: 'Sacramento', family: 'Sacramento', category: 'Script & Cursive' },
  { name: 'Homemade Apple', family: 'Homemade Apple', category: 'Script & Cursive' },
  { name: 'Kalam', family: 'Kalam', category: 'Script & Cursive' },
  { name: 'Patrick Hand', family: 'Patrick Hand', category: 'Script & Cursive' },
  { name: 'Indie Flower', family: 'Indie Flower', category: 'Script & Cursive' },

  // 4. Display & Creative (10 fonts)
  { name: 'Bebas Neue', family: 'Bebas Neue', category: 'Display & Creative' },
  { name: 'Oswald', family: 'Oswald', category: 'Display & Creative' },
  { name: 'Anton', family: 'Anton', category: 'Display & Creative' },
  { name: 'Righteous', family: 'Righteous', category: 'Display & Creative' },
  { name: 'Abril Fatface', family: 'Abril Fatface', category: 'Display & Creative' },
  { name: 'Bangers', family: 'Bangers', category: 'Display & Creative' },
  { name: 'Permanent Marker', family: 'Permanent Marker', category: 'Display & Creative' },
  { name: 'Lobster', family: 'Lobster', category: 'Display & Creative' },
  { name: 'Comfortaa', family: 'Comfortaa', category: 'Display & Creative' },
  { name: 'Fredoka', family: 'Fredoka', category: 'Display & Creative' },

  // 5. Monospace & Retro (6 fonts)
  { name: 'Fira Code', family: 'Fira Code', category: 'Monospace & Retro' },
  { name: 'JetBrains Mono', family: 'JetBrains Mono', category: 'Monospace & Retro' },
  { name: 'Space Mono', family: 'Space Mono', category: 'Monospace & Retro' },
  { name: 'Source Code Pro', family: 'Source Code Pro', category: 'Monospace & Retro' },
  { name: 'Courier Prime', family: 'Courier Prime', category: 'Monospace & Retro' },
  { name: 'VT323', family: 'VT323', category: 'Monospace & Retro' }
];
