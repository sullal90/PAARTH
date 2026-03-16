import { useEffect, useState } from "react"
import "./App.css"
import { startListening } from "./hooks/useSpeechRecognition"
import { getVerse, analyzeRecitation } from "./services/api"

type Stage =
  | "greeting"
  | "language"
  | "chooseMode"
  | "chooseVerse"
  | "practice"

export default function App() {
  const [stage, setStage] = useState<Stage>("greeting")

  const [language, setLanguage] = useState("English")

  const [chapter, setChapter] = useState(4)
  const [verse, setVerse] = useState(7)

  const [verseData, setVerseData] = useState<any>(null)

  const [guruText, setGuruText] = useState(
    "Namaste Paarth. I am your recitation guide."
  )

  const [heardText, setHeardText] = useState("")
  const [score, setScore] = useState<number | null>(null)

  const [reciting, setReciting] = useState(false)
  const [guruSpeaking, setGuruSpeaking] = useState(false)

  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices()
      console.log(
        "Voices loaded:",
        voices.map((v) => `${v.name} (${v.lang})`)
      )
    }

    loadVoices()
    speechSynthesis.onvoiceschanged = loadVoices

    return () => {
      speechSynthesis.onvoiceschanged = null
    }
  }, [])

  function pickVoice(selectedLanguage: string) {
    const voices = speechSynthesis.getVoices()

    if (selectedLanguage === "English") {
      return (
        voices.find((v) => v.name.toLowerCase().includes("rishi")) ||
        voices.find((v) => v.name.includes("Google UK English Male")) ||
        voices.find((v) => v.name.includes("Google US English")) ||
        voices.find((v) => v.lang === "en-IN") ||
        voices.find((v) => v.lang === "en-US") ||
        voices.find((v) => v.lang.startsWith("en")) ||
        voices[0]
      )
    }

    if (selectedLanguage === "Hindi") {
      return (
        voices.find((v) => v.lang === "hi-IN") ||
        voices.find((v) => v.name.toLowerCase().includes("hindi")) ||
        voices[0]
      )
    }

    if (selectedLanguage === "Kannada") {
      return (
        voices.find((v) => v.lang === "kn-IN") ||
        voices.find((v) => v.name.toLowerCase().includes("kannada")) ||
        voices[0]
      )
    }

    return voices[0]
  }

  function cleanSpeech(text: string) {
    if (!text) return ""

    return text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .replace(/[{}[\]"]/g, "")
      .replace(/\bspoken\s*:/gi, "")
      .replace(/\bsubtitle\s*:/gi, "")
      .replace(/\bmeaning\s*:/gi, "")
      .replace(/\bscore\s*:\s*\d+/gi, "")
      .replace(/\s+/g, " ")
      .trim()
  }

  function speak(text: string, selectedLanguage: string) {
    const cleaned = cleanSpeech(text)

    if (!cleaned || cleaned.length < 3) {
      console.log("Skipping speech:", text)
      return
    }

    speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(cleaned)
    const voice = pickVoice(selectedLanguage)

    console.log("Speaking:", cleaned)
    console.log("Selected voice:", voice?.name, voice?.lang)

    if (voice) {
      utterance.voice = voice
      utterance.lang = voice.lang
    } else {
      utterance.lang =
        selectedLanguage === "Hindi"
          ? "hi-IN"
          : selectedLanguage === "Kannada"
          ? "kn-IN"
          : "en-IN"
    }

    utterance.volume = 1
    utterance.rate = 0.95
    utterance.pitch = 1

    utterance.onstart = () => {
      console.log("Speech started")
      setGuruSpeaking(true)
    }

    utterance.onend = () => {
      console.log("Speech ended")
      setGuruSpeaking(false)
    }

    utterance.onerror = (e) => {
      console.log("Speech error:", e)
      setGuruSpeaking(false)
    }

    speechSynthesis.speak(utterance)
  }

  async function fetchVerse(c: number, v: number) {
    const data = await getVerse(c, v)

    setVerseData({
      sanskrit: data.sanskrit ?? data.slok,
      transliteration: data.transliteration,
      translation: data.translation ?? "",
    })

    localStorage.setItem(
      "paarth-progress",
      JSON.stringify({ chapter: c, verse: v })
    )
  }

  async function continuePractice() {
    const saved = localStorage.getItem("paarth-progress")

    if (saved) {
      const p = JSON.parse(saved)

      setChapter(p.chapter)
      setVerse(p.verse)

      await fetchVerse(p.chapter, p.verse)
    } else {
      await fetchVerse(4, 7)
    }

    setStage("practice")
  }

  async function startPractice() {
    await fetchVerse(chapter, verse)
    setStage("practice")
  }

  async function handleRecite() {
    if (reciting) return

    setReciting(true)
    setScore(null)
    setHeardText("")
    setGuruText("Listening carefully. Please recite the verse.")

    startListening(async (spokenText: string) => {
      setHeardText(spokenText)

      if (!spokenText?.trim()) {
        setGuruText("I could not hear clearly. Please try again.")
        setReciting(false)
        return
      }

      try {
        const result = await analyzeRecitation(spokenText, language)

        const normalizedScore = Math.min(
          100,
          Math.max(0, Number(result.score ?? 0) * 10)
        )

        const subtitle = cleanSpeech(result.subtitle)
        const spoken = cleanSpeech(result.spoken)
        const meaning = cleanSpeech(result.meaning)

        setScore(normalizedScore)
        setGuruText(subtitle || "Please try again.")

        let speechOutput = spoken

        if (!speechOutput && subtitle) {
          speechOutput = subtitle
        }

        if (normalizedScore >= 80 && meaning) {
          speechOutput = speechOutput
            ? `${speechOutput}. ${meaning}`
            : meaning
        }

        if (speechOutput) {
          speak(speechOutput, language)
        }
      } catch (e) {
        console.error(e)
        setGuruText("Something went wrong analyzing the recitation.")
      } finally {
        setReciting(false)
      }
    })
  }

  return (
    <div className="app">
      <div className="header-banner">
        <h1>PAARTH — AI Recitation Companion</h1>
      </div>

      {stage === "greeting" && (
        <div className="welcome-banner">
          🙏 Namaste Paarth 🙏

          <br />
          <br />

          Welcome to today's Bhagavad Gita practice.

          <br />
          <br />

          <button
            className="recite-button"
            onClick={() => setStage("language")}
          >
            Begin Practice
          </button>
        </div>
      )}

      {stage === "language" && (
        <div className="welcome-banner">
          Guru: Which language should we converse in?

          <br />
          <br />

          <select
            value={language}
            onChange={(e) => {
              const selected = e.target.value
              setLanguage(selected)

              if (selected !== "Choose Language") {
                setStage("chooseMode")
              }
            }}
          >
            <option>Choose Language</option>
            <option>English</option>
            <option>Hindi</option>
            <option>Kannada</option>
          </select>
        </div>
      )}

      {stage === "chooseMode" && (
        <div className="welcome-banner">
          Would you like to continue where you left?

          <br />
          <br />

          <button className="recite-button" onClick={continuePractice}>
            Continue Practice
          </button>

          <br />
          <br />

          <button
            className="recite-button"
            onClick={() => setStage("chooseVerse")}
          >
            Choose Verse
          </button>
        </div>
      )}

      {stage === "chooseVerse" && (
        <div className="verse-select-card">
          <h2>Select Chapter and Verse</h2>

          <div className="verse-inputs">
            <input
              type="number"
              value={chapter}
              onChange={(e) => setChapter(Number(e.target.value))}
            />

            <input
              type="number"
              value={verse}
              onChange={(e) => setVerse(Number(e.target.value))}
            />
          </div>

          <button className="recite-button" onClick={startPractice}>
            Start Practice
          </button>
        </div>
      )}

      {stage === "practice" && verseData && (
        <div>
          <button
            className={`recite-button ${reciting ? "reciting" : ""}`}
            onClick={handleRecite}
          >
            🎤 {reciting ? "Listening..." : "Recite Verse"}
          </button>

          <div className="main-layout">
            <div className="verse-card">
              <h2>
                Chapter {chapter} • Verse {verse}
              </h2>

              <div className="sanskrit">{verseData.sanskrit}</div>

              <div className="transliteration">
                {verseData.transliteration}
              </div>
            </div>

            <div className={`guru-panel ${guruSpeaking ? "guru-speaking" : ""}`}>
              <h3>🪷 Guru Guidance</h3>

              <div className="guru-subtitle">{guruText}</div>

              {heardText && (
                <div className="heard-text">
                  Heard: {heardText}
                </div>
              )}

              {score !== null && score >= 80 && (
                <div className="success-banner">
                  🎉 Verse Recited Successfully!
                </div>
              )}

              {score !== null && (
                <div className="score-panel">
                  Recitation Accuracy: {score}%
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}