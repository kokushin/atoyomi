# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

必ず日本語で回答してください。

## Project Overview

**atoyomi** is a Chrome browser extension that provides "read later" functionality for web pages. It's a Manifest V3 Chrome extension built with vanilla JavaScript, HTML, and CSS, using Gulp for build automation.

## Development Commands

### Building the Extension

```bash
npm install           # Install dependencies
gulp build           # Build optimized extension package for Chrome Web Store
```

The build process:

1. Copies source files to `build/` directory
2. Minifies HTML, CSS, and JavaScript
3. Creates a versioned ZIP file in `release/` directory
4. Cleans up temporary build files

### Development Workflow

- Edit files in the root directory
- Run `gulp build` to create the packaged extension
- Load the `build/` directory in Chrome's extension developer mode for testing
- Final ZIP package is created in `release/atoyomi_[version].zip`

## Architecture Overview

### Core Components

- **manifest.json**: Chrome extension manifest (V3) with tabs and storage permissions
- **popup.html**: Extension popup interface with save button and saved pages list
- **js/script.js**: Main `Atoyomi` class handling all functionality
- **css/style.css**: Modern CSS styling with Flexbox layout
- **\_locales/**: Internationalization files for English and Japanese

### Data Storage

Uses browser localStorage with this schema:

```javascript
{
  id: "unique-id",
  title: "Page Title",
  url: "https://example.com",
  date: "YYYY/M/D"
}
```

### Key Features

- Save current tab title/URL
- Auto-delete pages when accessed
- Badge counter on extension icon
- Tweet sharing functionality
- Bilingual support (English/Japanese)

## Code Structure

### Main JavaScript Class (`js/script.js`)

The `Atoyomi` class handles:

- Chrome extension APIs interaction
- localStorage management
- UI rendering and event handling
- Badge counter updates
- Social sharing functionality

### Build Configuration (`gulpfile.js`)

Gulp tasks for:

- `copy`: Copy source files to build directory
- `htmlmin`, `cssmin`, `jsmin`: Minify respective file types
- `zip`: Package extension for Chrome Web Store
- `clean`: Remove temporary build files
- `build`: Run complete build sequence

### Internationalization

Messages are defined in `_locales/[lang]/messages.json` and referenced in manifest.json and popup.html using Chrome's i18n API format (`__MSG_messageName__`).

## Technology Stack

- **Vanilla JavaScript (ES6+)** with Chrome Extension APIs
- **Gulp.js** for build automation with Babel transpilation
- **localStorage** for data persistence (no external servers)
- **Font Awesome 4.7.0** for UI icons
- **Chrome Manifest V3** with modern async/await APIs

## Testing

No formal testing framework is currently configured. Manual testing is done by loading the extension in Chrome developer mode.
