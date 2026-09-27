import httpx
from .config import GEMINI_API_KEY, GEMINI_MODEL, EMBEDDING_MODEL

API_ROOT = "https://generativelanguage.googleapis.com/v1beta"

def _require_key():
    if not GEMINI_API_KEY or GEMINI_API_KEY.startswith("replace_"):
        raise RuntimeError("Set GEMINI_API_KEY in backend/.env")

async def generate_text(prompt: str) -> str:
    _require_key()
    url = f"{API_ROOT}/models/{GEMINI_MODEL}:generateContent"
    payload = {"contents": [{"role": "user", "parts": [{"text": prompt}]}],
               "generationConfig": {"temperature": 0.2}}
    async with httpx.AsyncClient(timeout=120) as client:
        response = await client.post(url, params={"key": GEMINI_API_KEY}, json=payload)
        response.raise_for_status()
        data = response.json()
    try:
        return data["candidates"][0]["content"]["parts"][0]["text"].strip()
    except (KeyError, IndexError, TypeError):
        raise RuntimeError("Gemini returned no text. Try again or check model/API access.")

async def embed_texts(
    texts: list[str],
    task_type: str = "RETRIEVAL_DOCUMENT"
) -> list[list[float]]:

    _require_key()

    model = EMBEDDING_MODEL.replace("models/", "")

    url = (
        f"{API_ROOT}/models/"
        f"{model}:embedContent"
    )

    results = []

    async with httpx.AsyncClient(timeout=120) as client:

        for text in texts:

            payload = {
                "model": f"models/{model}",
                "content": {
                    "parts": [
                        {"text": text}
                    ]
                },
                "taskType": task_type
            }

            response = await client.post(
                url,
                headers={
                    "Content-Type": "application/json"
                },
                params={
                    "key": GEMINI_API_KEY
                },
                json=payload
            )

            if response.status_code != 200:
                raise RuntimeError(
                    f"Gemini embedding error: "
                    f"{response.status_code} - "
                    f"{response.text}"
                )

            data = response.json()

            results.append(
                data["embedding"]["values"]
            )

    return results
