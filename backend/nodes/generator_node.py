import json
from nodes.interfaces import INode
from schemas.state_schemas import AgentState
from langsmith import traceable

class GeneratorNode(INode):
    @traceable(name="generator-node")
    async def execute(self, state: AgentState) -> AgentState:
        prompt = f"""You are a Mind Map Generator.
Your task is to create a structured JSON mind map based on the user's ideas and clarifications.
If there is feedback from a previous iteration, you MUST apply it.

Raw Ideas: {state['raw_ideas']}
User Clarifications: {json.dumps(state['user_answers'])}
Previous Feedback: {state.get('last_feedback', 'None')}

Output ONLY valid JSON representing the mind map hierarchy.
Format:
{{
  "id": "root",
  "label": "Main Topic",
  "children": [
     {{ "id": "child1", "label": "Subtopic", "children": [] }}
  ]
}}
"""
        response = await self.llm_caller.call([{"role": "user", "content": prompt}], system="You output only JSON.")
        
        try:
            if "```json" in response:
                response = response.split("```json")[1].split("```")[0]
            elif "```" in response:
                response = response.split("```")[1].split("```")[0]
            
            map_data = json.loads(response.strip())
            state['current_map'] = map_data
            state['log'] = state.get('log', []) + [{"type": "generator", "message": "Successfully generated mind map structure."}]
        except Exception as e:
            state['log'] = state.get('log', []) + [{"type": "generator", "message": f"Failed to generate map: {str(e)}"}]
            
        state['last_node'] = 'generator'
        return state
