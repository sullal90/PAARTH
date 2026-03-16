import fetch from "node-fetch"

const BASE_URL =
    "https://raw.githubusercontent.com/vedicscriptures/bhagavad-gita/main/slok"

export async function getVerse(chapter: number, verse: number) {

    const url =
        `${BASE_URL}/bhagavadgita_chapter_${chapter}_slok_${verse}.json`

    const res = await fetch(url)

    const data: any = await res.json()

    return {

        chapter,
        verse,

        sanskrit: data.slok,
        transliteration: data.transliteration,

        translation: data.gambir?.et
    }
}