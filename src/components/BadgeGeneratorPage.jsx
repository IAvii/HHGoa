/*
  THESIS: Terminal boarding-pass aesthetic; the form is a field-manifest, the preview is the issued pass.
  OWN-WORLD: #0B6839 ground, #FEE101 accent, Victor Mono, dot-grid, flat zero-gradient surfaces.
  FIRST VIEWPORT: Two-column — left: dark form panel, right: live badge preview. Full-height, no scroll.
  FORM: Extension of HHGoaLanding visual world. Code-led build.
  FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
*/
import React, { useState, useEffect, useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import hackerHouseLogo from "../assets/Hacker house.png";
import logoSvg from "../assets/2-47.svg";
import frameImage from "../assets/Frame 6.png";
import HhGoaTemplate from "./HhGoaTemplate";

/* ─── styles ─────────────────────────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Imbue:opsz,wght@10..100,400;10..100,700&family=Victor+Mono:wght@400;600;700&display=swap');

.bg-page * { box-sizing: border-box; margin: 0; padding: 0; }

.bg-page {
  --green:    #0B6839;
  --green-dk: #073d20;
  --green-lt: #0e7a42;
  --yellow:   #FEE101;
  --white:    #FFFFFF;
  --muted:    rgba(255,255,255,0.55);
  --mono:     'Victor Mono', 'Courier New', monospace;
  --serif:    'Imbue', Georgia, serif;
  --error:    #ff5c5c;

  font-family: var(--mono);
  background: var(--green);
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  color: var(--white);
}

/* dot grid */
.bg-page::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, rgba(0,30,15,0.75) 1.5px, transparent 1.5px);
  background-size: 20px 20px;
  opacity: 0.45;
}

/* ── nav ── */
.bg-nav {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 48px;
  border-bottom: 1px solid rgba(254,225,1,0.18);
  flex-shrink: 0;
}

.bg-nav-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.bg-back-btn {
  background: none;
  border: 1.5px solid rgba(254,225,1,0.4);
  color: var(--yellow);
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 7px 16px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.bg-back-btn:hover {
  border-color: var(--yellow);
  background: rgba(254,225,1,0.08);
}

.bg-nav-logo {
  height: 44px;
  object-fit: contain;
  opacity: 0.9;
}

.bg-nav-title {
  font-family: var(--serif);
  font-size: 15px;
  font-weight: 400;
  color: var(--white);
  letter-spacing: 0.02em;
  opacity: 0.75;
}

.bg-nav-studio {
  height: 40px;
  object-fit: contain;
  opacity: 0.7;
}

/* ── two-col layout ── */
.bg-body {
  position: relative;
  z-index: 2;
  flex: 1;
  display: grid;
  grid-template-columns: 420px 1fr;
  overflow: hidden;
}

/* ── left panel: form ── */
.bg-form-panel {
  background: var(--green-dk);
  border-right: 1px solid rgba(254,225,1,0.14);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 32px 36px 28px;
  scrollbar-width: thin;
  scrollbar-color: rgba(254,225,1,0.25) transparent;
}

.bg-form-eyebrow {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--yellow);
  margin-bottom: 6px;
}

.bg-form-heading {
  font-family: var(--serif);
  font-size: 22px;
  font-weight: 700;
  color: var(--white);
  margin-bottom: 28px;
  line-height: 1.15;
}

/* field groups */
.bg-field {
  margin-bottom: 20px;
}

.bg-label {
  display: block;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--yellow);
  margin-bottom: 8px;
}

.bg-input,
.bg-select {
  width: 100%;
  background: rgba(255,255,255,0.05);
  border: 1.5px solid rgba(254,225,1,0.22);
  color: var(--white);
  font-family: var(--mono);
  font-size: 13px;
  font-weight: 600;
  padding: 10px 14px;
  outline: none;
  transition: border-color 0.15s, background 0.15s;
  border-radius: 0;
  -webkit-appearance: none;
  appearance: none;
}

.bg-input::placeholder { color: rgba(255,255,255,0.3); font-weight: 400; }
.bg-input:focus,
.bg-select:focus {
  border-color: var(--yellow);
  background: rgba(254,225,1,0.06);
}
.bg-input.has-error,
.bg-select.has-error { border-color: var(--error); }

