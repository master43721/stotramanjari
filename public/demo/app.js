/**
 * Stotra Manjari - Core Application Controller
 * Orchestrates:
 * 1. Typography & Readability (dynamic font scaling, theme switching, font stacks)
 * 2. Multi-Script Transliteration (Sanscript.js integration across 5 scripts)
 * 3. Audio Integration & Visual Pacing (karaoke sync, japa loop, speed controls)
 * 4. Everyday Features (Vedic Panchang calculations, Stotra of the Day, Daily Puja routine)
 * 5. PWA & Offline Support (Service worker registration, install prompts, caching)
 */

(function () {
  'use strict';

  // Application State
  const AppState = {
    theme: localStorage.getItem('sm_theme') || 'dark',
    currentScript: localStorage.getItem('sm_script') || 'telugu',
    fontScale: parseFloat(localStorage.getItem('sm_fontScale') || '1.0'),
    lineHeightIdx: parseInt(localStorage.getItem('sm_lhIdx') || '1', 10), // 0=compact, 1=normal, 2=spacious
    activeStotramId: 'ganesha-pancharatnam',
    activeStotram: null,
    isFocusMode: false,
    autoScroll: true,
    allMeaningsExpanded: false,
    bookmarkedVerses: JSON.parse(localStorage.getItem('sm_bookmarks') || '[]'),
    dailyPuja: JSON.parse(localStorage.getItem('sm_daily_puja') || '["ganesha-pancharatnam", "shiva-panchakshari"]'),
    pujaRunning: false,
    pujaStep: 0
  };

  const LINE_HEIGHTS = [
    { label: 'Compact', val: '1.5' },
    { label: 'Standard', val: '1.95' },
    { label: 'Spacious', val: '2.4' }
  ];

  let audioEngine = null;
  let deferredInstallPrompt = null;

  // DOM Elements Cache
  const DOM = {};

  function initDOMElements() {
    DOM.body = document.body;
    DOM.themeDarkBtn = document.getElementById('theme-dark-btn');
    DOM.themeSepiaBtn = document.getElementById('theme-sepia-btn');
    DOM.themeLightBtn = document.getElementById('theme-light-btn');
    DOM.scriptSelect = document.getElementById('script-select');
    DOM.stotraSelect = document.getElementById('stotra-select');
    DOM.fontDecreaseBtn = document.getElementById('font-decrease-btn');
    DOM.fontIncreaseBtn = document.getElementById('font-increase-btn');
    DOM.fontResetBtn = document.getElementById('font-reset-btn');
    DOM.fontPercentLabel = document.getElementById('font-percent-label');
    DOM.lineHeightBtn = document.getElementById('line-height-btn');
    DOM.focusModeBtn = document.getElementById('focus-mode-btn');
    DOM.toggleMeaningsBtn = document.getElementById('toggle-all-meanings-btn');
    DOM.autoScrollToggle = document.getElementById('auto-scroll-toggle');
    DOM.versesContainer = document.getElementById('verses-container');

    // Reader Headers
    DOM.readerDeityBadge = document.getElementById('reader-deity-badge');
    DOM.readerTitleScript = document.getElementById('reader-title-script');
    DOM.readerTitleEnglish = document.getElementById('reader-title-english');
    DOM.readerComposer = document.getElementById('reader-composer');
    DOM.readerVerseCount = document.getElementById('reader-verse-count');

    // Audio Dock
    DOM.playBtn = document.getElementById('audio-play-btn');
    DOM.prevVerseBtn = document.getElementById('audio-prev-btn');
    DOM.nextVerseBtn = document.getElementById('audio-next-btn');
    DOM.speedSelect = document.getElementById('audio-speed-select');
    DOM.loopPill = document.getElementById('audio-loop-pill');
    DOM.scrubberWrap = document.getElementById('scrubber-wrap');
    DOM.scrubberFill = document.getElementById('scrubber-fill');
    DOM.timeCurrent = document.getElementById('time-current');
    DOM.timeTotal = document.getElementById('time-total');
    DOM.dockTitle = document.getElementById('dock-track-title');
    DOM.dockSubtitle = document.getElementById('dock-track-subtitle');

    // Panchang & Puja
    DOM.panchangVara = document.getElementById('panchang-vara');
    DOM.panchangTithi = document.getElementById('panchang-tithi');
    DOM.panchangNakshatra = document.getElementById('panchang-nakshatra');
    DOM.panchangRahu = document.getElementById('panchang-rahu');
    DOM.panchangStatus = document.getElementById('panchang-status');
    DOM.recStotraTitle = document.getElementById('rec-stotra-title');
    DOM.recStotraReason = document.getElementById('rec-stotra-reason');
    DOM.recStotraLoadBtn = document.getElementById('rec-stotra-load-btn');
    DOM.pujaListContainer = document.getElementById('puja-list-container');
    DOM.startPujaBtn = document.getElementById('start-puja-btn');
    DOM.addCurrentToPujaBtn = document.getElementById('add-current-to-puja-btn');

    // Architecture Modal
    DOM.openArchModalBtn = document.getElementById('open-arch-modal-btn');
    DOM.closeArchModalBtn = document.getElementById('close-arch-modal-btn');
    DOM.archModal = document.getElementById('arch-modal');

    // PWA elements
    DOM.offlineBadge = document.getElementById('offline-badge');
    DOM.installAppBtn = document.getElementById('install-app-btn');
  }

  // =========================================================================
  // 1. THEMES & TYPOGRAPHY
  // =========================================================================
  function applyTheme(themeName) {
    AppState.theme = themeName;
    localStorage.setItem('sm_theme', themeName);
    document.documentElement.setAttribute('data-theme', themeName);

    // Update buttons
    [DOM.themeDarkBtn, DOM.themeSepiaBtn, DOM.themeLightBtn].forEach(btn => {
      if (btn) btn.classList.remove('active');
    });
    if (themeName === 'dark' && DOM.themeDarkBtn) DOM.themeDarkBtn.classList.add('active');
    if (themeName === 'sepia' && DOM.themeSepiaBtn) DOM.themeSepiaBtn.classList.add('active');
    if (themeName === 'light' && DOM.themeLightBtn) DOM.themeLightBtn.classList.add('active');
  }

  function applyTypography() {
    const baseRem = 1.35;
    const finalSize = (baseRem * AppState.fontScale).toFixed(2);
    document.documentElement.style.setProperty('--reader-font-size', `${finalSize}rem`);
    document.documentElement.style.setProperty('--reader-line-height', LINE_HEIGHTS[AppState.lineHeightIdx].val);

    if (DOM.fontPercentLabel) {
      DOM.fontPercentLabel.textContent = `${Math.round(AppState.fontScale * 100)}%`;
    }
    if (DOM.lineHeightBtn) {
      DOM.lineHeightBtn.textContent = `↕ ${LINE_HEIGHTS[AppState.lineHeightIdx].label}`;
    }

    localStorage.setItem('sm_fontScale', AppState.fontScale.toString());
    localStorage.setItem('sm_lhIdx', AppState.lineHeightIdx.toString());
  }

  function adjustFont(delta) {
    let newScale = Math.round((AppState.fontScale + delta) * 10) / 10;
    newScale = Math.max(0.75, Math.min(1.85, newScale));
    AppState.fontScale = newScale;
    applyTypography();
  }

  function resetFont() {
    AppState.fontScale = 1.0;
    AppState.lineHeightIdx = 1;
    applyTypography();
  }

  function cycleLineHeight() {
    AppState.lineHeightIdx = (AppState.lineHeightIdx + 1) % LINE_HEIGHTS.length;
    applyTypography();
  }

  function toggleFocusMode() {
    AppState.isFocusMode = !AppState.isFocusMode;
    DOM.body.classList.toggle('focus-mode', AppState.isFocusMode);
    if (DOM.focusModeBtn) {
      DOM.focusModeBtn.textContent = AppState.isFocusMode ? '👁️ Exit Focus' : '🧘 Sacred Focus';
      DOM.focusModeBtn.classList.toggle('btn-primary', AppState.isFocusMode);
    }
  }

  // =========================================================================
  // 2. MULTI-SCRIPT TRANSLITERATION & RENDERING
  // =========================================================================
  function getTransliterated(text, targetScript) {
    if (!window.Sanscript || !text) return text;
    // Base texts are in Telugu script
    return window.Sanscript.t(text, 'telugu', targetScript);
  }

  function renderCurrentStotram() {
    const stotram = window.STOTRAMS_DATA.find(s => s.id === AppState.activeStotramId) || window.STOTRAMS_DATA[0];
    AppState.activeStotram = stotram;

    // Header info
    const scriptClass = `script-${AppState.currentScript}`;
    DOM.readerTitleScript.className = `reader-title-script ${scriptClass}`;
    DOM.readerTitleScript.textContent = getTransliterated(stotram.title_telugu, AppState.currentScript);
    DOM.readerTitleEnglish.textContent = stotram.title_english;
    DOM.readerDeityBadge.textContent = `🕉️ ${stotram.deity}`;
    DOM.readerComposer.textContent = `Composer: ${stotram.composer}`;
    DOM.readerVerseCount.textContent = `${stotram.verses.length} Sacred Verses`;

    // Audio dock info
    DOM.dockTitle.textContent = getTransliterated(stotram.title_telugu, AppState.currentScript);
    DOM.dockSubtitle.textContent = stotram.title_english;

    // Load into audio engine
    if (audioEngine) {
      audioEngine.loadStotram(stotram);
    }

    // Render verses
    DOM.versesContainer.innerHTML = '';
    const scriptFontClass = `font-${AppState.currentScript}`;

    stotram.verses.forEach((verse, idx) => {
      const isBookmarked = AppState.bookmarkedVerses.includes(`${stotram.id}_v${verse.verseNumber}`);
      const isFirst = idx === 0;

      const verseCard = document.createElement('article');
      verseCard.className = `verse-card ${isFirst ? 'active' : ''} ${AppState.allMeaningsExpanded ? 'expanded' : ''}`;
      verseCard.id = `verse-${idx}`;
      verseCard.setAttribute('data-verse-idx', idx);

      // Transliterated verse lines
      const transliteratedLines = verse.lines_telugu.map(l => getTransliterated(l, AppState.currentScript));

      // Transliterated word breakdown
      const wordChipsHtml = verse.wordBreakdown.map(wb => {
        const transWord = getTransliterated(wb.word, AppState.currentScript);
        return `
          <div class="word-chip">
            <span class="word-sanskrit ${scriptFontClass}">${transWord}</span>
            <span class="word-english">${wb.meaning}</span>
          </div>
        `;
      }).join('');

      verseCard.innerHTML = `
        <div class="verse-header-bar">
          <div class="verse-num-badge">
            <span>Verse ${verse.verseNumber}</span>
            <span style="opacity: 0.5">/ ${stotram.verses.length}</span>
          </div>
          <div class="verse-controls">
            <button class="btn btn-sm bookmark-btn ${isBookmarked ? 'btn-primary' : ''}" data-verse-num="${verse.verseNumber}" title="Bookmark Verse">
              ${isBookmarked ? '★ Saved' : '☆ Save'}
            </button>
            <button class="btn btn-sm toggle-meaning-btn" title="Toggle Meanings">
              📖 Meaning ▾
            </button>
          </div>
        </div>

        <div class="verse-lines-body ${scriptFontClass}">
          ${transliteratedLines.map(line => `<div class="verse-line">${line}</div>`).join('')}
        </div>

        <div class="verse-meanings-drawer">
          <div class="drawer-section-title">
            <span>🔍 Padaccheda & Word-by-Word Analysis</span>
          </div>
          <div class="words-grid">
            ${wordChipsHtml}
          </div>

          <div class="meaning-block">
            <div class="drawer-section-title">🌟 English Bhavartha (Devotional Purport)</div>
            <p>${verse.englishSummary}</p>
          </div>

          <div class="meaning-block">
            <div class="drawer-section-title">🌺 తాత్పర్యం (Simple Telugu Meaning)</div>
            <p>${verse.teluguTatparyam}</p>
          </div>
        </div>
      `;

      // Event listener: click verse card to jump audio playback
      verseCard.addEventListener('click', (e) => {
        // Ignore if clicking toggle or bookmark buttons
        if (e.target.closest('.toggle-meaning-btn') || e.target.closest('.bookmark-btn')) return;
        if (audioEngine) {
          audioEngine.jumpToVerse(idx);
          if (!audioEngine.isPlaying) {
            audioEngine.play();
          }
        }
      });

      // Toggle meaning button
      const toggleBtn = verseCard.querySelector('.toggle-meaning-btn');
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        verseCard.classList.toggle('expanded');
      });

      // Bookmark button
      const bookmarkBtn = verseCard.querySelector('.bookmark-btn');
      bookmarkBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleBookmark(stotram.id, verse.verseNumber, bookmarkBtn);
      });

      DOM.versesContainer.appendChild(verseCard);
    });
  }

  function toggleBookmark(stotramId, verseNum, btnElement) {
    const key = `${stotramId}_v${verseNum}`;
    const idx = AppState.bookmarkedVerses.indexOf(key);
    if (idx >= 0) {
      AppState.bookmarkedVerses.splice(idx, 1);
      btnElement.textContent = '☆ Save';
      btnElement.classList.remove('btn-primary');
    } else {
      AppState.bookmarkedVerses.push(key);
      btnElement.textContent = '★ Saved';
      btnElement.classList.add('btn-primary');
    }
    localStorage.setItem('sm_bookmarks', JSON.stringify(AppState.bookmarkedVerses));
  }

  function toggleAllMeanings() {
    AppState.allMeaningsExpanded = !AppState.allMeaningsExpanded;
    const cards = DOM.versesContainer.querySelectorAll('.verse-card');
    cards.forEach(card => {
      card.classList.toggle('expanded', AppState.allMeaningsExpanded);
    });
    if (DOM.toggleMeaningsBtn) {
      DOM.toggleMeaningsBtn.textContent = AppState.allMeaningsExpanded ? '📖 Collapse All Meanings' : '📖 Expand All Meanings';
    }
  }

  // =========================================================================
  // 3. AUDIO INTEGRATION & VISUAL PACING (KARAOKE)
  // =========================================================================
  function initAudioPlayer() {
    audioEngine = new window.SacredAudioEngine();

    // Time update listener
    audioEngine.onTimeUpdate((curr, total, percent) => {
      if (DOM.scrubberFill) DOM.scrubberFill.style.width = `${percent}%`;
      if (DOM.timeCurrent) DOM.timeCurrent.textContent = formatTime(curr);
      if (DOM.timeTotal) DOM.timeTotal.textContent = formatTime(total);
    });

    // Verse change listener (Karaoke Highlight & Scroll)
    audioEngine.onVerseChange((activeIdx) => {
      const allCards = DOM.versesContainer.querySelectorAll('.verse-card');
      allCards.forEach((card, idx) => {
        if (idx === activeIdx) {
          card.classList.add('active');
          if (AppState.autoScroll) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } else {
          card.classList.remove('active');
        }
      });
    });

    // Play/Pause state change listener
    audioEngine.onPlayStateChange((isPlaying) => {
      if (DOM.playBtn) {
        DOM.playBtn.innerHTML = isPlaying ? '⏸' : '▶';
        DOM.playBtn.title = isPlaying ? 'Pause Chanting' : 'Start Sacred Chanting';
      }
    });

    // Loop state listener
    audioEngine.onLoopUpdate((currLoop, maxLoop) => {
      if (DOM.loopPill) {
        if (maxLoop === 1) {
          DOM.loopPill.textContent = '🔁 Loop: Off';
          DOM.loopPill.classList.remove('active');
        } else if (maxLoop === Infinity) {
          DOM.loopPill.textContent = `🔁 Infinite Loop (${currLoop})`;
          DOM.loopPill.classList.add('active');
        } else {
          DOM.loopPill.textContent = `🔁 Loop: ${currLoop}/${maxLoop}`;
          DOM.loopPill.classList.add('active');
        }
      }
    });

    // Play/Pause button
    DOM.playBtn.addEventListener('click', () => {
      audioEngine.togglePlayPause();
    });

    // Previous / Next verse
    DOM.prevVerseBtn.addEventListener('click', () => {
      audioEngine.prevVerse();
    });
    DOM.nextVerseBtn.addEventListener('click', () => {
      audioEngine.nextVerse();
    });

    // Scrubber click
    DOM.scrubberWrap.addEventListener('click', (e) => {
      const rect = DOM.scrubberWrap.getBoundingClientRect();
      const clickPos = (e.clientX - rect.left) / rect.width;
      audioEngine.seekPercent(clickPos * 100);
    });

    // Speed selector
    DOM.speedSelect.addEventListener('change', (e) => {
      audioEngine.setPlaybackRate(parseFloat(e.target.value));
    });

    // Loop pill click (cycles 1 -> 3 -> 5 -> 11 -> Infinity -> 1)
    const loopCycle = [1, 3, 5, 11, Infinity];
    let loopIdx = 0;
    DOM.loopPill.addEventListener('click', () => {
      loopIdx = (loopIdx + 1) % loopCycle.length;
      audioEngine.setLoopMode(loopCycle[loopIdx]);
    });
  }

  function formatTime(seconds) {
    const s = Math.floor(seconds || 0);
    const mins = Math.floor(s / 60);
    const remSec = s % 60;
    return `${mins}:${remSec < 10 ? '0' : ''}${remSec}`;
  }

  // =========================================================================
  // 4. EVERYDAY FEATURES: PANCHANG & DAILY PUJA ROUTINE
  // =========================================================================
  function initPanchang() {
    if (!window.Panchang) return;
    const pData = window.Panchang.calculate(new Date());

    DOM.panchangVara.textContent = `${pData.vara.english} (${pData.vara.sanskrit})`;
    DOM.panchangTithi.textContent = `${pData.tithiName} - ${pData.paksha}`;
    DOM.panchangNakshatra.textContent = `${pData.nakshatra.name} (${pData.nakshatra.telugu})`;
    DOM.panchangRahu.textContent = pData.rahuKalam;

    // Status banner
    DOM.panchangStatus.className = `panchang-status-banner ${pData.statusBadge.type}`;
    DOM.panchangStatus.innerHTML = `
      <span>${pData.statusBadge.label}</span>
      <span style="font-size: 0.72rem; opacity: 0.8">${pData.statusBadge.desc}</span>
    `;

    // Stotra of the Day
    DOM.recStotraTitle.textContent = pData.stotraOfDay.title;
    DOM.recStotraReason.textContent = `${pData.stotraOfDay.deity} • ${pData.stotraOfDay.reason}`;

    DOM.recStotraLoadBtn.addEventListener('click', () => {
      // Find matching stotram or load Ganesha/Shiva
      const matched = window.STOTRAMS_DATA.find(s => s.id === pData.stotraOfDay.id) || window.STOTRAMS_DATA[0];
      AppState.activeStotramId = matched.id;
      DOM.stotraSelect.value = matched.id;
      renderCurrentStotram();
      window.scrollTo({ top: DOM.readerTitleScript.offsetTop - 100, behavior: 'smooth' });
    });
  }

  function renderPujaRoutine() {
    DOM.pujaListContainer.innerHTML = '';

    if (!AppState.dailyPuja.length) {
      DOM.pujaListContainer.innerHTML = '<p style="font-size: 0.8rem; color: var(--text-muted); padding: 0.5rem 0;">No stotrams added to your routine yet.</p>';
      return;
    }

    AppState.dailyPuja.forEach((stotraId, idx) => {
      const item = window.STOTRAMS_DATA.find(s => s.id === stotraId) || { title_english: stotraId };
      const row = document.createElement('div');
      row.className = `puja-item ${AppState.pujaRunning && AppState.pujaStep === idx ? 'active' : ''}`;

      row.innerHTML = `
        <div class="puja-item-info">
          <div class="puja-step-number">${idx + 1}</div>
          <div>
            <strong style="font-size: 0.85rem; color: var(--text-primary); display: block;">${item.title_english}</strong>
            <span style="font-size: 0.72rem; color: var(--text-secondary);">${item.deity || 'Devotional Chant'}</span>
          </div>
        </div>
        <div class="puja-actions">
          <button class="btn btn-sm start-item-btn" title="Open this stotram">Play</button>
          <button class="btn btn-sm remove-item-btn" title="Remove from sequence">×</button>
        </div>
      `;

      row.querySelector('.start-item-btn').addEventListener('click', () => {
        AppState.activeStotramId = stotraId;
        DOM.stotraSelect.value = stotraId;
        renderCurrentStotram();
        if (audioEngine) audioEngine.play();
      });

      row.querySelector('.remove-item-btn').addEventListener('click', () => {
        AppState.dailyPuja.splice(idx, 1);
        localStorage.setItem('sm_daily_puja', JSON.stringify(AppState.dailyPuja));
        renderPujaRoutine();
      });

      DOM.pujaListContainer.appendChild(row);
    });
  }

  function startGuidedPuja() {
    if (!AppState.dailyPuja.length) return;
    AppState.pujaRunning = true;
    AppState.pujaStep = 0;
    const currentId = AppState.dailyPuja[0];
    AppState.activeStotramId = currentId;
    DOM.stotraSelect.value = currentId;
    renderCurrentStotram();
    renderPujaRoutine();
    if (audioEngine) audioEngine.play();
    alert(`🕉️ Starting Daily Puja Routine!\nStep 1: ${AppState.activeStotram.title_english}`);
  }

  function addCurrentToPuja() {
    if (!AppState.dailyPuja.includes(AppState.activeStotramId)) {
      AppState.dailyPuja.push(AppState.activeStotramId);
      localStorage.setItem('sm_daily_puja', JSON.stringify(AppState.dailyPuja));
      renderPujaRoutine();
    }
  }

  // =========================================================================
  // 5. PROGRESSIVE WEB APP & OFFLINE RESILIENCE
  // =========================================================================
  function initPWA() {
    // Service Worker Registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered successfully:', reg.scope);
        })
        .catch((err) => {
          console.log('[PWA] Service Worker registration failed (normal on raw file protocol):', err);
        });
    }

    // Network status listener
    function updateOnlineBadge() {
      if (DOM.offlineBadge) {
        if (navigator.onLine) {
          DOM.offlineBadge.innerHTML = '<span class="pulse-dot"></span> Offline Ready';
          DOM.offlineBadge.title = 'App assets are fully cached and available offline';
        } else {
          DOM.offlineBadge.innerHTML = '<span class="pulse-dot" style="background: #f59e0b"></span> Offline Mode';
          DOM.offlineBadge.title = 'Currently reading disconnected from network';
        }
      }
    }

    window.addEventListener('online', updateOnlineBadge);
    window.addEventListener('offline', updateOnlineBadge);
    updateOnlineBadge();

    // PWA Install Prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredInstallPrompt = e;
      if (DOM.installAppBtn) {
        DOM.installAppBtn.style.display = 'inline-flex';
      }
    });

    if (DOM.installAppBtn) {
      DOM.installAppBtn.addEventListener('click', async () => {
        if (!deferredInstallPrompt) return;
        deferredInstallPrompt.prompt();
        const choice = await deferredInstallPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          console.log('[PWA] User accepted install prompt');
        }
        deferredInstallPrompt = null;
        DOM.installAppBtn.style.display = 'none';
      });
    }
  }

  // =========================================================================
  // 6. ARCHITECTURE MODAL CONTROLS
  // =========================================================================
  function initArchitectureModal() {
    if (!DOM.openArchModalBtn || !DOM.archModal) return;

    DOM.openArchModalBtn.addEventListener('click', () => {
      DOM.archModal.classList.add('open');
    });

    DOM.closeArchModalBtn.addEventListener('click', () => {
      DOM.archModal.classList.remove('open');
    });

    DOM.archModal.addEventListener('click', (e) => {
      if (e.target === DOM.archModal) {
        DOM.archModal.classList.remove('open');
      }
    });

    // Tab switching inside modal
    const tabBtns = DOM.archModal.querySelectorAll('.modal-tab-btn');
    const tabPanels = DOM.archModal.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetId = btn.getAttribute('data-tab');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });
  }

  // =========================================================================
  // INITIALIZATION LIFECYCLE
  // =========================================================================
  function initApp() {
    initDOMElements();

    // Themes
    applyTheme(AppState.theme);
    DOM.themeDarkBtn.addEventListener('click', () => applyTheme('dark'));
    DOM.themeSepiaBtn.addEventListener('click', () => applyTheme('sepia'));
    DOM.themeLightBtn.addEventListener('click', () => applyTheme('light'));

    // Typography
    applyTypography();
    DOM.fontDecreaseBtn.addEventListener('click', () => adjustFont(-0.1));
    DOM.fontIncreaseBtn.addEventListener('click', () => adjustFont(0.1));
    DOM.fontResetBtn.addEventListener('click', resetFont);
    DOM.lineHeightBtn.addEventListener('click', cycleLineHeight);
    DOM.focusModeBtn.addEventListener('click', toggleFocusMode);
    DOM.toggleMeaningsBtn.addEventListener('click', toggleAllMeanings);

    if (DOM.autoScrollToggle) {
      DOM.autoScrollToggle.addEventListener('change', (e) => {
        AppState.autoScroll = e.target.checked;
      });
    }

    // Script Selection
    DOM.scriptSelect.value = AppState.currentScript;
    DOM.scriptSelect.addEventListener('change', (e) => {
      AppState.currentScript = e.target.value;
      localStorage.setItem('sm_script', AppState.currentScript);
      renderCurrentStotram();
    });

    // Stotra Selection
    DOM.stotraSelect.value = AppState.activeStotramId;
    DOM.stotraSelect.addEventListener('change', (e) => {
      AppState.activeStotramId = e.target.value;
      renderCurrentStotram();
    });

    // Audio Engine
    initAudioPlayer();

    // Panchang & Puja Routine
    initPanchang();
    renderPujaRoutine();
    DOM.startPujaBtn.addEventListener('click', startGuidedPuja);
    DOM.addCurrentToPujaBtn.addEventListener('click', addCurrentToPuja);

    // Initial Stotram Render
    renderCurrentStotram();

    // Architecture Modal & PWA
    initArchitectureModal();
    initPWA();
  }

  // Boot on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
