import { useRef } from "react";
import { toPng } from "html-to-image";
import Template1 from "./Template1";
import Template2 from "./Template2";
import HhGoaTemplate from "./HhGoaTemplate";
import "../styles/IdCardPreview.css";

const IdCardPreview = ({ studentData, template }) => {
  const cardRef = useRef(null);

  const handleDownload = async () => {
    if (cardRef.current) {
      try {
        // High quality scale option for crisp results
        const dataUrl = await toPng(cardRef.current, { 
          quality: 0.98,
          pixelRatio: 2 // double resolution for crystal clear image downloads
        });

        const link = document.createElement("a");
        link.download = `${studentData.name.replace(/\s+/g, "-")}-HH-Goa-Badge.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error("Error generating image:", error);
      }
    }
  };

  const handleShareToX = () => {
    const text = `Just generated my Hacker House Goa 2026 builder badge! 🚀 #FrameInGoa`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const qrCodeData = JSON.stringify({
    name: studentData.name,
    domain: studentData.domain,
    builderId: studentData.builderId,
  });

  return (
    <div className="id-card-preview">
      <div ref={cardRef} className="card-container">
        {template === "hhgoa" ? (
          <HhGoaTemplate studentData={studentData} />
        ) : template === "template1" ? (
          <Template1 studentData={studentData} qrCodeData={qrCodeData} />
        ) : (
          <Template2 studentData={studentData} qrCodeData={qrCodeData} />
        )}
      </div>

      <div className="preview-actions">
        <button onClick={handleDownload} className="download-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download Badge
        </button>

        <button onClick={handleShareToX} className="share-x-btn">
          {/* Twitter / X SVG Logo */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Share on X
        </button>
      </div>

      <p className="share-tip">💡 Tip: Download your badge first, then upload it to your post on X!</p>
    </div>
  );
};

export default IdCardPreview;
