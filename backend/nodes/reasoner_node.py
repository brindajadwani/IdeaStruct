from nodes.interfaces import INode
from schemas.state_schemas import AgentState
from langsmith import traceable

class ReasonerNode(INode):
    @traceable(name="reasoner-node")
    async def execute(self, state: AgentState) -> AgentState:
        if not state.get('current_map'):
            state['next_action'] = 'generator'
            state['log'] = state.get('log', []) + [{"type": "reasoner", "message": "No map found. Routing to Generator."}]
            state['last_node'] = 'reasoner'
            return state

        if state.get('last_node') == 'generator':
            state['next_action'] = 'tester'
            state['log'] = state.get('log', []) + [{"type": "reasoner", "message": "Map generated. Routing to Tester for critique."}]
            state['last_node'] = 'reasoner'
            return state
            
        if state.get('last_node') == 'tester':
            score = state.get('score', 0)
            iteration = state.get('iteration', 0)
            clarification_question = state.get('clarification_question', '')
            
            if clarification_question and score < 80:
                state['needs_clarification'] = True
                state['next_action'] = 'end'
                state['log'] = state.get('log', []) + [{"type": "reasoner", "message": "Ambiguity detected. Halting generation to ask user for clarification."}]
            elif score >= 80 or iteration >= 3:
                state['done'] = True
                state['next_action'] = 'end'
                state['log'] = state.get('log', []) + [{"type": "reasoner", "message": f"Quality met or max iterations reached (Score: {score}, Iteration: {iteration}). Done."}]
            else:
                state['next_action'] = 'generator'
                state['log'] = state.get('log', []) + [{"type": "reasoner", "message": f"Score {score} is below 80. Routing to Generator to apply feedback."}]
            
            state['last_node'] = 'reasoner'
            return state
            
        state['last_node'] = 'reasoner'
        return state
