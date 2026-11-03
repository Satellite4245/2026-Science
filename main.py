import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

app = FastAPI(title="Quantum Lab Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScoreSubmission(BaseModel):
    mode: str
    level: int
    score: int
    time_left: int
    player_name: str = "Anonymous"

high_scores = []

@app.get("/api/health")
def health():
    return {"status": "ok", "message": "Quantum Lab Reactor Core Online"}

@app.get("/api/scores")
def get_scores():
    return sorted(high_scores, key=lambda x: x["score"], reverse=True)[:10]

@app.post("/api/scores")
def submit_score(sub: ScoreSubmission):
    data = sub.dict()
    high_scores.append(data)
    return {"message": "Score recorded", "rank": len(high_scores)}

# Serve frontend build if dist exists
dist_dir = os.path.join(os.path.dirname(__file__), "frontend", "dist")
if os.path.exists(dist_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_dir, "assets")), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        file_path = os.path.join(dist_dir, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist_dir, "index.html"))