/* select wrapper with arrow */
.bg-select-wrap {
  position: relative;
}
.bg-select-wrap::after {
  content: '▾';
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--yellow);
  font-size: 12px;
  pointer-events: none;
}
.bg-select option {
  background: #073d20;
  color: var(--white);
}

.bg-error-msg {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--error);
  margin-top: 5px;
  text-transform: uppercase;
}

/* photo upload */
.bg-upload-zone {
  border: 1.5px dashed rgba(254,225,1,0.3);
  background: rgba(255,255,255,0.03);
  padding: 18px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  position: relative;
}
.bg-upload-zone:hover { border-color: var(--yellow); background: rgba(254,225,1,0.05); }
.bg-upload-zone input[type="file"] {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
}
.bg-upload-text {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.45);
}
.bg-upload-zone.has-photo { border-color: rgba(254,225,1,0.5); }

/* photo preview + sliders */
.bg-photo-row {
  display: flex;
  gap: 14px;
  margin-top: 12px;
  align-items: flex-start;
}

.bg-crop-box {
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  overflow: hidden;
  border: 1.5px solid rgba(254,225,1,0.35);
  background: #052e16;
}
.bg-crop-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bg-sliders {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bg-slider-row {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.bg-slider-label {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}

.bg-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 3px;
  background: rgba(254,225,1,0.25);
  outline: none;
  cursor: pointer;
  border-radius: 0;
}
.bg-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background: var(--yellow);
  cursor: pointer;
  border-radius: 0;
}
.bg-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: var(--yellow);
  cursor: pointer;
  border-radius: 0;
  border: none;
}

/* saved badges toggle */
.bg-saved-toggle {
  background: none;
  border: none;
  color: var(--muted);
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  padding: 0;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.15s;
}
.bg-saved-toggle:hover { color: var(--yellow); }

