from fastapi import APIRouter
from schemas.mindmap_schemas import ClassifyRequest, ClassifyResponse
from agents.classifier_agent import ClassifierAgent

router = APIRouter(prefix="/api/classify", tags=["Classify"])
agent = ClassifierAgent()

@router.post("/", response_model=ClassifyResponse)
async def classify_ideas(request: ClassifyRequest):
    return await agent.classify(request.ideas)
