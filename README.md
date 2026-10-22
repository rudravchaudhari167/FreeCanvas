# FreeCanvas — Ideas Into Beauty

> A free, browser-based digital drawing workspace and creative canvas designed with botanical minimalism and creative elegance.

![FreeCanvas Design Reference](public/favicon.svg)

---

## ✨ Features

- **Botanical & Creative Aesthetic**:
  - Warm ivory and cream surfaces (`#F8F3EC`, `#FFFEFA`, `#FAF6F0`).
  - Curated natural color palette: Sage green (`#777D5E`), Warm Peach (`#EED4C5`), Terracotta (`#D99379`), Muted Lavender (`#A9A8D0`), Soft Blue (`#A9BDD9`), and Charcoal (`#4A4B46`).
  - Subtle organic botanical foliage and peach wave accents in corners that sit behind workspace controls.
  - Minimal handwritten empty state: *"Turn your ideas into something beautiful — Draw, create, and make it yours."*

- **Interactive Drawing Engine (Powered by Fabric.js v7)**:
  - **Smooth Pen**: Fluid continuous ink strokes with custom width, opacity, and smoothing.
  - **Sketch Pencil**: Sketch-textured strokes for freehand ideation.
  - **Marker / Highlighter**: Translucent chisel strokes for highlighting and artistic fills.
  - **Eraser**: Dual-mode object and stroke deletion.
  - **Editable Text**: Multi-font typography (`Plus Jakarta Sans`, `Caveat` handwritten script, `Newsreader` serif, monospace) with Bold, Italic, Underline, and alignment.
  - **Geometric & Creative Shapes (34 Shapes)**: Drag-to-create or click-to-place with categorized filter pills (Basic, Polygons, Stars & Badges, Arrows, and Creative Symbols: Heart, Cloud, Shield, Crescent, Lightning Bolt, Speech Bubble, Thought Bubble, Teardrop Pin, 4/6/8-Point Stars, 12-Point Badge, Cross, Chevron, and more) with real-time shape morphing, customizable fill, border stroke, and opacity.
  - **Straight Lines & Arrows**: Directional connectors with solid, dashed, or dotted styling.
  - **Sticky Notes**: Soft pastel note cards with handwritten thought capture.
  - **Transform & Select**: Move, resize with boundary handles, rotate, lock/unlock, duplicate, and reorder.

- **Floating UI Controls (Following Reference Image 1)**:
  - **Top Header**: Botanical leaf logo, "FreeCanvas" wordmark, File / Edit / View dropdown menus, Undo, Redo, live Save Status indicator, sage-green Save button, and account profile icon.
  - **Left Toolbar**: Slim, floating rounded pill toolbar featuring 10 tools with icons, keyboard shortcuts, tooltips, and active sage pill highlight.
  - **Right Properties Panel**: Floating contextual properties inspector displaying active tool or selected object settings, color circle with HEX dropdown, 6 preset swatches, size slider with pixel readout, and opacity slider with percentage readout.
  - **Bottom Floating Toolbar**: Zoom out `−`, zoom percentage readout, zoom in `+`, `Fit to Screen`, `Grid` toggle switch, and `Background` surface dropdown.

- **Botanical Gallery & Image Support**:
  - Bundled high-resolution SVG botanical illustrations (Monstera, Olive branch, Ginkgo, Artisan Vase, Bohemian Sun).
  - Bundled aesthetic stickers (Washi tape, Idea badges, Peach blooms, Stamps).
  - Custom image upload with drag-and-drop zone (PNG, JPG, WebP, SVG).
  - Local asset persistence in IndexedDB.

- **Offline Persistence & Project Management**:
  - 100% offline and client-side: no servers, accounts, or API keys required.
  - Projects stored in browser **IndexedDB** with live autosave (debounced).
  - Projects gallery with thumbnail cards, timestamps, renaming, duplication, and deletion.

- **Export Artwork**:
  - Download artwork only (excluding UI headers and background foliage).
  - Export to **PNG (Lossless)** or **JPEG (Compressed)**.
  - Optional transparent background for PNG.
  - Resolution scaling (1x standard, 2x Retina, 3x Print).
  - Confetti celebration effect on export.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ (tested on Node v22.23.2)
- **npm** v9+

### Installation

```bash
# Clone or navigate to the project directory
cd Canvas

# Install dependencies
npm install
```

### Development Server

```bash
# Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Description |
| :--- | :--- |
| `V` | Select & Transform tool |
| `P` | Smooth Pen tool |
| `B` | Sketch Pencil tool |
| `M` | Marker / Highlighter tool |
| `E` | Eraser tool |
| `T` | Editable Text tool |
| `S` | Geometric Shapes tool |
| `I` | Insert Image / Open Gallery |
| `L` | Straight Line tool |
| `⌘ / Ctrl + Z` | Undo action |
| `⌘ / Ctrl + ⇧ + Z` | Redo action |
| `⌘ / Ctrl + S` | Save project locally |
| `⌘ / Ctrl + E` | Export artwork |
| `⌘ / Ctrl + D` | Duplicate selected object |
| `Delete` / `Backspace` | Delete selected object |
| `Space + Drag` | Pan workspace |
| `Mouse Wheel` | Smooth zoom in / out |
| `⌘ / Ctrl + 0` | Reset zoom to 100% |
| `⌘ / Ctrl + 1` | Fit artwork to screen |
| `?` | View shortcuts guide |

---

## 🌿 Technical Architecture

- **React 19** + **TypeScript**
- **Vite** bundler
- **Fabric.js v7** (Object-oriented canvas engine)
- **Lucide React** (Consistent line iconography)
- **IndexedDB** (Persistent browser storage for projects and uploaded gallery media)
- **CSS Design Tokens** (Warm botanical theme variables)
