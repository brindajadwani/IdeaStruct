from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="IdeaStruct MindMap API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routers import classify_router
app.include_router(classify_router.router)

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "IdeaStruct API is running"}
