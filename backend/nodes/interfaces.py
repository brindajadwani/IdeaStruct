from abc import ABC, abstractmethod
from schemas.state_schemas import AgentState
from llm.base_caller import BaseLLMCaller

class INode(ABC):
    def __init__(self, llm_caller: BaseLLMCaller):
        self.llm_caller = llm_caller

    @abstractmethod
    async def execute(self, state: AgentState) -> AgentState:
        pass