/* saved card list */
.bg-saved-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}
.bg-saved-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgba(254,225,1,0.15);
  background: rgba(255,255,255,0.03);
  padding: 8px 12px;
}
.bg-saved-card-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--white);
  letter-spacing: 0.04em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
}
.bg-saved-card-domain {
  font-size: 9px;
  color: var(--muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.bg-saved-card-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}
.bg-saved-load-btn,
.bg-saved-del-btn {
  background: none;
  border: 1px solid rgba(254,225,1,0.25);
  color: var(--yellow);
  font-family: var(--mono);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 4px 8px;
  cursor: pointer;
  transition: background 0.12s, border-color 0.12s;
}
.bg-saved-load-btn:hover { background: rgba(254,225,1,0.1); border-color: var(--yellow); }
.bg-saved-del-btn { border-color: rgba(255,92,92,0.3); color: #ff5c5c; }
.bg-saved-del-btn:hover { background: rgba(255,92,92,0.08); border-color: #ff5c5c; }

/* divider */
.bg-divider {
  border: none;
  border-top: 1px solid rgba(254,225,1,0.1);
  margin: 20px 0;
}

/* submit */
.bg-submit-btn {
  width: 100%;
  background: var(--yellow);
  border: none;
  color: #063017;
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 14px 24px;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
  margin-top: auto;
  padding-top: 16px;
}
.bg-submit-btn:hover { opacity: 0.9; }
.bg-submit-btn:active { transform: scale(0.99); }
.bg-submit-btn:disabled { opacity: 0.45; cursor: not-allowed; }

/* ── right panel: preview ── */
.bg-preview-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 36px 48px;
  position: relative;
  overflow: hidden;
  gap: 24px;
}

.bg-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  opacity: 0.5;
}

.bg-empty-icon {
  width: 64px;
  height: 64px;
  border: 2px dashed rgba(254,225,1,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-empty-text {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
  text-align: center;
  max-width: 220px;
  line-height: 1.6;
}

/* badge card render area */
.bg-badge-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.bg-badge-label {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(254,225,1,0.5);
}

.bg-card-container {
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  width: 320px;
}

/* action buttons */
.bg-badge-actions {
  display: flex;
  gap: 12px;
}

.bg-download-btn {
  background: var(--yellow);
  border: none;
  color: #063017;
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 11px 22px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: opacity 0.15s;
}
.bg-download-btn:hover { opacity: 0.88; }

.bg-share-btn {
  background: transparent;
  border: 1.5px solid rgba(254,225,1,0.4);
  color: var(--yellow);
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 11px 22px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: border-color 0.15s, background 0.15s;
}
.bg-share-btn:hover { border-color: var(--yellow); background: rgba(254,225,1,0.06); }

.bg-share-tip {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  text-align: center;
}

/* scrollbar */
.bg-form-panel::-webkit-scrollbar { width: 4px; }
.bg-form-panel::-webkit-scrollbar-track { background: transparent; }
.bg-form-panel::-webkit-scrollbar-thumb { background: rgba(254,225,1,0.2); border-radius: 0; }

/* ── responsive ── */
@media (max-width: 850px) {
  .bg-page {
    height: auto;
    min-height: 100dvh;
    overflow-y: auto;
  }
  .bg-body {
    display: flex;
    flex-direction: column;
    overflow: visible;
  }
  .bg-form-panel {
    border-right: none;
    border-bottom: 1px solid rgba(254,225,1,0.14);
    overflow: visible;
    padding: 24px 20px;
  }
  .bg-preview-panel {
    padding: 32px 20px 60px;
  }
  .bg-nav {
    padding: 16px 20px;
  }
  .bg-nav-logo {
    height: 32px;
  }
  .bg-nav-title {
    font-size: 13px;
  }
  .bg-nav-studio {
    display: none;
  }
  .bg-card-container {
    width: 100%;
    max-width: 320px;
  }
  .bg-badge-actions {
    flex-wrap: wrap;
    justify-content: center;
  }
}
`;

/* ─── helpers ─────────────────────────────────────────────────────────────── */
const shrinkToFit = (el) => {
  if (!el) return;
  el.style.fontSize = "";
  el.style.overflow = "visible";
  el.style.textOverflow = "clip";
  el.style.width = "auto";
  const parentWidth = el.parentElement?.clientWidth;
  if (!parentWidth || parentWidth <= 0) { el.style.overflow = ""; el.style.textOverflow = ""; el.style.width = ""; return; }
  let sizePx = parseFloat(window.getComputedStyle(el).fontSize);
  const minSizePx = sizePx * 0.35;
  while (el.scrollWidth > parentWidth * 0.96 && sizePx > minSizePx) { sizePx -= 0.5; el.style.fontSize = `${sizePx}px`; }
  el.style.overflow = ""; el.style.textOverflow = ""; el.style.width = "";
};

const DOMAINS = ["Frontend Dev","Backend Dev","Fullstack Dev","Web3 / Blockchain","AI / ML Eng","Mobile Dev","Product Design","DevOps / Cloud","Other"];



/* ─── main component ──────────────────────────────────────────────────────── */
export default function BadgeGeneratorPage({ onBack }) {
  const [formData, setFormData] = useState({ name: "", domain: "", photoPreview: null, photoZoom: 1, photoPanX: 0, photoPanY: 0, builderId: "" });
  const [errors, setErrors]   = useState({});
  const [isCustomDomain, setIsCustomDomain] = useState(false);
  const [customDomain, setCustomDomain]     = useState("");
  const [isGenerating, setIsGenerating]     = useState(false);
  const [studentData, setStudentData]       = useState(null);
  const [storedCards, setStoredCards]       = useState([]);
  const [showSaved, setShowSaved]           = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    if (studentData && cardRef.current) {
      let isMounted = true;
      setDownloadUrl(null);
      const timer = setTimeout(() => {
        toPng(cardRef.current, { pixelRatio: 1.5, cacheBust: false })
          .then((url) => { if (isMounted) setDownloadUrl(url); })
          .catch((err) => console.error("Background PNG generation failed:", err));
      }, 300);
      return () => { isMounted = false; clearTimeout(timer); };
    } else {
      setDownloadUrl(null);
    }
  }, [studentData]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("studentCards");
      if (raw) setStoredCards(JSON.parse(raw));
    } catch {}
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(ev => ({ ...ev, [name]: null }));
  };

  const handleDomain = (e) => {
    const v = e.target.value;
    if (v === "Other") { setIsCustomDomain(true); setFormData(f => ({ ...f, domain: customDomain })); }
    else { setIsCustomDomain(false); setFormData(f => ({ ...f, domain: v })); }
    if (errors.domain) setErrors(ev => ({ ...ev, domain: null }));
  };

  const handleCustomDomain = (e) => {
    const v = e.target.value;
    setCustomDomain(v);
    setFormData(f => ({ ...f, domain: v }));
    if (errors.domain) setErrors(ev => ({ ...ev, domain: null }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setFormData(f => ({ ...f, photoPreview: reader.result, photoZoom: 1, photoPanX: 0, photoPanY: 0 }));
    reader.readAsDataURL(file);
    if (errors.photo) setErrors(ev => ({ ...ev, photo: null }));
  };

  const handleSlider = (e) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: parseFloat(value) }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.domain.trim()) errs.domain = "Domain / Role required";
    if (!formData.photoPreview) errs.photo = "Photo is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsGenerating(true);
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const generatedId = formData.builderId || `HHGOA-${randomNum}`;
    const data = { ...formData, builderId: generatedId, id: Date.now().toString(), createdAt: new Date().toISOString() };
    setStudentData(data);
    const updated = [data, ...storedCards];
    setStoredCards(updated);
    try { localStorage.setItem("studentCards", JSON.stringify(updated)); } catch {}
    setIsGenerating(false);
  };

  const handleDownload = async () => {
    if (!studentData) return;
    setIsDownloading(true);

    try {
      let finalUrl = downloadUrl;
      
      if (!finalUrl && cardRef.current) {
        finalUrl = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: false });
      }

      if (finalUrl) {
        const link = document.createElement("a");
        link.download = `${(studentData.name || "badge").replace(/\s+/g, "-")}-HH-Goa-Badge.png`;
        link.href = finalUrl;
        link.click();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    const text = `Just generated my Hacker House Goa 2026 builder badge! 🚀 #FrameInGoa`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  const loadCard = (card) => {
    setFormData({ name: card.name, domain: card.domain, photoPreview: card.photoPreview, photoZoom: card.photoZoom || 1, photoPanX: card.photoPanX || 0, photoPanY: card.photoPanY || 0, builderId: card.builderId });
    setStudentData(card);
    setShowSaved(false);
    const isDom = DOMAINS.includes(card.domain);
    setIsCustomDomain(!isDom && card.domain !== "");
    setCustomDomain(!isDom ? card.domain : "");
  };

  const deleteCard = (id) => {
    const updated = storedCards.filter(c => c.id !== id);
    setStoredCards(updated);
    try { localStorage.setItem("studentCards", JSON.stringify(updated)); } catch {}
    if (studentData?.id === id) setStudentData(null);
  };

  const selectValue = isCustomDomain ? "Other" : (DOMAINS.includes(formData.domain) ? formData.domain : (formData.domain ? "Other" : ""));

  return (
    <div className="bg-page">
      <style>{css}</style>

      {/* ── nav ── */}
      <nav className="bg-nav">
        <div className="bg-nav-left">
          <button className="bg-back-btn" onClick={onBack}>← Back</button>
          <img src={hackerHouseLogo} alt="Hacker House Goa" className="bg-nav-logo" />
          <span className="bg-nav-title">ID Card Generator</span>
        </div>
        <img src={logoSvg} alt="2:47pm Studio" className="bg-nav-studio" />
      </nav>

      {/* ── body ── */}
      <div className="bg-body">

        {/* ── left: form ── */}
        <div className="bg-form-panel">
          <p className="bg-form-eyebrow">Builder Manifest</p>
          <h1 className="bg-form-heading">Create Your<br />HH Goa Badge</h1>

          <form onSubmit={handleSubmit}>
            {/* name */}
            <div className="bg-field">
              <label className="bg-label">Full Name</label>
              <input className={`bg-input${errors.name ? " has-error" : ""}`} type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter builder name" autoComplete="off" />
              {errors.name && <p className="bg-error-msg">{errors.name}</p>}
            </div>

            {/* domain */}
            <div className="bg-field">
              <label className="bg-label">Domain / Role</label>
              <div className="bg-select-wrap">
                <select className={`bg-select${errors.domain ? " has-error" : ""}`} value={selectValue} onChange={handleDomain}>
                  <option value="">Select Domain</option>
                  {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              {isCustomDomain && (
                <input className={`bg-input${errors.domain ? " has-error" : ""}`} type="text" value={customDomain} onChange={handleCustomDomain} placeholder="e.g. Solidity Wizard" style={{ marginTop: 8 }} />
              )}
              {errors.domain && <p className="bg-error-msg">{errors.domain}</p>}
            </div>

            {/* photo */}
            <div className="bg-field">
              <label className="bg-label">Photo Upload</label>
              <div className={`bg-upload-zone${formData.photoPreview ? " has-photo" : ""}${errors.photo ? " has-error" : ""}`}>
                <input type="file" accept="image/*" onChange={handlePhoto} />
                <p className="bg-upload-text">
                  {formData.photoPreview ? "✓ Photo loaded — drop another to replace" : "Click or drag to upload your photo"}
                </p>
              </div>
              {errors.photo && <p className="bg-error-msg">{errors.photo}</p>}

              {formData.photoPreview && (
                <div className="bg-photo-row">
                  <div className="bg-crop-box">
                    <img src={formData.photoPreview} alt="preview" style={{ transform: `scale(${formData.photoZoom}) translate(${formData.photoPanX}%,${formData.photoPanY}%)` }} />
                  </div>
                  <div className="bg-sliders">
                    <div className="bg-slider-row">
                      <span className="bg-slider-label">Zoom: {formData.photoZoom.toFixed(2)}×</span>
                      <input className="bg-slider" type="range" name="photoZoom" min="1" max="3" step="0.05" value={formData.photoZoom} onChange={handleSlider} />
                    </div>
                    <div className="bg-slider-row">
                      <span className="bg-slider-label">Horizontal: {formData.photoPanX}%</span>
                      <input className="bg-slider" type="range" name="photoPanX" min="-50" max="50" step="1" value={formData.photoPanX} onChange={handleSlider} />
                    </div>
                    <div className="bg-slider-row">
                      <span className="bg-slider-label">Vertical: {formData.photoPanY}%</span>
                      <input className="bg-slider" type="range" name="photoPanY" min="-50" max="50" step="1" value={formData.photoPanY} onChange={handleSlider} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <hr className="bg-divider" />

            {/* saved badges */}
            {storedCards.length > 0 && (
              <>
                <button type="button" className="bg-saved-toggle" onClick={() => setShowSaved(s => !s)}>
                  {showSaved ? "▾" : "▸"} Saved Badges ({storedCards.length})
                </button>
                {showSaved && (
                  <div className="bg-saved-list">
                    {storedCards.map(c => (
                      <div key={c.id} className="bg-saved-card">
                        <div>
                          <p className="bg-saved-card-name">{c.name}</p>
                          <p className="bg-saved-card-domain">{c.domain}</p>
                        </div>
                        <div className="bg-saved-card-actions">
                          <button type="button" className="bg-saved-load-btn" onClick={() => loadCard(c)}>Load</button>
                          <button type="button" className="bg-saved-del-btn" onClick={() => deleteCard(c.id)}>✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <hr className="bg-divider" />
              </>
            )}

            <button type="submit" className="bg-submit-btn" disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate Badge →"}
            </button>
          </form>
        </div>

        {/* ── right: preview ── */}
        <div className="bg-preview-panel">
          {!studentData ? (
            <div className="bg-empty-state">
              <div className="bg-empty-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(254,225,1,0.5)" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="1"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <p className="bg-empty-text">Fill out the manifest and generate your<br />builder badge</p>
            </div>
          ) : (
            <div className="bg-badge-wrap">
              <p className="bg-badge-label">Badge Preview</p>
              <div ref={cardRef} className="bg-card-container">
                <HhGoaTemplate studentData={studentData} />
              </div>
              <div className="bg-badge-actions">
                <button className="bg-download-btn" onClick={handleDownload} disabled={isDownloading}>
                  {isDownloading ? (
                    "Preparing..."
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Download Badge
                    </>
                  )}
                </button>
                <button className="bg-share-btn" onClick={handleShare}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Share on X
                </button>
              </div>
              <p className="bg-share-tip">Tip — download your badge first, then upload it to your X post</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
