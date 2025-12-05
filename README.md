# SmartWidgets - E-commerce Personalization Platform

A modern, modular SaaS platform prototype for building and deploying e-commerce personalization widgets. Following the standards of platforms like Nosto, Optimizely, and AB Tasty.

## Features

- **Widgets Library**: Browse template carousels with recommendation sliders, category pushers, AI similar products, product boosters, and video widgets
- **Visual Editor**: Live preview with customizable parameters, styles, and behaviors
- **My Widgets**: Table listing with thumbnails, status management, and quick actions
- **Targeting**: URL conditions, product filters, and custom conditions with rule builder
- **Display in Page**: Visual element selector with position options
- **Installation**: Master tag and individual widget tags with one-click copy
- **Preview**: Sandboxed widget preview on any URL
- **Status Management**: Start, pause, and stop widgets

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   └── (dashboard)/       # Dashboard layout with sidebar
│       ├── library/       # Widgets library
│       ├── my-widgets/    # My widgets list
│       ├── editor/        # Visual editor
│       ├── targeting/     # Targeting rules
│       ├── display/       # Display position selector
│       ├── install/       # Installation code
│       ├── preview/       # Widget preview
│       ├── settings/      # Account settings
│       └── style/         # Global style editor
├── components/
│   ├── editor/            # Visual editor components
│   ├── layout/            # Layout components (sidebar, topbar)
│   ├── library/           # Library page components
│   ├── providers/         # Context providers
│   ├── targeting/         # Targeting rule builder
│   ├── ui/               # Reusable UI components
│   └── widgets/          # Widget-related components
├── store/                 # State management
└── types/                 # TypeScript types
```

## UI Principles

- Fixed left side panel navigation
- Light top bar on internal pages
- Card-based layouts with generous spacing
- Clear visual hierarchy with neutral colors
- Visible feedback (toasts, inline validation)
- Responsive viewport controls in editor/preview

## License

MIT

