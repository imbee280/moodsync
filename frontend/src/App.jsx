import { useState } from "react"
import axios from "axios"

function App() {
  const [mood, setMood] = useState("")
  const [loading, setLoading] = useState(false)
  const [playlist, setPlaylist] = useState(null)
  const [error, setError] = useState(null)
  const [currentAudio, setCurrentAudio] = useState(null)
  const [playingIndex, setPlayingIndex] = useState(null)

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
    euphoric: "#FF6B6B",
    melancholy: "#4A90D9",
    focused: "#34C759",
    sad: "#4A90D9",
    happy: "#FF9500",
    angry: "#FF3B30",
    calm: "#30B0C7",
    excited: "#FF6B6B",
    lonely: "#7F77DD",
  }

  const accentColor = playlist
    ? emotionColor[playlist.emotion?.toLowerCase()] || "#FF6B6B"
    : "#FF6B6B"

  const handlePlay = (index, previewUrl) => {
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
    }
    if (playingIndex === index) {
      setPlayingIndex(null)
      setCurrentAudio(null)
      return
    }
    const audio = new Audio(previewUrl)
    audio.play()
    audio.onended = () => {
      setPlayingIndex(null)
      setCurrentAudio(null)
    }
    setCurrentAudio(audio)
    setPlayingIndex(index)
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f5f7",
      fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
    }}>

      <div style={{
        background: "rgba(255,255,255,0.85)",
        borderBottom: "0.5px solid rgba(0,0,0,0.1)",
        padding: "0 2rem",
        height: "52px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div style={{display:"flex", alignItems:"center", gap:"8px"}}>
          <div style={{
            width: "28px",
            height: "28px",
            background: accentColor,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
          <span style={{fontSize:"17px", fontWeight:"600", color:"#1d1d1f"}}>MoodSync</span>
        </div>
        <span style={{fontSize:"13px", color:"#86868b"}}>AI Music for your mood</span>
      </div>

      <div style={{
        maxWidth: "680px",
        margin: "0 auto",
        padding: "3rem 1.5rem 1.5rem"
      }}>

        {!playlist && (
          <div style={{textAlign:"center", marginBottom:"2.5rem"}}>
            <h1 style={{
              fontSize: "3rem",
              fontWeight: "700",
              color: "#1d1d1f",
              margin: "0 0 0.75rem",
              letterSpacing: "-0.02em",
              lineHeight: 1.1
            }}>
              Your mood.<br/>
              <span style={{color: accentColor}}>Your soundtrack.</span>
            </h1>
            <p style={{
              color: "#86868b",
              fontSize: "1.1rem",
              margin: 0,
              fontWeight: "400"
            }}>
              Tell me how you feel and I will build the perfect playlist.
            </p>
          </div>
        )}

        <div style={{
          background: "#ffffff",
          borderRadius: "20px",
          padding: "1.5rem",
          marginBottom: "1.5rem",
          boxShadow: "0 2px 20px rgba(0,0,0,0.06)"
        }}>
          <textarea
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="How are you feeling right now? Be honest..."
            rows={3}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              fontSize: "16px",
              fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
              resize: "none",
              color: "#1d1d1f",
              background: "transparent",
              boxSizing: "border-box",
              lineHeight: "1.6"
            }}
          />
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1rem",
            paddingTop: "1rem",
            borderTop: "0.5px solid #f0f0f0"
          }}>
            <span style={{fontSize:"13px", color:"#86868b"}}>
              Press Enter to generate
            </span>
            <button
              onClick={handleSubmit}
              disabled={loading || !mood.trim()}
              style={{
                background: loading || !mood.trim() ? "#e5e5ea" : accentColor,
                color: loading || !mood.trim() ? "#86868b" : "#fff",
                border: "none",
                borderRadius: "12px",
                padding: "10px 20px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: loading || !mood.trim() ? "not-allowed" : "pointer",
                fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                transition: "all 0.2s"
              }}
            >
              {loading ? "Analyzing..." : "Build playlist"}
            </button>
          </div>
        </div>

        {loading && (
          <div style={{
            textAlign: "center",
            padding: "2rem",
            color: "#86868b",
            fontSize: "15px"
          }}>
            <div style={{
              width: "32px",
              height: "32px",
              border: "3px solid " + accentColor,
              borderTop: "3px solid transparent",
              borderRadius: "50%",
              margin: "0 auto 1rem",
              animation: "spin 1s linear infinite"
            }}/>
            Analyzing your mood with AI...
          </div>
        )}

        {error && (
          <div style={{
            background: "#fff2f2",
            border: "0.5px solid #ffcccc",
            borderRadius: "12px",
            padding: "12px 16px",
            color: "#cc0000",
            fontSize: "14px",
            marginBottom: "1rem"
          }}>
            {error}
          </div>
        )}

        {playlist && (
          <div>
            <div style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "1.5rem",
              marginBottom: "1rem",
              boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
              borderLeft: "4px solid " + accentColor
            }}>
              <div style={{display:"flex", alignItems:"center", gap:"10px", marginBottom:"8px"}}>
                <span style={{
                  background: accentColor,
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: "700",
                  padding: "3px 10px",
                  borderRadius: "99px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  {playlist.emotion}
                </span>
                <h2 style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#1d1d1f",
                  letterSpacing: "-0.01em"
                }}>
                  {playlist.playlist_name}
                </h2>
              </div>
              <p style={{
                margin: 0,
                fontSize: "14px",
                color: "#86868b",
                lineHeight: "1.6"
              }}>
                {playlist.explanation}
              </p>
            </div>

            <p style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#86868b",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              margin: "0 0 0.75rem 0.25rem"
            }}>
              {playlist.tracks.length} tracks
            </p>

            <div style={{
              background: "#ffffff",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 2px 20px rgba(0,0,0,0.06)"
            }}>
              {playlist.tracks.map((track, i) => (
                <div key={i} style={{
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  borderBottom: i < playlist.tracks.length - 1 ? "0.5px solid #f5f5f7" : "none",
                  cursor: "pointer"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#f9f9f9"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{width:"20px", textAlign:"center", flexShrink:0}}>
                    {track.preview_url ? (
                      <button
                        onClick={() => handlePlay(i, track.preview_url)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          color: playingIndex === i ? accentColor : "#86868b",
                          display: "flex",
                          alignItems: "center"
                        }}
                      >
                        {playingIndex === i ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        )}
                      </button>
                    ) : (
                      <span style={{fontSize:"13px", color:"#c7c7cc"}}>{i + 1}</span>
                    )}
                  </div>

                  {track.album_art && (
                    <img
                      src={track.album_art}
                      alt={track.album}
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "8px",
                        objectFit: "cover",
                        flexShrink: 0
                      }}
                    />
                  )}

                  <div style={{flex:1, minWidth:0}}>
                    <p style={{
                      margin: "0 0 2px",
                      fontWeight: "600",
                      fontSize: "14px",
                      color: playingIndex === i ? accentColor : "#1d1d1f",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}>
                      {track.name}
                    </p>
                    <p style={{
                      margin: 0,
                      fontSize: "13px",
                      color: "#86868b",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}>
                      {track.artist} - {track.album}
                    </p>
                  </div>

                  {track.spotify_url && (
                    
                      href={track.spotify_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{
                        background: "#f5f5f7",
                        color: "#1d1d1f",
                        fontSize: "12px",
                        fontWeight: "600",
                        padding: "6px 12px",
                        borderRadius: "99px",
                        textDecoration: "none",
                        flexShrink: 0,
                        whiteSpace: "nowrap"
                      }}
                    >
                      Open
                    </a>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setPlaylist(null)
                setMood("")
                setPlayingIndex(null)
                if (currentAudio) {
                  currentAudio.pause()
                }
              }}
              style={{
                display: "block",
                margin: "1.5rem auto 3rem",
                background: "none",
                border: "none",
                color: accentColor,
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif"
              }}
            >
              Try another mood
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default App