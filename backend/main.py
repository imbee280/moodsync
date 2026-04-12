from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from mood_analyzer import analyze_mood
from spotify_client import get_playlist

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MoodRequest(BaseModel):
    mood: str

@app.get("/")
def root():
    return {"message": "MoodSync API is running"}

@app.post("/analyze")
async def analyze(request: MoodRequest):
    if not request.mood.strip():
        raise HTTPException(status_code=400, detail="Mood text cannot be empty")
    mood_data = analyze_mood(request.mood)
    playlist = get_playlist(mood_data)
    return playlist