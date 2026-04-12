import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def analyze_mood(user_text: str) -> dict:
    system_prompt = """
    You are a music psychologist and expert DJ.
    When given a person's mood description, analyze it and return
    ONLY a valid JSON object — no extra text, no markdown, no explanation.

    Return exactly this structure:
    {
      "emotion": "primary emotion (e.g. anxious, euphoric, melancholy, focused)",
      "intensity": <float 0.0 to 1.0>,
      "valence": <float 0.0 to 1.0>,
      "energy": <float 0.0 to 1.0>,
      "tempo_min": <integer BPM>,
      "tempo_max": <integer BPM>,
      "acousticness": <float 0.0 to 1.0>,
      "danceability": <float 0.0 to 1.0>,
      "genres": ["genre1", "genre2", "genre3"],
      "playlist_name": "a creative name for this playlist",
      "explanation": "exactly 2 sentences why this music fits the mood"
    }
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"My current mood: {user_text}"}
        ],
        temperature=0.7,
        max_tokens=400
    )

    raw_text = response.choices[0].message.content.strip()
    mood_data = json.loads(raw_text)
    return mood_data


if __name__ == "__main__":
    test_input = "I'm super anxious about a job interview tomorrow and can't sleep"
    result = analyze_mood(test_input)
    print(json.dumps(result, indent=2))