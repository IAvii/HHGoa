import React, { useState, useRef } from "react";
import hackerHouseLogo from "../assets/Hacker house.png";
import logoSvg from "../assets/2-47.svg";
import goaHindiSvg from "../assets/goa_hindi.svg";
import prehypeVideo from "../assets/Prehype.mp4";
import borderTopSvg from "../assets/002-group-54-14.svg";
import borderBottomSvg from "../assets/155-group-54-27661.svg";

/* ─── styles ─────────────────────────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Imbue:opsz,wght@10..100,400;10..100,500;10..100,700&family=Victor+Mono:wght@600;700&display=swap');

/* ── reset / root ── */
.hhg * { box-sizing: border-box; margin: 0; padding: 0; }

.hhg {
  --green:  #0B6839;
  --yellow: #FEE101;
  --white:  #FFFFFF;
  --imbue:  'Imbue', Georgia, serif;
  --mono:   'Victor Mono', 'Courier New', monospace;

  font-family: var(--mono);
  background: var(--green);
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* ── dot-grid background (openhands hero-pixel-blast style) ── */
.hhg::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, rgba(0, 30, 15, 0.75) 1.5px, transparent 1.5px);
  background-size: 20px 20px;
  opacity: 0.45;
}

/* ── top nav bar ── */
.hhg-nav {
  position: absolute;
  top: 0; left: 0; right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 50px 80px 0;
  z-index: 20;
}

.hhg-nav-logos {
  display: flex;
  align-items: center;
  gap: 20px;
}

.hhg-studio-logo {
  width: 113px;
  height: 99px;
  object-fit: contain;
}

.hhg-nav-right {
  display: flex;
  align-items: center;
  gap: 40px;
}

.hhg-check-hype {
  background: none;
  border: none;
  color: var(--white);
  font-family: var(--mono);
  font-weight: 600;
  font-size: 22px;
  line-height: 0.84em;
  letter-spacing: 0;
  text-transform: uppercase;
  cursor: pointer;
  transition: opacity 0.15s;
}
.hhg-check-hype:hover { opacity: 0.75; }

/* APPLY / Create ID Card button */
.hhg-cta {
  position: relative;
  width: 220px;
  height: 66px;
  background: var(--yellow);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  transition: opacity 0.15s;
  padding: 0;
}
.hhg-cta:hover { opacity: 0.88; }

.hhg-cta-label {
  color: var(--green);
  font-family: var(--imbue);
  font-weight: 700;
  font-size: 30px;
  line-height: 1em;
  text-transform: uppercase;
  white-space: nowrap;
  position: relative;
  z-index: 5;
  user-select: none;
}

.hhg-cta-border {
  position: absolute;
  left: 0;
  width: 100%;
  height: 7px;
  background-repeat: repeat-x;
  background-position: left top;
  background-size: 101px 7px;
  pointer-events: none;
  z-index: 10;
}
.hhg-cta-border-top    { top: 0; }
.hhg-cta-border-bottom { bottom: 0; }

/* ── hero ── */
.hhg-hero {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  pointer-events: none; /* let clicks pass through to children */
}

.hhg-logo-wrap {
  position: relative;
  pointer-events: auto;
}

.hhg-hh-logo {
  width: min(1162px, 90vw);
  display: block;
  object-fit: contain;
}

.hhg-hindi {
  position: absolute;
  /* mirrors the live site: sits just inside the right edge, slightly below center */
  right: -10px;
  bottom: -60px;
  width: 154px;
  height: 152px;
  object-fit: contain;
  pointer-events: none;
}

/* info strip below logo */
.hhg-meta {
  margin-top: 28px;
  display: flex;
  gap: 80px;
  pointer-events: auto;
}

.hhg-meta-text {
  color: var(--yellow);
  font-family: var(--mono);
  font-weight: 600;
  font-size: clamp(14px, 1.6vw, 22px);
  line-height: 0.84em;
  letter-spacing: 0;
  text-transform: uppercase;
}

/* ── video modal ── */
.hhg-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hhg-modal-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hhg-modal-controls {
  position: absolute;
  top: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 210;
}

.hhg-modal-close,
.hhg-modal-mute {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1.5px solid var(--yellow);
  background: rgba(11, 104, 57, 0.92);
  backdrop-filter: blur(8px);
  color: var(--yellow);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0,0,0,0.4);
  transition: background 0.15s, transform 0.1s;
}

.hhg-modal-close:hover,
.hhg-modal-mute:hover {
  background: rgba(11, 104, 57, 1);
}

.hhg-modal-close:active,
.hhg-modal-mute:active {
  transform: scale(0.92);
}
`;

/* ─── component ──────────────────────────────────────────────────────────── */
export default function HHGoaLanding({ onGenerateBadge }) {
  const [showModal, setShowModal] = useState(false);
  const [muted, setMuted]        = useState(false);
  const videoRef                  = useRef(null);

  function toggleMute() {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(v => !v);
    }
  }

  return (
    <div className="hhg">
      <style>{css}</style>

      {/* ── top nav ── */}
      <nav className="hhg-nav">
        {/* left: studio logo only (Hacker House logo lives in the hero) */}
        <div className="hhg-nav-logos">
          <img src={logoSvg} alt="2:47pm Studio" className="hhg-studio-logo" />
        </div>

        {/* right: check hype link + create ID card CTA */}
        <div className="hhg-nav-right">
          <button
            className="hhg-check-hype"
            onClick={() => setShowModal(true)}
          >
            CHECK HYPE
          </button>

          <button className="hhg-cta" onClick={onGenerateBadge}>
            <span className="hhg-cta-label">Create ID Card</span>
            <div
              className="hhg-cta-border hhg-cta-border-top"
              style={{ backgroundImage: `url(${borderTopSvg})` }}
            />
            <div
              className="hhg-cta-border hhg-cta-border-bottom"
              style={{ backgroundImage: `url(${borderBottomSvg})` }}
            />
          </button>
        </div>
      </nav>

      {/* ── hero ── */}
      <div className="hhg-hero">
        <div className="hhg-logo-wrap">
          <img
            src={hackerHouseLogo}
            alt="Hacker House"
            className="hhg-hh-logo"
          />
          <img
            src={goaHindiSvg}
            alt="गोवा"
            className="hhg-hindi"
          />
        </div>

        <div className="hhg-meta">
          <span className="hhg-meta-text">GOA, INDIA · 28 – 31 OCT 2026</span>
          <span className="hhg-meta-text">2:47 pm Studio</span>
        </div>
      </div>

      {/* ── video modal ── */}
      {showModal && (
        <div
          className="hhg-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <video
            ref={videoRef}
            src={prehypeVideo}
            className="hhg-modal-video"
            autoPlay
            loop
            playsInline
            preload="auto"
            onClick={e => e.stopPropagation()}
          />

          {/* modal controls: close + mute */}
          <div className="hhg-modal-controls" onClick={e => e.stopPropagation()}>
            {/* close button */}
            <button
              className="hhg-modal-close"
              onClick={() => setShowModal(false)}
              aria-label="Close video"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* mute button */}
            <button
              className="hhg-modal-mute"
              onClick={() => toggleMute()}
              aria-label={muted ? "Unmute video" : "Mute video"}
            >
              {muted ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
