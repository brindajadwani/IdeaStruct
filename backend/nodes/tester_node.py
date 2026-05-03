import json
from nodes.interfaces import INode
from schemas.state_schemas import AgentState
from langsmith import traceable

class TesterNode(INode):
    @traceable(name="tester-node")
    async def execute(self, state: AgentState) -> AgentState:
        prompt = f"""You are a Mind Map Quality Tester.
Analyze the provided JSON mind map against the user's original ideas and answers.

Original Ideas: {state['raw_ideas']}
User Answers: {json.dumps(state['user_answers'])}

Mind Map to Evaluate:
{json.dumps(state.get('current_map', {}), indent=2)}

You MUST check for:
1. Ambiguity or contradiction between original ideas and user answers. (CRITICAL: If found, score MUST be below 80).
2. Duplicate node labels anywhere in the map.
3. Empty or generic labels (e.g., "Node 1").
4. Ambiguous single-word nodes (labels should be descriptive, e.g., "Budget Planning" not just "Budget").
5. JSON schema validity.
6. Structure: The root should have 4-7 main branches, and each branch should have 2-4 children.

Output JSON only in this format:
{{
  "score": 85,
  "feedback": "Clear feedback on what to improve. If score >= 80, feedback can be 'Looks good'.",
  "ambiguities_found": ["List of ambiguities between input and answers, if any"],
  "clarification_question": "If ambiguities are found, write ONE direct question to ask the user to resolve them. Otherwise, leave empty string."
}}
"""
        response = await self.llm_caller.call([{"role": "user", "content": prompt}], system="You are a strict QA tester. Output only JSON.")
        
        try:
            if "```json" in response:
                response = response.split("```json")[1].split("```")[0]
            elif "```" in response:
                response = response.split("```")[1].split("```")[0]
                
            eval_data = json.loads(response.strip())
            state['score'] = eval_data.get('score', 0)
            state['last_feedback'] = eval_data.get('feedback', '')
            state['clarification_question'] = eval_data.get('clarification_question', '')
            ambiguities = eval_data.get('ambiguities_found', [])
            
            msg = f"Tested map. Score: {state['score']}."
            if ambiguities:
                msg += f" Found ambiguities: {', '.join(ambiguities)}."
                
            state['log'] = state.get('log', []) + [{"type": "tester", "message": msg}]
            state['iteration'] = state.get('iteration', 0) + 1
            
        except Exception as e:
            state['score'] = 0
            state['last_feedback'] = "Failed to parse tester output."
            state['log'] = state.get('log', []) + [{"type": "tester", "message": "Tester encountered an error."}]
            
        state['last_node'] = 'tester'
        return state
