/**
 * Web Audio API Engine
 * Provides Tanpura Drone (136.1 Hz Sa-Pa-Sa meditative frequency),
 * Temple Bell Chime, and Chanting Timer / Karaoke Pacing Engine.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private tanpuraRunning: boolean = false;
  private tanpuraTimer: number | null = null;
  private tanpuraNodes: { stop: () => void }[] = [];

  private getContext(): AudioContext {
    if (!this.ctx || this.ctx.state === "closed") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Play Temple Bell Chime
   */
  public playTempleBell(): void {
    if (typeof window === "undefined") return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Bell harmonics
      const frequencies = [784, 1175, 1568, 2349, 3136];
      const gains = [0.4, 0.25, 0.15, 0.08, 0.03];
      const decayTimes = [3.5, 2.8, 2.0, 1.2, 0.8];

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.7, now);
      masterGain.connect(ctx.destination);

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        // Quick exponential attack + slow decay
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(gains[idx], now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + decayTimes[idx]);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + decayTimes[idx]);
      });
    } catch (e) {
      console.warn("AudioContext playTempleBell failed:", e);
    }
  }

  /**
   * Pluck single string of Tanpura
   */
  private pluckTanpuraString(frequency: number, duration: number = 3.0): void {
    if (!this.tanpuraRunning || !this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(frequency, now);

    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(frequency * 0.5, now);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(650, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + duration);

    // Warm pluck envelope
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + duration);
    subOsc.stop(now + duration);
  }

  /**
   * Toggle Tanpura Meditative Drone (136.1 Hz Sa-Pa-Sa cycle)
   */
  public startTanpura(): void {
    if (typeof window === "undefined" || this.tanpuraRunning) return;
    try {
      this.getContext();
      this.tanpuraRunning = true;

      // 136.1 Hz = Om fundamental tone (Sa)
      const baseSa = 136.1;
      const Pa = baseSa * 1.5; // 204.15 Hz
      const highSa = baseSa * 2; // 272.2 Hz
      const lowSa = baseSa; // 136.1 Hz

      const notes = [Pa, highSa, highSa, lowSa];
      let step = 0;

      const schedule = () => {
        if (!this.tanpuraRunning) return;
        this.pluckTanpuraString(notes[step % notes.length], 2.8);
        step++;
        this.tanpuraTimer = window.setTimeout(schedule, 1200);
      };

      schedule();
    } catch (e) {
      console.warn("AudioContext startTanpura failed:", e);
    }
  }

  public stopTanpura(): void {
    if (typeof window === "undefined") return;
    this.tanpuraRunning = false;
    if (this.tanpuraTimer) {
      clearTimeout(this.tanpuraTimer);
      this.tanpuraTimer = null;
    }
  }

  public isTanpuraActive(): boolean {
    return this.tanpuraRunning;
  }
}

export const audioEngine = new AudioEngine();
