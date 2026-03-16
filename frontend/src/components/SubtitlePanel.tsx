export default function SubtitlePanel({subtitle}:any){

  if(!subtitle) return null

  return(

    <div style={{marginTop:20,opacity:0.8}}>

      "{subtitle}"

    </div>

  )

}