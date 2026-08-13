import { useState } from "react"
import HHGoaLanding from "./components/HHGoaLanding"
import BadgeGeneratorPage from "./components/BadgeGeneratorPage"
import "./App.css"

function App() {
  const [view, setView] = useState("landing")

  return view === "landing" ? (
    <HHGoaLanding onGenerateBadge={() => setView("generator")} />
  ) : (
    <BadgeGeneratorPage onBack={() => setView("landing")} />
  )
}

export default App

