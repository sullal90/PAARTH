const API_BASE = "https://paarth-backend-667904422705.us-central1.run.app"

export async function getVerse(chapter:number, verse:number){
  const res = await fetch(`${API_BASE}/verse/${chapter}/${verse}`)
  return await res.json()
}

export async function analyzeRecitation(recitation:string, language:string){
  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      recitation,
      language
    })
  })

  return await res.json()
}