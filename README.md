# ADHD Tracker Chrome Extension

A Chrome extension to help track focus, activities, and manage ADHD-related tasks through browser-based tracking.

## Tech Stack

- React 19 + TypeScript
- Vite (rolldown-vite) for building
- Chrome Extension Manifest V3
- Chrome APIs: storage, alarms, notifications

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Chrome browser

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. **Add extension icons** (required before building):
   - Create `public/icon16.png` (16x16px)
   - Create `public/icon48.png` (48x48px)
   - Create `public/icon128.png` (128x128px)

3. Build the extension:
```bash
pnpm build
```

### Loading in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `dist/` folder from this project

### Development

For active development with auto-rebuild:

```bash
pnpm build:watch
```

After making changes, reload the extension in Chrome:
- Go to `chrome://extensions/`
- Click the refresh icon on the ADHD Tracker extension

## Project Structure

```
src/
├── popup/          # React UI for extension popup
│   ├── index.tsx   # Entry point
│   ├── App.tsx     # Main component
│   └── App.css     # Styles
├── background/     # Background service worker
│   └── index.ts    # Handles tracking, storage, notifications
├── content/        # Content scripts (runs on web pages)
│   └── index.ts    # Tracks page activity
└── shared/         # Shared utilities and types
    ├── types.ts    # TypeScript interfaces
    ├── storage.ts  # Chrome storage helpers
    └── messaging.ts # Chrome messaging helpers
```

## Features (Planned)

- Track focus sessions
- Monitor page activity and distractions
- Session history and statistics
- Notifications for tracking reminders
- Activity logging across tabs

## Available Scripts

- `pnpm build` - Build extension for production
- `pnpm build:watch` - Build and watch for changes
- `pnpm type-check` - Run TypeScript type checking
- `pnpm lint` - Lint code with ESLint

## Chrome Extension Architecture

This extension uses Manifest V3 with:
- **Popup**: React-based UI shown when clicking the extension icon
- **Background Service Worker**: Handles persistent logic and data
- **Content Scripts**: Injected into web pages to track activity

See `CLAUDE.md` for detailed architecture documentation.
