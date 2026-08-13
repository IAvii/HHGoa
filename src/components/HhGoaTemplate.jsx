import { useEffect, useRef, useCallback } from "react";
import frameImage from "../assets/Frame 6.png";
import "../styles/HhGoaTemplate.css";

// Reusable helper: shrink element font-size until it fits within its parent
const shrinkToFit = (el) => {
  if (!el) return;

  // Reset inline font-size so we read the current CSS default
  el.style.fontSize = "";

  // Temporarily lift overflow constraints to measure true text width
  el.style.overflow = "visible";
  el.style.textOverflow = "clip";
  el.style.width = "auto";

  const parentWidth = el.parentElement?.clientWidth;
  if (!parentWidth || parentWidth <= 0) {
    el.style.overflow = "";
    el.style.textOverflow = "";
    el.style.width = "";
    return;
  }

  // Read CSS default font-size in px
  let sizePx = parseFloat(window.getComputedStyle(el).fontSize);
  const minSizePx = sizePx * 0.35; // Allow shrink down to 35% of default

  // Decrement until it fits
  while (el.scrollWidth > parentWidth * 0.96 && sizePx > minSizePx) {
    sizePx -= 0.5;
    el.style.fontSize = `${sizePx}px`;
  }

  // Restore overflow constraints
  el.style.overflow = "";
  el.style.textOverflow = "";
  el.style.width = "";
};

const HhGoaTemplate = ({ studentData }) => {
  const containerRef = useRef(null);
  const nameRef = useRef(null);
  const domainRef = useRef(null);
  const builderIdRef = useRef(null);

  // Run shrink on all text elements
  const runAllShrinks = useCallback(() => {
    shrinkToFit(nameRef.current);
    shrinkToFit(domainRef.current);
    shrinkToFit(builderIdRef.current);
  }, []);

  // Re-run shrink whenever the card container resizes (covers mobile/tablet/desktop)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      runAllShrinks();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [runAllShrinks]);

  // Also re-run shrink when text content changes
  useEffect(() => {
    runAllShrinks();
  }, [studentData.name, studentData.domain, studentData.builderId, runAllShrinks]);

  // Handle positioning styles for the uploaded photo (pan/zoom)
  const photoStyle = {
    transform: `scale(${studentData.photoZoom || 1}) translate(${studentData.photoPanX || 0}%, ${studentData.photoPanY || 0}%)`,
  };

  return (
    <div className="hh-goa-template" ref={containerRef}>
      {/* Background ID Frame */}
      <img src={frameImage} alt="Hacker House Goa 2026 Template" className="background-frame-img" />

      {/* Profile Photo Area */}
      <div className="hh-photo-frame">
        {studentData.photoPreview ? (
          <div className="photo-wrapper">
            <img
              src={studentData.photoPreview}
              alt={studentData.name}
              style={photoStyle}
              className="builder-photo"
            />
          </div>
        ) : (
          <div className="photo-placeholder">Photo</div>
        )}
      </div>

      {/* Name Input Box Area */}
      <div className="hh-name-box">
        <div ref={nameRef} className="hh-name-text">
          {studentData.name || "YOUR NAME"}
        </div>
      </div>

      {/* Domain Input Box Area */}
      <div className="hh-domain-box">
        <div ref={domainRef} className="hh-domain-text">
          {studentData.domain || "DOMAIN / ROLE"}
        </div>
      </div>

      {/* Builder ID / Barcode ID Box Area */}
      <div className="hh-builder-id-box">
        <div ref={builderIdRef} className="hh-builder-id-text">
          {studentData.builderId || "HHGOA-00000"}
        </div>
      </div>
    </div>
  );
};

export default HhGoaTemplate;
