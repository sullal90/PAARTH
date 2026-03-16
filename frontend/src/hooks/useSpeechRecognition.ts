export function startListening(onResult: (text: string) => void) {
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition

  if (!SpeechRecognition) {
    alert("Speech recognition is not supported in this browser.")
    return
  }

  const recognition = new SpeechRecognition()

  recognition.lang = "hi-IN"
  recognition.continuous = true
  recognition.interimResults = true
  recognition.maxAlternatives = 1

  let finalTranscript = ""
  let silenceTimer: ReturnType<typeof setTimeout> | null = null

  const resetSilenceTimer = () => {
    if (silenceTimer) clearTimeout(silenceTimer)

    silenceTimer = setTimeout(() => {
      console.log("🛑 Silence detected, stopping mic")
      recognition.stop()
    }, 7000)
  }

  recognition.onstart = () => {
    console.log("🎤 Mic started")
    finalTranscript = ""
    resetSilenceTimer()
  }

  recognition.onresult = (event: any) => {
    let latestTranscript = ""

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcriptPiece = event.results[i][0].transcript
      latestTranscript += transcriptPiece

      if (event.results[i].isFinal) {
        finalTranscript += transcriptPiece + " "
      }
    }

    console.log("User said:", latestTranscript.trim())
    resetSilenceTimer()
  }

  recognition.onerror = (event: any) => {
    console.log("Speech recognition error:", event.error)

    if (silenceTimer) clearTimeout(silenceTimer)
    onResult("")
  }

  recognition.onend = () => {
    if (silenceTimer) clearTimeout(silenceTimer)

    const transcript = finalTranscript.trim()

    console.log("🎤 Mic ended")
    console.log("Final transcript:", transcript)

    onResult(transcript)
  }

  try {
    recognition.start()
  } catch (err) {
    console.log("Recognition start error:", err)
    onResult("")
  }
}