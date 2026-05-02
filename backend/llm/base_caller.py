from abc import ABC, abstractmethod
from typing import List, Dict, Any

class BaseLLMCaller(ABC):
    @abstractmethod
    async def call(self, messages: List[Dict[str, Any]], system: str = "") -> str:
        """
        Call the LLM with the given messages and system prompt.
        messages should be a list of dicts with 'role' and 'content' keys.
        """
        pass
