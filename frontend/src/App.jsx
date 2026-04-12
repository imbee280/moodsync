import { useState } from "react"
import axios from "axios"

function App() {
  const [mood, setMood] = useState("")
  const [loading, setLoading] = useState(false)
  const [playlist, setPlaylist] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    if (!mood.trim()) return
    setLoading(true)
    setError(null)
    setPlaylist(null)
    try {
      const response = await axios.post("https://moodsync-production.up.railway.app/analyze", {
        mood: mood
      })
      setPlaylist(response.data)
    } catch (err) {
      setError("Something went wrong. Make sure your backend is running.")
    } finally {
      setLoading(false)
    }
  }

  const emotionColor = {
    anxious: "#7F77DD",
    euphoric: "#D85A30",
    melancholy: "#378ADD",
    focused: "#1D9E75",
    sad: "#378ADD",
    happy: "#D85A30",
    angry: "#E24B4A",
    calm: "#1D9E75",
  }

  const accentColor = playlist
    ? emotionColor[playlist.emotion?.toLowerCase()] || "#7F77DD"
    : "#7F77DD"

  return (
    <div style={{minHeight:"100vh",background:"#f8f8f6",fontFamily:"system-ui, sans-serif",padding:"2rem 1rem"}}>
      <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
        <h1 style={{fontSize:"2.5rem",fontWeight:"700",color:"#1a1a18",margin:"0 0 0.5rem"}}>MoodSync</h1>
        <p style={{color:"#888",fontSize:"1rem",margin:0}}>Tell me how you feel. I will build your soundtrack.</p>
      </div>

      <div style={{maxWidth:"600px",margin:"0 auto 2rem",background:"#fff",border:"0.5px solid #e0e0da",borderRadius:"16px",padding:"1.5rem"}}>
        <textarea
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="How are you feeling right now?"
          rows={4}
          style={{width:"100%",border:"0.5px solid #e0e0da",borderRadius:"10px",padding:"12px",fontSize:"15px",fontFamily:"system-ui, sans-serif",resize:"none",outline:"none",color:"#1a1a18",background:"#fafaf8",boxSizing:"border-box"}}
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !mood.trim()}
          style={{marginTop:"1rem",width:"100%",padding:"14px",background:loading ? "#ccc" : accentColor,color:"#fff",border:"none",borderRadius:"10px",fontSize:"15px",fontWeight:"600",cursor:loading ? "not-allowed" : "pointer"}}
        >
          {loading ? "Analyzing your mood..." : "Build my playlist"}
        </button>
      </div>

      {error && (
        <div style={{maxWidth:"600px",margin:"0 auto 1rem",background:"#FCEBEB",border:"0.5px solid #F09595",borderRadius:"10px",padding:"12px 16px",color:"#791F1F",fontSize:"14px"}}>
          {error}
        </div>
      )}

      {playlist && (
        <div style={{maxWidth:"600px",margin:"0 auto"}}>
          <div style={{background:"#fff",border:"2px solid " + accentColor,borderRadius:"16px",padding:"1.25rem 1.5rem",marginBottom:"1.5rem"}}>
            <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px"}}>
              <span style={{background:accentColor,color:"#fff",fontSize:"12px",fontWeight:"600",padding:"3px 10px",borderRadius:"99px"}}>
                {playlist.emotion}
              </span>
              <h2 style={{margin:0,fontSize:"17px",fontWeight:"600",color:"#1a1a18"}}>{playlist.playlist_name}</h2>
            </div>
            <p style={{margin:0,fontSize:"14px",color:"#666",lineHeight:"1.6"}}>{playlist.explanation}</p>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
            {playlist.tracks.map((track, i) => (
              <div key={i} style={{background:"#fff",border:"0.5px solid #e0e0da",borderRadius:"12px",padding:"12px",display:"flex",alignItems:"center",gap:"12px"}}>
                {track.album_art && (
                  <img src={track.album_art} alt={track.album} style={{width:"52px",height:"52px",borderRadius:"8px",objectFit:"cover",flexShrink:0}} />
                )}
                <div style={{flex:1,minWidth:0}}>
                  <p style={{margin:"0 0 2px",fontWeight:"600",fontSize:"14px",color:"#1a1a18",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{track.name}</p>
                  <p style={{margin:0,fontSize:"13px",color:"#888"}}>{track.artist} - {track.album}</p>
                  {track.preview_url && (
                     <audio
                       controls
                       src={track.preview_url}
                       style={{width:"100%", marginTop:"8px", height:"32px"}}
                    />
                  )}
                </div>
                {(track.spotify_url || track.music_url) && (
                  <a href={track.spotify_url || track.music_url} target="_blank" rel="noopener noreferrer" style={{background:accentColor,color:"#fff",fontSize:"12px",fontWeight:"600",padding:"6px 12px",borderRadius:"99px",textDecoration:"none",flexShrink:0}}>
                    Listen
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App