"use client";

import { useEffect, useState, useRef } from "react";
import { audioEngine } from "@/lib/audioEngine";

interface AudioDockProps {
  totalVerses: number;
  activeVerse: number;
  onVerseChange: (index: number) => void;
  audioUrl?: string;
  timestamps?: number[];
  currentStanzaText?: string;
}

export default function AudioDock({
  totalVerses,
  activeVerse,
  onVerseChange,
  audioUrl,
  timestamps,
  currentStanzaText,
}: AudioDockProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const duration = audioUrl && audioDuration > 0
    ? audioDuration
    : (timestamps && timestamps.length > 0)
    ? timestamps[timestamps.length - 1] + 6
    : totalVerses * 6; // default 6s per verse for chanting pacing
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [japaTarget, setJapaTarget] = useState<number | "inf">(1);
  const [currentJapaCount, setCurrentJapaCount] = useState<number>(1);
  const [tanpuraOn, setTanpuraOn] = useState<boolean>(false);
  const [speechRecitationOn, setSpeechRecitationOn] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Speed options
  const speeds = [0.75, 1.0, 1.25, 1.5];
  // Japa loop options
  const japaOptions: (number | "inf")[] = [1, 3, 5, 11, "inf"];

  // Helper to safely speak with Web Speech API
  const speakVerse = (text: string, rate: number = 0.9) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      if (!text || text.trim() === "") return;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = Math.max(0.7, Math.min(1.2, rate * 0.9));
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const teluguVoice = voices.find(v => v.lang.startsWith("te") || v.name.toLowerCase().includes("telugu"));
      const hindiVoice = voices.find(v => v.lang.startsWith("hi") || v.name.toLowerCase().includes("hindi") || v.name.toLowerCase().includes("sanskrit"));
      const indicVoice = voices.find(v => v.lang.includes("IN"));
      if (teluguVoice) {
        utterance.voice = teluguVoice;
      } else if (hindiVoice) {
        utterance.voice = hindiVoice;
      } else if (indicVoice) {
        utterance.voice = indicVoice;
      }
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("SpeechSynthesis error:", e);
    }
  };

  const stopSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  };

  // Toggle Tanpura Drone
  const handleToggleTanpura = () => {
    if (tanpuraOn) {
      audioEngine.stopTanpura();
      setTanpuraOn(false);
    } else {
      audioEngine.startTanpura();
      setTanpuraOn(true);
    }
  };

  // Ring Temple Bell
  const handleRingBell = () => {
    audioEngine.playTempleBell();
  };

  // Play / Pause toggle
  const togglePlay = () => {
    if (!isPlaying) {
      // Auspicious temple bell chime at start
      audioEngine.playTempleBell();
      setIsPlaying(true);
      if (audioUrl && audioRef.current) {
        audioRef.current.playbackRate = playbackSpeed;
        audioRef.current.play().catch(() => {});
      }
    } else {
      setIsPlaying(false);
      if (audioUrl && audioRef.current) {
        audioRef.current.pause();
      }
      stopSpeech();
    }
  };

  const handleSpeedChange = (s: number) => {
    setPlaybackSpeed(s);
    if (audioUrl && audioRef.current) {
      audioRef.current.playbackRate = s;
    }
  };

  // Web Speech API Recitation sync with active verse
  useEffect(() => {
    if (isPlaying && speechRecitationOn && !audioUrl && currentStanzaText) {
      speakVerse(currentStanzaText, playbackSpeed);
    }
  }, [activeVerse, isPlaying, speechRecitationOn, audioUrl, currentStanzaText, playbackSpeed]);

  // Timed Pacing Timer (active when not playing real audioUrl)
  useEffect(() => {
    if (!isPlaying || audioUrl) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = 250;
    const intervalSec = (intervalMs / 1000) * playbackSpeed;

    timerRef.current = window.setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + intervalSec;
        const maxDur = duration || totalVerses * 6;

        if (next >= maxDur) {
          // Check Japa repetition loop
          if (japaTarget === "inf" || currentJapaCount < japaTarget) {
            audioEngine.playTempleBell(); // Chime bell at loop transition
            setCurrentJapaCount((c) => c + 1);
            onVerseChange(0);
            return 0; // restart from beginning
          } else {
            // Completed all repetitions
            setIsPlaying(false);
            stopSpeech();
            audioEngine.playTempleBell();
            return 0;
          }
        }

        // Calculate active verse from timestamps or linear distribution
        if (timestamps && timestamps.length > 0) {
          let found = 0;
          for (let i = 0; i < timestamps.length; i++) {
            if (next >= timestamps[i]) found = i;
          }
          if (found !== activeVerse) onVerseChange(found);
        } else if (totalVerses > 0) {
          const verseDuration = maxDur / totalVerses;
          const calculatedVerse = Math.min(
            totalVerses - 1,
            Math.floor(next / verseDuration)
          );
          if (calculatedVerse !== activeVerse) {
            onVerseChange(calculatedVerse);
          }
        }

        return next;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, audioUrl, duration, playbackSpeed, japaTarget, currentJapaCount, totalVerses, timestamps, activeVerse, onVerseChange]);

  // Real Audio Event Handlers
  const handleAudioTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    setCurrentTime(cur);

    if (timestamps && timestamps.length > 0) {
      let found = 0;
      for (let i = 0; i < timestamps.length; i++) {
        if (cur >= timestamps[i]) found = i;
      }
      if (found !== activeVerse) onVerseChange(found);
    } else if (totalVerses > 0 && audioDuration > 0) {
      const verseDuration = audioDuration / totalVerses;
      const targetVerse = Math.min(totalVerses - 1, Math.floor(cur / verseDuration));
      if (targetVerse !== activeVerse) onVerseChange(targetVerse);
    }
  };

  const handleAudioEnded = () => {
    if (japaTarget === "inf" || currentJapaCount < japaTarget) {
      audioEngine.playTempleBell();
      setCurrentJapaCount((c) => c + 1);
      onVerseChange(0);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } else {
      setIsPlaying(false);
      audioEngine.playTempleBell();
      setCurrentJapaCount(1);
    }
  };

  // Unmount cleanup for audio drone and speech
  useEffect(() => {
    return () => {
      stopSpeech();
      audioEngine.stopTanpura();
    };
  }, []);

  // Scrub handler
  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioUrl && audioRef.current) {
      audioRef.current.currentTime = val;
    }
    const maxDur = duration || totalVerses * 6;

    if (timestamps && timestamps.length > 0) {
      let found = 0;
      for (let i = 0; i < timestamps.length; i++) {
        if (val >= timestamps[i]) found = i;
      }
      onVerseChange(found);
    } else if (totalVerses > 0) {
      const verseDuration = maxDur / totalVerses;
      const targetVerse = Math.min(totalVerses - 1, Math.floor(val / verseDuration));
      onVerseChange(targetVerse);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="audio-dock-container">
      <div className="audio-dock-inner">
        {/* Play/Pause & Bell & Drone controls */}
        <div className="audio-dock-controls-group" style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            onClick={togglePlay}
            className="btn"
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              padding: 0,
              backgroundColor: "var(--accent)",
              color: "#060606",
              fontSize: "1.1rem",
              fontWeight: "700",
              boxShadow: "0 0 15px var(--accent-glow)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title={isPlaying ? "Pause Chanting" : "Begin Sacred Chanting"}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>

          <button
            onClick={handleRingBell}
            className="btn"
            style={{
              padding: "0.35rem 0.65rem",
              borderRadius: "20px",
              fontSize: "0.82rem",
              backgroundColor: "transparent",
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
            }}
            title="Ring Temple Bell (Ganta)"
          >
            🔔 Bell
          </button>

          <button
            onClick={handleToggleTanpura}
            className="btn"
            style={{
              padding: "0.35rem 0.65rem",
              borderRadius: "20px",
              fontSize: "0.82rem",
              backgroundColor: tanpuraOn ? "var(--accent-light)" : "transparent",
              borderColor: tanpuraOn ? "var(--accent)" : "var(--border)",
              color: tanpuraOn ? "var(--accent)" : "var(--text-secondary)",
              boxShadow: tanpuraOn ? "0 0 12px var(--accent-glow)" : "none",
            }}
            title="Toggle 136.1Hz Meditative Tanpura Drone"
          >
            🪕 Tanpura {tanpuraOn ? "ON" : "OFF"}
          </button>

          {/* Voice Recitation Toggle (Web Speech API) */}
          {!audioUrl && (
            <button
              onClick={() => setSpeechRecitationOn(!speechRecitationOn)}
              className="btn"
              style={{
                padding: "0.35rem 0.65rem",
                borderRadius: "20px",
                fontSize: "0.82rem",
                backgroundColor: speechRecitationOn ? "var(--accent-light)" : "transparent",
                borderColor: speechRecitationOn ? "var(--accent)" : "var(--border)",
                color: speechRecitationOn ? "var(--accent)" : "var(--text-secondary)",
                boxShadow: speechRecitationOn ? "0 0 12px var(--accent-glow)" : "none",
              }}
              title="Toggle Live Vocal Chanting (Web Speech Recitation)"
            >
              🎙️ Voice {speechRecitationOn ? "ON" : "OFF"}
            </button>
          )}
        </div>

        {/* Hidden HTML5 Audio Element for audioUrl */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            preload="metadata"
            onTimeUpdate={handleAudioTimeUpdate}
            onLoadedMetadata={() => {
              if (audioRef.current) setAudioDuration(audioRef.current.duration);
            }}
            onEnded={handleAudioEnded}
          />
        )}

        {/* Timeline Scrubber */}
        <div className="audio-scrubber-row">
          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", minWidth: "35px" }}>
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || totalVerses * 6}
            step="0.5"
            value={currentTime}
            onChange={handleScrub}
            className="audio-slider"
          />
          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", minWidth: "35px" }}>
            {formatTime(duration || totalVerses * 6)}
          </span>
        </div>

        {/* Playback speed & Japa repetition picker */}
        <div className="audio-speed-japa-group" style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          {/* Speed */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>
              Speed:
            </span>
            {speeds.map((s) => (
              <button
                key={s}
                onClick={() => handleSpeedChange(s)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "0.2rem 0.4rem",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  color: playbackSpeed === s ? "var(--accent)" : "var(--text-secondary)",
                  fontWeight: playbackSpeed === s ? "700" : "500",
                  backgroundColor: playbackSpeed === s ? "var(--accent-light)" : "transparent",
                }}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Japa Repetitions */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>
              Japa:
            </span>
            {japaOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setJapaTarget(opt);
                  setCurrentJapaCount(1);
                }}
                style={{
                  background: "none",
                  border: "none",
                  padding: "0.2rem 0.45rem",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  color: japaTarget === opt ? "var(--accent)" : "var(--text-secondary)",
                  fontWeight: japaTarget === opt ? "700" : "500",
                  backgroundColor: japaTarget === opt ? "var(--accent-light)" : "transparent",
                }}
                title={opt === "inf" ? "Infinite Chanting Loop" : `${opt} Repetitions`}
              >
                {opt === "inf" ? "∞" : `${opt}x`}
              </button>
            ))}
            {japaTarget !== 1 && (
              <span
                style={{
                  fontSize: "0.72rem",
                  color: "var(--accent)",
                  fontWeight: "600",
                  marginLeft: "0.2rem",
                }}
              >
                ({currentJapaCount}/{japaTarget === "inf" ? "∞" : japaTarget})
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
