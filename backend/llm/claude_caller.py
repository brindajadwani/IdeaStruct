import os
from typing import List, Dict, Any
from anthropic import AsyncAnthropic
from .base_caller import BaseLLMCaller
from langsmith import traceable

class ClaudeCaller(BaseLLMCaller):
    def __init__(self, model_name: str = "claude-3-5-sonnet-20241022"):
        self.model_name = model_name
        self.client = AsyncAnthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

    @traceable(name="claude_call")
    async def call(self, messages: List[Dict[str, Any]], system: str = "") -> str:
        response = await self.client.messages.create(
            model=self.model_name,
            max_tokens=4096,
            system=system,
            messages=messages,
            temperature=0.7,
        )
        return response.content[0].text
