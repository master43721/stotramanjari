/**
 * Sacred Audio Engine & Karaoke Synchronization
 * Built on Web Audio API:
 * - Authentic Tanpura drone (Sa-Pa-Sa primordial vibration)
 * - Temple Bell (Ghanta) resonant acoustics on transitions
 * - Vedic Chant tonal cadence synthesizer
 * - Millisecond-accurate timestamp synchronization for karaoke lyrics
 * - Japa loop repeater (1x, 3x, 5x, 11x, infinite)
 * - Playback rate scaling (0.75x, 1.0x, 1.25x, 1.5x)
 */
(function (global) {
  'use strict';

  function SacredAudioEngine() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.currentTime = 0;
    this.totalDuration = 86;
    this.playbackRate = 1.0;
    this.volume = 0.85;

    // Active stotram & verse tracking
    this.currentStotram = null;
    this.activeVerseIndex = 0;

    // Loop configuration
    this.loopMode = 1; // 1 = play once, 3 = loop 3x, 5, 11, Infinity
    this.currentVerseLoopCount = 1;

    // Nodes
    this.masterGain = null;
    this.tanpuraGain = null;
    this.chantGain = null;

    // Oscillator arrays & state
    this.tanpuraOscs = [];
    this.chantTimer = null;
    this.renderLoopTimer = null;
    this.lastTickTimestamp = 0;

    // Listeners
    this.listeners = {
      timeUpdate: [],
      verseChange: [],
      playStateChange: [],
      loopUpdate: []
    };
  }

  SacredAudioEngine.prototype.initContext = function () {
    if (this.audioCtx) {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      return;
    }

    var AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      console.warn('Web Audio API not supported in this browser.');
      return;
    }

    this.audioCtx = new AudioContextClass();

    // Master gain
    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
    this.masterGain.connect(this.audioCtx.destination);

    // Tanpura sub-bus
    this.tanpuraGain = this.audioCtx.createGain();
    this.tanpuraGain.gain.setValueAtTime(0.35, this.audioCtx.currentTime);
    this.tanpuraGain.connect(this.masterGain);

    // Chant vocal sub-bus
    this.chantGain = this.audioCtx.createGain();
    this.chantGain.gain.setValueAtTime(0.5, this.audioCtx.currentTime);
    this.chantGain.connect(this.masterGain);
  };

  /**
   * Tanpura Drone Synthesizer
   * Creates the foundational Sa-Pa-Sa meditative drone
   */
  SacredAudioEngine.prototype.startTanpuraDrone = function () {
    this.stopTanpuraDrone();
    if (!this.audioCtx) return;

    var baseSa = 136.1; // C#3 (Sacred 136.1Hz Om frequency)
    var pitches = [
      { f: baseSa * 1.5, detune: -4, type: 'sawtooth', gain: 0.12 }, // Pa
      { f: baseSa * 2.0, detune: 3, type: 'triangle', gain: 0.18 },  // High Sa
      { f: baseSa, detune: -2, type: 'sine', gain: 0.28 },           // Base Sa
      { f: baseSa * 0.5, detune: 0, type: 'sine', gain: 0.2 }        // Low Sub-Sa
    ];

    var now = this.audioCtx.currentTime;

    for (var i = 0; i < pitches.length; i++) {
      var p = pitches[i];
      var osc = this.audioCtx.createOscillator();
      var gain = this.audioCtx.createGain();
      var filter = this.audioCtx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);
      filter.Q.setValueAtTime(2.5, now);

      osc.type = p.type;
      osc.frequency.setValueAtTime(p.f, now);
      osc.detune.setValueAtTime(p.detune, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(p.gain, now + 1.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.tanpuraGain);

      osc.start();
      this.tanpuraOscs.push({ osc: osc, gain: gain });
    }
  };

  SacredAudioEngine.prototype.stopTanpuraDrone = function () {
    if (!this.tanpuraOscs.length) return;
    var now = this.audioCtx ? this.audioCtx.currentTime : 0;
    this.tanpuraOscs.forEach(function (item) {
      try {
        if (now) {
          item.gain.gain.setValueAtTime(item.gain.gain.value, now);
          item.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
          item.osc.stop(now + 0.35);
        } else {
          item.osc.stop();
        }
      } catch (e) {
        // Already stopped
      }
    });
    this.tanpuraOscs = [];
  };

  /**
   * Resonant Temple Bell Chime (Ghanta)
   */
  SacredAudioEngine.prototype.ringTempleBell = function () {
    if (!this.audioCtx) return;
    var now = this.audioCtx.currentTime;

    var bellFreqs = [540, 810, 1180, 1620, 2430];
    for (var i = 0; i < bellFreqs.length; i++) {
      var osc = this.audioCtx.createOscillator();
      var gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(bellFreqs[i], now);

      var initGain = (0.08 / (i + 1));
      gain.gain.setValueAtTime(initGain, now);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + 2.5 + i * 0.4);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 3.5);
    }
  };

  /**
   * Vedic Chant Tonal Accompaniment Pulse
   */
  SacredAudioEngine.prototype.playChantPulse = function (frequency, duration) {
    if (!this.audioCtx || !this.isPlaying) return;
    var now = this.audioCtx.currentTime;

    var osc = this.audioCtx.createOscillator();
    var gain = this.audioCtx.createGain();
    var formantFilter = this.audioCtx.createBiquadFilter();

    formantFilter.type = 'bandpass';
    formantFilter.frequency.setValueAtTime(750, now); // Vocal formant simulation
    formantFilter.Q.setValueAtTime(3.5, now);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency, now);

    // Warm envelope
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(formantFilter);
    formantFilter.connect(gain);
    gain.connect(this.chantGain);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  };

  SacredAudioEngine.prototype.loadStotram = function (stotramData) {
    this.currentStotram = stotramData;
    this.totalDuration = stotramData.totalDurationSec || 86;
    this.currentTime = 0;
    this.activeVerseIndex = 0;
    this.currentVerseLoopCount = 1;
    this.emitTimeUpdate();
    this.emitVerseChange();
  };

  SacredAudioEngine.prototype.play = function () {
    this.initContext();
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.lastTickTimestamp = performance.now();
    this.startTanpuraDrone();
    this.ringTempleBell();

    this.startChantSequencer();
    this.startRenderLoop();
    this.emitPlayStateChange();
  };

  SacredAudioEngine.prototype.pause = function () {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    this.stopTanpuraDrone();
    if (this.chantTimer) {
      clearInterval(this.chantTimer);
      this.chantTimer = null;
    }
    if (this.renderLoopTimer) {
      cancelAnimationFrame(this.renderLoopTimer);
      this.renderLoopTimer = null;
    }
    this.emitPlayStateChange();
  };

  SacredAudioEngine.prototype.togglePlayPause = function () {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  };

  SacredAudioEngine.prototype.startChantSequencer = function () {
    var self = this;
    if (this.chantTimer) clearInterval(this.chantTimer);

    // Vedic 3-tone chant scale (Anudatta = 204Hz, Udatta = 228Hz, Svarita = 256Hz)
    var chantScale = [204, 228, 256, 272, 306];

    this.chantTimer = setInterval(function () {
      if (!self.isPlaying) return;
      var note = chantScale[Math.floor(Math.random() * chantScale.length)];
      var dur = (0.7 + Math.random() * 0.8) / self.playbackRate;
      self.playChantPulse(note, dur);
    }, 1200 / self.playbackRate);
  };

  SacredAudioEngine.prototype.startRenderLoop = function () {
    var self = this;

    function tick() {
      if (!self.isPlaying) return;

      var now = performance.now();
      var deltaSec = ((now - self.lastTickTimestamp) / 1000) * self.playbackRate;
      self.lastTickTimestamp = now;

      self.currentTime += deltaSec;

      // Handle verse loops & boundaries
      if (self.currentStotram && self.currentStotram.verses) {
        var currentVerse = self.currentStotram.verses[self.activeVerseIndex];
        if (currentVerse) {
          // If past verse end time
          if (self.currentTime >= currentVerse.endTime) {
            // Check loop mode
            if (self.loopMode > 1 || self.loopMode === Infinity) {
              if (self.loopMode === Infinity || self.currentVerseLoopCount < self.loopMode) {
                // Repeat this verse!
                self.currentVerseLoopCount++;
                self.currentTime = currentVerse.startTime;
                self.ringTempleBell();
                self.emitLoopUpdate();
              } else {
                // Move to next verse
                self.currentVerseLoopCount = 1;
                self.advanceToNextVerse();
              }
            } else {
              self.advanceToNextVerse();
            }
          }
        }
      }

      // Check end of track
      if (self.currentTime >= self.totalDuration) {
        self.currentTime = self.totalDuration;
        self.pause();
        self.currentTime = 0;
        self.activeVerseIndex = 0;
        self.emitVerseChange();
      }

      self.emitTimeUpdate();
      self.renderLoopTimer = requestAnimationFrame(tick);
    }

    this.renderLoopTimer = requestAnimationFrame(tick);
  };

  SacredAudioEngine.prototype.advanceToNextVerse = function () {
    if (!this.currentStotram || !this.currentStotram.verses) return;
    if (this.activeVerseIndex < this.currentStotram.verses.length - 1) {
      this.activeVerseIndex++;
      this.currentVerseLoopCount = 1;
      this.ringTempleBell();
      this.emitVerseChange();
      this.emitLoopUpdate();
    }
  };

  SacredAudioEngine.prototype.seek = function (seconds) {
    this.currentTime = Math.max(0, Math.min(seconds, this.totalDuration));
    this.updateActiveVerseFromTime();
    this.emitTimeUpdate();
  };

  SacredAudioEngine.prototype.seekPercent = function (percent) {
    this.seek((percent / 100) * this.totalDuration);
  };

  SacredAudioEngine.prototype.jumpToVerse = function (verseIndex) {
    if (!this.currentStotram || !this.currentStotram.verses) return;
    if (verseIndex >= 0 && verseIndex < this.currentStotram.verses.length) {
      this.activeVerseIndex = verseIndex;
      this.currentVerseLoopCount = 1;
      var v = this.currentStotram.verses[verseIndex];
      this.currentTime = v.startTime;
      this.ringTempleBell();
      this.emitVerseChange();
      this.emitTimeUpdate();
      this.emitLoopUpdate();
    }
  };

  SacredAudioEngine.prototype.nextVerse = function () {
    if (this.currentStotram && this.activeVerseIndex < this.currentStotram.verses.length - 1) {
      this.jumpToVerse(this.activeVerseIndex + 1);
    }
  };

  SacredAudioEngine.prototype.prevVerse = function () {
    if (this.activeVerseIndex > 0) {
      this.jumpToVerse(this.activeVerseIndex - 1);
    }
  };

  SacredAudioEngine.prototype.updateActiveVerseFromTime = function () {
    if (!this.currentStotram || !this.currentStotram.verses) return;
    var verses = this.currentStotram.verses;
    for (var i = 0; i < verses.length; i++) {
      if (this.currentTime >= verses[i].startTime && this.currentTime < verses[i].endTime) {
        if (this.activeVerseIndex !== i) {
          this.activeVerseIndex = i;
          this.currentVerseLoopCount = 1;
          this.emitVerseChange();
          this.emitLoopUpdate();
        }
        return;
      }
    }
  };

  SacredAudioEngine.prototype.setPlaybackRate = function (rate) {
    this.playbackRate = Math.max(0.5, Math.min(2.0, rate));
    if (this.isPlaying) {
      this.startChantSequencer(); // restart timer with new cadence
    }
  };

  SacredAudioEngine.prototype.setVolume = function (vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
    }
  };

  SacredAudioEngine.prototype.setLoopMode = function (mode) {
    // mode can be 1, 3, 5, 11, or Infinity
    this.loopMode = mode;
    this.currentVerseLoopCount = 1;
    this.emitLoopUpdate();
  };

  // Event dispatchers
  SacredAudioEngine.prototype.onTimeUpdate = function (cb) { this.listeners.timeUpdate.push(cb); };
  SacredAudioEngine.prototype.onVerseChange = function (cb) { this.listeners.verseChange.push(cb); };
  SacredAudioEngine.prototype.onPlayStateChange = function (cb) { this.listeners.playStateChange.push(cb); };
  SacredAudioEngine.prototype.onLoopUpdate = function (cb) { this.listeners.loopUpdate.push(cb); };

  SacredAudioEngine.prototype.emitTimeUpdate = function () {
    var percent = this.totalDuration > 0 ? (this.currentTime / this.totalDuration) * 100 : 0;
    var self = this;
    this.listeners.timeUpdate.forEach(function (fn) {
      fn(self.currentTime, self.totalDuration, percent);
    });
  };

  SacredAudioEngine.prototype.emitVerseChange = function () {
    var self = this;
    this.listeners.verseChange.forEach(function (fn) {
      fn(self.activeVerseIndex);
    });
  };

  SacredAudioEngine.prototype.emitPlayStateChange = function () {
    var self = this;
    this.listeners.playStateChange.forEach(function (fn) {
      fn(self.isPlaying);
    });
  };

  SacredAudioEngine.prototype.emitLoopUpdate = function () {
    var self = this;
    this.listeners.loopUpdate.forEach(function (fn) {
      fn(self.currentVerseLoopCount, self.loopMode);
    });
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SacredAudioEngine;
  } else {
    global.SacredAudioEngine = SacredAudioEngine;
  }
})(typeof window !== 'undefined' ? window : this);
