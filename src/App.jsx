import { useState, useEffect } from "react"
import HHGoaLanding from "./components/HHGoaLanding"
import StudentForm from "./components/StudentForm"
import IdCardPreview from "./components/IdCardPreview"
import StoredCards from "./components/StoredCards"
import "./App.css"

function BadgeGenerator({ onBack }) {
  const [studentData, setStudentData] = useState(null)
  const [template, setTemplate] = useState("hhgoa")
  const [storedCards, setStoredCards] = useState([])
  const [showStoredCards, setShowStoredCards] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("studentCards")
    if (stored) {
      setStoredCards(JSON.parse(stored))
    }
  }, [])

  const handleFormSubmit = (data) => {
    const isEditing = studentData && studentData.id
    const newStudentData = {
      ...data,
      id: isEditing ? studentData.id : Date.now().toString(),
      createdAt: isEditing ? studentData.createdAt : new Date().toISOString(),
    }
    setStudentData(newStudentData)
    let updatedCards
    if (isEditing) {
      updatedCards = storedCards.map((card) =>
        card.id === studentData.id ? newStudentData : card
      )
    } else {
      updatedCards = [newStudentData, ...storedCards]
    }
    setStoredCards(updatedCards)
    try {
      localStorage.setItem("studentCards", JSON.stringify(updatedCards))
    } catch (error) {
      console.warn("Could not save to history. localStorage quota exceeded:", error)
    }
  }

  const handleTemplateChange = (newTemplate) => setTemplate(newTemplate)
  const handleViewStoredCards = () => setShowStoredCards(!showStoredCards)

  const handleLoadCard = (card) => {
    setStudentData(card)
    setShowStoredCards(false)
  }

  const handleDeleteCard = (id) => {
    const updatedCards = storedCards.filter((card) => card.id !== id)
    setStoredCards(updatedCards)
    localStorage.setItem("studentCards", JSON.stringify(updatedCards))
    if (studentData && studentData.id === id) setStudentData(null)
  }

  return (
    <div className="container">
      <button onClick={onBack} className="back-to-landing-btn">
        ← Back to Landing
      </button>
      <h1 className="main-title">Hacker House Goa 2026 Badge Generator</h1>
      <div className="app-layout">
        <div className="form-section">
          <StudentForm onSubmit={handleFormSubmit} initialData={studentData} />
          <div className="stored-cards-section">
            <button onClick={handleViewStoredCards} className="view-cards-btn">
              {showStoredCards ? "Hide Saved Badges" : "View Saved Badges"}
            </button>
            {showStoredCards && (
              <StoredCards
                cards={storedCards}
                onLoadCard={handleLoadCard}
                onDeleteCard={handleDeleteCard}
              />
            )}
          </div>
        </div>
        <div className="preview-section">
          {studentData ? (
            <>
              <div className="preview-header">
                <h2>Badge Preview</h2>
                <div className="template-selector">
                  <span>Template:</span>
                  <select
                    value={template}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                  >
                    <option value="hhgoa">Hacker House Goa 2026</option>
                    <option value="template1">Standard Template 1</option>
                    <option value="template2">Standard Template 2</option>
                  </select>
                </div>
              </div>
              <IdCardPreview studentData={studentData} template={template} />
            </>
          ) : (
            <div className="empty-preview">
              <p>Fill out the form and submit to generate your Builder Badge preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function App() {
  const [view, setView] = useState("landing")

  return view === "landing" ? (
    <HHGoaLanding onGenerateBadge={() => setView("generator")} />
  ) : (
    <BadgeGenerator onBack={() => setView("landing")} />
  )
}

export default App
