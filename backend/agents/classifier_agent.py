import json
from langsmith import traceable
from llm.groq_caller import GroqCaller
from schemas.mindmap_schemas import ClassifyResponse

class ClassifierAgent:
    def __init__(self):
        self.llm_caller = GroqCaller()

    @traceable(name="classifier-agent", run_type="chain")
    async def classify(self, raw_text: str) -> ClassifyResponse:
        system_prompt = """You are an expert Mind Map structure classifier. 
Your job is to read raw ideas and generate 3 to 5 clarifying questions to help map out a proper hierarchy.
Generate Multiple Choice Questions (MCQs) to make it easy for the user to answer.
Output MUST be in valid JSON matching this schema:
{
  "questions": [
    {
      "id": "q1", 
      "text": "What is the central theme of this map?", 
      "type": "mcq",
      "options": ["Option A", "Option B", "Option C"]
    }
  ]
}
Return ONLY the JSON. No markdown formatting, no explanations."""
        
        messages = [
            {"role": "user", "content": f"Raw Ideas:\n{raw_text}"}
        ]
        
        response_text = await self.llm_caller.call(messages=messages, system=system_prompt)
        
        try:
            # Strip markdown if present
            if response_text.startswith("```"):
                lines = response_text.split('\n')
                if lines[0].startswith("```"): lines = lines[1:]
                if lines[-1].startswith("```"): lines = lines[:-1]
                response_text = "\n".join(lines)
                
            data = json.loads(response_text)
            return ClassifyResponse(**data)
        except Exception as e:
            # Fallback
            return ClassifyResponse(questions=[
                {"id": "q1", "text": "What is the central concept you want to map?", "type": "text"}
            ])
