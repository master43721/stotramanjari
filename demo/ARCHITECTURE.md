# Stotra Manjari: Architecture & Feature Engineering Guide

This document details the architecture and implementation of the **Stotra Manjari** interactive prototype located in `/demo`. It explains the five requested core features and demonstrates how the application is deployed to **GitHub Pages** using **GitHub Actions**.

---

## 1. Executive Summary & Architecture Overview

The Stotra Manjari web application is designed as a devotional sanctuary for chanting and reading sacred Sanskrit and Telugu stotrams. It combines classical temple aesthetics (midnight obsidian, pure gold, and palm-leaf aged parchment) with modern web engineering standards:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          User Interface (UI)                           │
│  ┌──────────────────────┬──────────────────────┬────────────────────┐  │
│  │   Vedic Panchang     │  My Daily Puja Mala  │  Theme & Typography│  │
│  │   (Astronomical)     │  (localStorage)      │  (A+ / A-, Sepia)  │  │
│  └──────────────────────┴──────────────────────┴────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │         Multi-Script Stotram Reader & Karaoke Highlighter         │  │
│  │  (Telugu, Devanagari, Kannada, Tamil, IAST + Word Padaccheda)     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
           ┌────────────────────────┼────────────────────────┐
           ▼                        ▼                        ▼
┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐
│  Multi-Script Engine │ │  Sacred Audio Synth  │ │     PWA Service      │
│    (Sanscript.js)    │ │   (Web Audio API)    │ │        Worker        │
│  - 0ms Client-side   │ │  - 136.1Hz Tanpura   │ │  - Offline Cache     │
│  - 5 Indic Schemes   │ │  - Resonant Chimes   │ │  - Background Sync   │
│  - Zero Network Lat. │ │  - Karaoke Sync Cues │ │  - Installable App   │
└──────────────────────┘ └──────────────────────┘ └──────────────────────┘
```

---

## 2. Deep Dive: The 5 Core Features

### Feature 1: Typography & Readability Improvements
* **Dynamic Text Resizing:** Controlled via CSS custom property `--reader-font-size`, calculated as `1.35rem * fontScale`. Users can adjust scale between 75% and 185% in 10% increments via `A+` and `A-` buttons, or reset to 100%.
* **Configurable Display Themes:**
  1. **Dark (Default):** Deep obsidian (`#070707`) with glowing pure gold accents (`#d4af37`), ambient radial glow orbs, and soft card borders.
  2. **Sepia Aged-Paper:** Modeled after traditional palm-leaf manuscripts and aged sacred parchment (`#f5efe3` background, `#2a2116` sandalwood ink, `#b56b14` amber gold).
  3. **Daylight Clean Light:** Pure ivory (`#fafaf8`) with dark charcoal text and polished brass accents for outdoor readability.
* **Web-Optimized Unicode Fonts:**
  - Telugu: `Noto Sans Telugu`
  - Devanagari: `Noto Serif Devanagari` & `Noto Sans Devanagari`
  - Kannada: `Noto Sans Kannada`
  - Tamil: `Noto Sans Tamil`
  - IAST Roman: `Outfit` & `Cinzel`

### Feature 2: Multi-Script & Linguistic Inclusivity
* **Zero-Latency Client-Side Transliteration (`sanscript.js`):**
  - Indian scripts share a common phonetic matrix (Brahmic scripts).
  - The embedded `Sanscript` engine maps vowels, consonants, conjuncts, anusvara, visarga, and virama across **Telugu**, **Devanagari**, **Kannada**, **Tamil**, and **IAST (Roman with diacritics)**.
  - Switching scripts re-renders the verse text, stotra title, and word breakdowns instantaneously without fetching from a server.
* **Verse-by-Verse Line & Word Breakdown (Padaccheda):**
  - Each verse includes an expandable drawer showing individual Sanskrit compound splits (Samasa/Sandhi), grammatical root words, and concise contextual meanings.
  - Accompanied by **English Bhavartha** (philosophical and devotional purport) and **Telugu Tatparyam** (summary in simple Telugu).

