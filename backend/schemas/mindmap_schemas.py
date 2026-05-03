from pydantic import BaseModel
from typing import List, Optional

class Question(BaseModel):
    id: str
    text: str
    type: str = "text"
    options: Optional[List[str]] = None

class ClassifyRequest(BaseModel):
    ideas: str

class ClassifyResponse(BaseModel):
    questions: List[Question]
