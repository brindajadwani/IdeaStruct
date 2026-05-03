from langgraph.graph import StateGraph, END
from schemas.state_schemas import AgentState
from nodes.reasoner_node import ReasonerNode
from nodes.generator_node import GeneratorNode
from nodes.tester_node import TesterNode
from llm.groq_caller import GroqCaller

def build_graph():
    llm = GroqCaller()
    reasoner = ReasonerNode(llm)
    generator = GeneratorNode(llm)
    tester = TesterNode(llm)

    workflow = StateGraph(AgentState)

    workflow.add_node("reasoner", reasoner.execute)
    workflow.add_node("generator", generator.execute)
    workflow.add_node("tester", tester.execute)

    workflow.set_entry_point("reasoner")

    def router(state: AgentState):
        action = state.get("next_action")
        if action == "generator":
            return "generator"
        elif action == "tester":
            return "tester"
        return END

    workflow.add_conditional_edges(
        "reasoner",
        router,
        {
            "generator": "generator",
            "tester": "tester",
            END: END
        }
    )
    
    workflow.add_edge("generator", "reasoner")
    workflow.add_edge("tester", "reasoner")

    return workflow.compile()
