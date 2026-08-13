import { useState, useEffect } from "react";
import "../styles/StudentForm.css";

const StudentForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    photo: null,
    photoPreview: null,
    photoZoom: 1,
    photoPanX: 0,
    photoPanY: 0,
    builderId: "",
  });

  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [customDomain, setCustomDomain] = useState("");
  const [isCustomDomain, setIsCustomDomain] = useState(false);

  const domainOptions = [
    "Frontend Dev",
    "Backend Dev",
    "Fullstack Dev",
    "Web3 / Blockchain",
    "AI / ML Eng",
    "Mobile Dev",
    "Product Design",
    "DevOps / Cloud",
    "Other",
  ];

  // If initialData (loaded card) changes, populate form
  useEffect(() => {
    if (initialData) {
      const isCustom = !domainOptions.includes(initialData.domain) && initialData.domain !== "";
      setFormData({
        name: initialData.name || "",
        domain: initialData.domain || "",
        photo: initialData.photo || null,
        photoPreview: initialData.photoPreview || null,
        photoZoom: initialData.photoZoom || 1,
        photoPanX: initialData.photoPanX || 0,
        photoPanY: initialData.photoPanY || 0,
        builderId: initialData.builderId || "",
      });
      if (isCustom) {
        setIsCustomDomain(true);
        setCustomDomain(initialData.domain);
      } else {
        setIsCustomDomain(false);
        setCustomDomain("");
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleDomainChange = (e) => {
    const value = e.target.value;
    if (value === "Other") {
      setIsCustomDomain(true);
      setFormData({ ...formData, domain: customDomain });
    } else {
      setIsCustomDomain(false);
      setFormData({ ...formData, domain: value });
    }
    if (errors.domain) setErrors({ ...errors, domain: null });
  };

  const handleCustomDomainChange = (e) => {
    const value = e.target.value;
    setCustomDomain(value);
    setFormData({ ...formData, domain: value });
    if (errors.domain) setErrors({ ...errors, domain: null });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ 
          ...formData, 
          photo: file, 
          photoPreview: reader.result,
          photoZoom: 1,
          photoPanX: 0,
          photoPanY: 0
        });
      };
      reader.readAsDataURL(file);
      if (errors.photo) setErrors({ ...errors, photo: null });
    }
  };

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.domain.trim()) newErrors.domain = "Domain / Role is required";
    if (!formData.photoPreview) newErrors.photo = "Photo is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsGenerating(true);
    
    // Generate randomized unique 5-digit number for Builder ID
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const generatedId = formData.builderId || `HHGOA-${randomNum}`;

    setTimeout(() => {
      try {
        onSubmit({
          ...formData,
          builderId: generatedId,
        });
      } catch (error) {
        console.error("Error generating badge:", error);
      } finally {
        setIsGenerating(false);
      }
    }, 1200);
  };

  const selectedSelectValue = isCustomDomain 
    ? "Other" 
    : (domainOptions.includes(formData.domain) ? formData.domain : (formData.domain ? "Other" : ""));

  return (
    <form onSubmit={handleSubmit} className="student-form">
      <h2>Builder Details</h2>

      {/* Name Input */}
      <div className="form-group">
        <label>Name</label>
        <input 
          type="text" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          placeholder="Enter builder name"
          className={errors.name ? "error" : ""} 
        />
        {errors.name && <p className="error-message">{errors.name}</p>}
      </div>

      {/* Domain Selection */}
      <div className="form-group">
        <label>Domain / Role</label>
        <select 
          value={selectedSelectValue} 
          onChange={handleDomainChange} 
          className={errors.domain ? "error" : ""}
        >
          <option value="">Select Domain</option>
          {domainOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        {isCustomDomain && (
          <input
            type="text"
            value={customDomain}
            onChange={handleCustomDomainChange}
            placeholder="Type your custom domain (e.g. Solidity Wizard)"
            className={`custom-domain-input ${errors.domain ? "error" : ""}`}
            style={{ marginTop: "10px" }}
          />
        )}
        {errors.domain && <p className="error-message">{errors.domain}</p>}
      </div>

      {/* Photo Upload */}
      <div className="form-group">
        <label>Photo Upload</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handlePhotoChange} 
          className={errors.photo ? "error" : ""} 
        />
        {errors.photo && <p className="error-message">{errors.photo}</p>}

        {formData.photoPreview && (
          <div className="photo-adjustment-container">
            <div className="photo-form-preview">
              <div className="preview-crop-box">
                <img 
                  src={formData.photoPreview} 
                  alt="Preview crop alignment" 
                  style={{
                    transform: `scale(${formData.photoZoom}) translate(${formData.photoPanX}%, ${formData.photoPanY}%)`,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              </div>
            </div>

            {/* Manual Crop Alignment Controls */}
            <div className="adjustment-sliders">
              <p className="slider-section-title">Adjust Photo Fit:</p>
              
              <div className="slider-group">
                <label>Zoom: {formData.photoZoom.toFixed(2)}x</label>
                <input 
                  type="range" 
                  name="photoZoom" 
                  min="1" 
                  max="3" 
                  step="0.05" 
                  value={formData.photoZoom} 
                  onChange={handleSliderChange} 
                />
              </div>

              <div className="slider-group">
                <label>Move Horizontally: {formData.photoPanX}%</label>
                <input 
                  type="range" 
                  name="photoPanX" 
                  min="-50" 
                  max="50" 
                  step="1" 
                  value={formData.photoPanX} 
                  onChange={handleSliderChange} 
                />
              </div>

              <div className="slider-group">
                <label>Move Vertically: {formData.photoPanY}%</label>
                <input 
                  type="range" 
                  name="photoPanY" 
                  min="-50" 
                  max="50" 
                  step="1" 
                  value={formData.photoPanY} 
                  onChange={handleSliderChange} 
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <button type="submit" className="submit-btn" disabled={isGenerating}>
        {isGenerating ? "Generating Badge..." : "Generate Builder Badge"}
      </button>
    </form>
  );
};

export default StudentForm;
