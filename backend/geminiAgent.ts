import { GoogleGenerativeAI } from "@google/generative-ai"
import dotenv from "dotenv"

dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function analyzeRecitation(
  recitation: string,
  verse: any,
  language: string
) {

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  })

  const prompt = `
      You are a calm Bhagavad Gita guru and Sanskrit scholar guiding a student named Paarth.

      Paarth recited the following verse attempt:

      "${recitation}"

      Correct verse (transliteration):

      "${verse.transliteration}"

      Evaluate how close the recitation is to the correct verse.

      If the recitation is mostly correct:
      • Praise briefly and warmly.

      If there are mistakes:
      • Gently guide the student and encourage another attempt.

      IMPORTANT RULES:

      The spoken guidance must be in ${language}.

      The subtitle must ALWAYS be in English.

      The meaning must be translation of the ${verse.transliteration} in ${language}.

      Keep spoken feedback short and natural, like a real teacher speaking.

      The score should measure how close the recitation is.

      Scoring rules:
      0 = completely incorrect  
      5 = partially correct  
      10 = nearly perfect

      Return ONLY valid JSON.

      {
        "spoken": "short spoken feedback in ${language}",
        "subtitle": "short English subtitle summarizing the guidance",
        "meaning": "translation of the ${verse.transliteration} in ${language}",
        "score": number
      }
`

  const result = await model.generateContent(prompt)

  let text =
    result.response.candidates?.[0]?.content?.parts?.[0]?.text || ""

  // 🔹 Remove markdown JSON wrappers
  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim()

  try {

    const parsed = JSON.parse(text)

    return {
      spoken: parsed.spoken || "",
      subtitle: parsed.subtitle || "",
      score: Number(parsed.score || 0)
    }

  } catch {

    console.log("Gemini raw output:", text)

    return {
      spoken: text,
      subtitle: text,
      score: 0
    }
  }

}