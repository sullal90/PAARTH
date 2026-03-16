type Props = {
  subtitle:string
}

export default function GuruPanel({subtitle}:Props){
  return(
    <div className="guru-panel">
      <h3>🪷 Guru Guidance</h3>

      <p className="guru-subtitle">
        {subtitle}
      </p>
    </div>
  )
}