import { startListening } from "../hooks/useSpeechRecognition"
type Props = {
  onResult:(text:string)=>void
}

export default function ReciteButton({onResult}:Props){

  const handleClick = () => {
    startListening(onResult)
  }

  return(
    <button
      className="recite-button"
      onClick={handleClick}
    >
      🎤 Recite Verse
    </button>
  )
}