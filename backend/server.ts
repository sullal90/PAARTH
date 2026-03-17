import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import { getVerse } from "./verseService.ts"
import { analyzeRecitation } from "./geminiAgent.ts"

dotenv.config()

const app = express()

app.use(cors({
  origin: "http://localhost:5173"
}))
app.use(express.json())

let currentVerse: any

app.get("/verse/:chapter/:verse", async (req, res) => {

    const chapter =
        Number(req.params.chapter)

    const verse =
        Number(req.params.verse)

    const data =
        await getVerse(chapter, verse)

    currentVerse = data

    res.json(data)
})

app.post("/analyze", async (req, res) => {

    const { recitation, language } = req.body

    const result =
        await analyzeRecitation(

            recitation,
            currentVerse,
            language
        )

    res.json(result)
})
const port = Number(process.env.PORT) || 8080; // Cloud Run injects PORT. 8080 is a good local default.

app.listen(port, "0.0.0.0", () => {
    console.log(`🧘 Guru server running on port ${port}`);
});
