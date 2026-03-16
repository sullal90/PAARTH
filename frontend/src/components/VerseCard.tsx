type Props = {
  verse:any
}

export default function VerseCard({verse}:Props){
  return(
    <div className="verse-card">
      <h2>Chapter {verse.chapter} • Verse {verse.verse}</h2>

      <p className="sanskrit">
        {verse.sanskrit}
      </p>

      <p className="transliteration">
        {verse.transliteration}
      </p>
    </div>
  )
}