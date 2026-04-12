import os
import requests
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from dotenv import load_dotenv

load_dotenv()

auth_manager = SpotifyClientCredentials(
    client_id=os.getenv("SPOTIFY_CLIENT_ID"),
    client_secret=os.getenv("SPOTIFY_CLIENT_SECRET")
)

sp = spotipy.Spotify(auth_manager=auth_manager)


def get_itunes_preview(track_name: str, artist_name: str) -> str:
    """Search iTunes for a track and return its 30 second preview URL"""
    try:
        response = requests.get(
            "https://itunes.apple.com/search",
            params={
                "term": f"{track_name} {artist_name}",
                "media": "music",
                "entity": "song",
                "limit": 1
            }
        )
        data = response.json()
        if data["resultCount"] > 0:
            return data["results"][0].get("previewUrl", None)
    except:
        pass
    return None


def get_playlist(mood_data: dict) -> dict:
    genre = mood_data["genres"][0]
    emotion = mood_data["emotion"]
    query = f"{genre} {emotion}"

    results = sp.search(
        q=query,
        type="track",
        limit=10,
        market="US"
    )

    tracks = []
    for track in results["tracks"]["items"]:
        track_name = track["name"]
        artist_name = track["artists"][0]["name"]

        # Get preview from iTunes since Spotify doesn't provide it
        preview_url = get_itunes_preview(track_name, artist_name)

        tracks.append({
            "name": track_name,
            "artist": artist_name,
            "album": track["album"]["name"],
            "album_art": track["album"]["images"][0]["url"] if track["album"]["images"] else None,
            "spotify_url": track["external_urls"]["spotify"],
            "preview_url": preview_url
        })

    return {
        "playlist_name": mood_data["playlist_name"],
        "emotion": mood_data["emotion"],
        "explanation": mood_data["explanation"],
        "tracks": tracks
    }