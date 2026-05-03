from typing import TypedDict, List, Dict, Any, Optional

class LogEntry(TypedDict):
    type: str
    message: str

class AgentState(TypedDict):
    raw_ideas: str
    user_answers: Dict[str, str]
    current_map: Optional[Dict[str, Any]]
    last_feedback: str
    score: int
    iteration: int
    log: List[LogEntry]
    done: bool
    next_action: str
    last_node: str
    needs_clarification: bool
    clarification_question: str
