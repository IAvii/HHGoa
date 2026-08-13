import React, { useState } from "react";
import hackerHouseLogo from "../assets/Hacker house.png";
import landingBg from "../assets/Landing-background.png";
import logoSvg from "../assets/2-47.svg";
import prehypeVideo from "../assets/Prehype.mp4";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Imbue:opsz,wght@10..100,400;10..100,600;10..100,700&family=Victor+Mono:ital,wght@0,400;0,600;0,700;1,500&display=swap');

.hhg-landing {
  --green: #0B6839;
  --green-deep: #063017;
  --sun: #FEE101;
  --coral: #FF6A3D;
  --sand: #FFFBE8;
  --ink: #06170F;
  --line: rgba(255,251,232,0.16);

  font-family: 'Victor Mono', monospace;
  background: var(--green-deep);
  color: var(--sand);
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hhg-landing * {
  box-sizing: border-box;
}

/* Background graphics */
.hhg-landing .bg-image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0.28;
  pointer-events: none;
  z-index: 0;
}

.hhg-landing .bg-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 30%, rgba(254, 225, 1, 0.12), transparent 60%),
              radial-gradient(circle at 85% 80%, rgba(255, 106, 61, 0.15), transparent 50%),
              linear-gradient(to bottom, rgba(6, 48, 23, 0.6), rgba(6, 23, 15, 0.95));
  pointer-events: none;
  z-index: 1;
}

/* Content Container */
.hhg-landing .main-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px 36px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Header / Nav */
.hhg-landing .nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.hhg-landing .brand-logos {
  display: flex;
  align-items: center;
  gap: 16px;
}

.hhg-landing .hh-logo {
  height: 44px;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.hhg-landing .studio-logo {
  height: 32px;
  object-fit: contain;
  filter: brightness(0) saturate(100%) invert(78%) sepia(82%) saturate(400%) hue-rotate(5deg) brightness(103%);
}

.hhg-landing .event-tag {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--sun);
}

/* Center Hero */
.hhg-landing .hero {
  text-align: center;
  margin: auto 0;
}

.hhg-landing .eyebrow {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.35em;
  font-size: 13px;
  color: var(--sun);
  margin-bottom: 12px;
}

.hhg-landing h1 {
  font-family: 'Imbue', serif;
  font-size: clamp(52px, 8.5vw, 110px);
  font-weight: 700;
  line-height: 0.95;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  margin: 0;
}

.hhg-landing h1 .stroke {
  -webkit-text-stroke: 2px var(--sand);
  color: transparent;
}

.hhg-landing .hero-sub {
  font-size: clamp(12px, 1.5vw, 16px);
  font-weight: 600;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--sand);
  opacity: 0.85;
  margin-top: 18px;
}

/* Options Action Container */
.hhg-landing .actions-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px;
  margin-top: 42px;
  flex-wrap: wrap;
}

.hhg-landing .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: 'Imbue', serif;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 22px;
  letter-spacing: 0.04em;
  padding: 16px 42px;
  border: none;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-decoration: none;
  min-width: 200px;
}

.hhg-landing .btn:hover {
  transform: translate(-3px, -3px);
}

.hhg-landing .btn:active {
  transform: translate(0, 0);
}

.hhg-landing .btn-hype {
  background: var(--coral);
  color: var(--sand);
  box-shadow: 6px 6px 0 var(--ink), 6px 6px 0 1px var(--sand);
}

.hhg-landing .btn-create {
  background: var(--sun);
  color: var(--green-deep);
  box-shadow: 6px 6px 0 var(--ink), 6px 6px 0 1px var(--sand);
}

/* Footer info line */
.hhg-landing .footer-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  opacity: 0.65;
  border-top: 1px solid var(--line);
  padding-top: 16px;
}

/* Video Modal */
.hhg-landing .modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(6, 23, 15, 0.92);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.hhg-landing .modal-box {
  position: relative;
  width: 100%;
  max-width: 900px;
  background: #000;
  border: 2px solid var(--sun);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
}

.hhg-landing .close-btn {
  position: absolute;
  top: 12px;
  right: 16px;
  z-index: 10;
  background: var(--coral);
  color: var(--sand);
  border: none;
  font-size: 18px;
  font-weight: bold;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hhg-landing video {
  width: 100%;
  max-height: 80vh;
  display: block;
  outline: none;
}
`;

export default function HHGoaLanding({ onGenerateBadge }) {
  const [showHypeModal, setShowHypeModal] = useState(false);

  return (
    <div className="hhg-landing">
      <style>{CSS}</style>
      <div
        className="bg-image"
        style={{ backgroundImage: `url(${landingBg})` }}
      />
      <div className="bg-gradient" />

      <div className="main-content">
        {/* Navigation / Header */}
        <header className="nav">
          <div className="brand-logos">
            <img
              src={hackerHouseLogo}
              alt="Hacker House"
              className="hh-logo"
            />
            <img src={logoSvg} alt="2:47pm Studio" className="studio-logo" />
          </div>
          <div className="event-tag">Goa · Oct 28–31, 2026</div>
        </header>

        {/* Center Hero Section */}
        <main className="hero">
          <div className="eyebrow">Hacker House Goa 2026</div>
          <h1>
            Build <span className="stroke">The</span> Vibe
          </h1>
          <p className="hero-sub">4 days · one rhythm · everything intentional</p>

          <div className="actions-row">
            <button
              className="btn btn-hype"
              onClick={() => setShowHypeModal(true)}
            >
              🎬 Check Hype
            </button>
            <button className="btn btn-create" onClick={onGenerateBadge}>
              🪪 Create ID Card
            </button>
          </div>
        </main>

        {/* Footer info line */}
        <footer className="footer-line">
          <span>Official Event Portal · hhgoa.com</span>
          <span>Powered by 2:47pm Studio</span>
        </footer>
      </div>

      {/* Prehype Video Modal */}
      {showHypeModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowHypeModal(false)}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setShowHypeModal(false)}
              aria-label="Close modal"
            >
              ✕
            </button>
            <video controls autoPlay src={prehypeVideo}>
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
}
