const API_BASE = "http://localhost:8080"

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