### Feature 3: Audio Integration & Visual Pacing
* **Synthesized Sacred Audio (`audio-engine.js`):**
  - Eliminates reliance on external MP3 downloads (which fail when offline or on unstable networks).
  - **Tanpura Drone:** Generates a continuous Sa-Pa-Sa polyphonic drone at **136.1 Hz** (the meditative frequency corresponding to C#3) with harmonic overtones and low-pass filtering.
  - **Temple Bell (Ghanta):** Synthesizes rich metallic bells on verse transitions and play triggers.
  - **Vedic Chant Cadence:** Plays three-tone Vedic chant pulses (Anudatta, Udatta, Svarita).
* **Karaoke-Style Synchronized Highlighting:**
  - Each verse is mapped with precise timestamps (`startTime` and `endTime`).
  - Active verse gets an illuminated gold halo border, ambient gradient, and left accent bar.
  - Smooth auto-scrolling keeps the chanting verse centered in view.
* **Japa Chanting Loop:**
  - Allows devotees to loop any verse for meditation: 1x (normal), 3x, 5x, 11x, or Infinite (Japa mode).
* **Tempo Scaling:**
  - Playback rates selectable from `0.75x`, `1.0x`, `1.25x`, and `1.5x`.

### Feature 4: Interactive "Everyday" Features
* **Vedic Panchang Astronomical Engine (`panchang.js`):**
  - Calculates the **Vara** (Sanskrit weekday & presiding deity).
  - Computes the **Tithi** (lunar day: 30 tithis across Shukla and Krishna Paksha) via solar and lunar elongation algorithms.
  - Computes the active **Nakshatra** (from 27 lunar mansions) using Lahiri sidereal longitude.
  - Determines inauspicious **Rahu Kalam**, **Yamagandam**, and **Gulika Kalam** windows using traditional 8-part diurnal daylight division.
  - Identifies the sacred **Abhijit Muhurtam** (midday 8th muhurta).
  - Live status indicator alerts users whether the current moment is auspicious or in Rahu Kalam.
* **"Stotra of the Day" Recommendation:**
  - Maps deities to days of the week:
    - *Sunday:* Surya Bhagavan (Sri Aditya Hrudayam)
    - *Monday:* Lord Shiva (Sri Shiva Panchakshari Stotram)
    - *Tuesday:* Lord Hanuman & Subrahmanya (Sri Hanuman Chalisa)
    - *Wednesday:* Lord Ganesha & Krishna (Sri Ganesha Pancharatnam)
    - *Thursday:* Guru Raghavendra & Dattatreya (Sri Guru Paduka Stotram)
    - *Friday:* Goddess Mahalakshmi & Durga (Sri Mahalakshmi Ashtakam)
    - *Saturday:* Sri Venkateshwara Swami & Shani Dev (Sri Venkateshwara Suprabhatam)
  - Features a one-click button to load and chant today's stotram.
* **"My Daily Puja" Routine Builder:**
  - Sequence manager persisted in `localStorage`.
  - Step-by-step guided puja mode walks through chosen stotrams sequentially.
  - Verses can be bookmarked and saved.

### Feature 5: Progressive Web App (PWA) & Offline Resilience
* **PWA Web App Manifest (`manifest.json`):**
  - Defines app name, theme color (`#d4af37`), background color (`#060606`), standalone display mode, and shortcut actions.
  - Includes responsive sacred vector icons (`icon-192.svg`, `icon-512.svg`).
* **Service Worker (`sw.js`):**
  - Pre-caches all HTML, CSS, JavaScript, icons, and stotram data assets.
  - Implements a Cache-First strategy with network fallback, enabling complete functionality without an active internet connection.
  - Features an online/offline status pill indicator with live network state listeners.

---

## 3. GitHub Actions CI/CD & GitHub Pages Deployment

The repository uses GitHub Actions (`.github/workflows/deploy.yml`) to deploy to GitHub Pages. Here is how both the Next.js app and the `/demo` prototype are deployed seamlessly:

```yaml
name: Deploy Static Site to GitHub Pages

on:
  push:
    branches:
      - master
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build static site
        run: npm run build

      # Copy standalone demo into static export directory
      - name: Bundle demo folder into Pages artifact
        run: |
          mkdir -p ./out/demo
          cp -r ./demo/* ./out/demo/

      - name: Upload build artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Why Relative Paths (`./`) are Essential for GitHub Pages:
On GitHub Pages, repositories are typically hosted under a sub-path:
`https://<username>.github.io/<repository-name>/demo/`

By using `./styles.css`, `./app.js`, `./icons/icon-192.svg`, etc., the demo runs properly:
- In local development (`http://localhost:8080/demo/` or `file:///`)
- In root production (`https://stotramanjari.com/demo/`)
- In GitHub Pages sub-directories (`https://<username>.github.io/stotramanjari/demo/`)

---

## 4. How to Run Locally

You can test the demo immediately with any local web server:

```bash
# Using Python 3 built-in HTTP server:
python3 -m http.server 8080

# Or using npx:
npx serve .
```

Then open:
[http://localhost:8080/demo/index.html](http://localhost:8080/demo/index.html)
