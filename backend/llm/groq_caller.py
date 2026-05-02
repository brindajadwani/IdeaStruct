import os
from typing import List, Dict, Any
from groq import AsyncGroq
from .base_caller import BaseLLMCaller
from langsmith import traceable

class GroqCaller(BaseLLMCaller):
    def __init__(self, model_name: str = "llama-3.3-70b-versatile"):
        self.model_name = model_name
        self.client = AsyncGroq(api_key=os.environ.get("GROQ_API_KEY"))

    @traceable(name="groq_call")
    async def call(self, messages: List[Dict[str, Any]], system: str = "") -> str:
        formatted_messages = []
        if system:
            formatted_messages.append({"role": "system", "content": system})
        formatted_messages.extend(messages)
        
        response = await self.client.chat.completions.create(
            model=self.model_name,
            messages=formatted_messages,
            temperature=0.7,
        )
        return response.choices[0].message.content
