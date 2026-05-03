from fastapi import APIRouter
from sse_starlette.sse import EventSourceResponse
from pydantic import BaseModel
from typing import Dict, Any
from graph.mindmap_graph import build_graph
import json
import asyncio

router = APIRouter(prefix="/api/generate", tags=["Generate"])
graph = build_graph()

class GenerateRequest(BaseModel):
    raw_ideas: str
    user_answers: Dict[str, str]

@router.post("/")
async def generate_map(request: GenerateRequest):
    async def event_generator():
        initial_state = {
            "raw_ideas": request.raw_ideas,
            "user_answers": request.user_answers,
            "current_map": None,
            "last_feedback": "",
            "score": 0,
            "iteration": 0,
            "log": [],
            "done": False,
            "next_action": "",
            "last_node": ""
        }
        
        try:
            async for output in graph.astream(initial_state):
                for node_name, state_update in output.items():
                    # Send log if present
                    if 'log' in state_update and state_update['log']:
                        latest_log = state_update['log'][-1]
                        yield {
                            "event": "log",
                            "data": json.dumps(latest_log)
                        }
                    
                    # Check if done
                    if state_update.get("done", False) or state_update.get("next_action") == "end":
                        yield {
                            "event": "complete",
                            "data": json.dumps({
                                "map": state_update.get("current_map"),
                                "score": state_update.get("score"),
                                "feedback": state_update.get("last_feedback"),
                                "needs_clarification": state_update.get("needs_clarification", False),
                                "clarification_question": state_update.get("clarification_question", "")
                            })
                        }
                        return
                
                await asyncio.sleep(0.1) # Flush buffer
        except Exception as e:
            yield {
                "event": "error",
                "data": json.dumps({"message": f"Graph execution failed: {str(e)}"})
            }

    return EventSourceResponse(event_generator())
