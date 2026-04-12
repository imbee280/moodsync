import os
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from dotenv import load_dotenv

load_dotenv()

auth_manager = SpotifyClientCredentials(
    client_id=os.getenv("SPOTIFY_CLIENT_ID"),
    client_secret=os.getenv("SPOTIFY_CLIENT_SECRET")
)

sp = spotipy.Spotify(auth_manager=auth_manager)


def get_playlist(mood_data: dict) -> dict:
    """
    Takes mood_data from analyze_mood()
    Returns 10 real Spotify tracks using search
    """

    # Build a search query from the genres and emotion
    genres = " ".join(mood_data["genres"][:2])
    emotion = mood_data["emotion"]
    query = f"{emotion} {genres}"

    results = sp.search(
        q=query,
        type="track",
        limit=10,
        market="US"
    )

    tracks = []
    for track in results["tracks"]["items"]:
        tracks.append({
            "name": track["name"],
            "artist": track["artists"][0]["name"],
            "album": track["album"]["name"],
            "album_art": track["album"]["images"][0]["url"] if track["album"]["images"] else None,
            "spotify_url": track["external_urls"]["spotify"],
            "preview_url": track["preview_url"]
        })

    return {
        "playlist_name": mood_data["playlist_name"],
        "emotion": mood_data["emotion"],
        "explanation": mood_data["explanation"],
        "tracks": tracks
    }


# ---- TEST IT RIGHT NOW ----
if __name__ == "__main__":
    import json

    test_mood_data = {
        "emotion": "anxious",
        "intensity": 0.8,
        "valence": 0.3,
        "energy": 0.5,
        "tempo_min": 60,
        "tempo_max": 80,
        "acousticness": 0.7,
        "danceability": 0.3,
        "genres": ["ambient", "chill", "post-rock"],
        "playlist_name": "Calm Before the Storm",
        "explanation": "Soft music helps quiet an overactive mind."
    }

    result = get_playlist(test_mood_data)
    print(json.dumps(result, indent=2))