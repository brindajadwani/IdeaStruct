from pydantic import BaseModel
from typing import List, Optional

class Question(BaseModel):
    id: str
    text: str
    type: str = "text"

class ClassifyRequest(BaseModel):
    ideas: str

class ClassifyResponse(BaseModel):
    questions: List[Question]
