"""Graph builder for LangGrph workkflow"""

from unittest import result

from langgraph.graph import StateGraph, END
from app.rag.state.rag_state import RAGState
from app.rag.nodes.react2node import RAGNodes

class GraphBuilder:
    """Builds and manages the langgrph workflow"""

    def __init__(self, retriever, llm):
        """
        Initialize graph builder
        
        Args:
            retriever: Document retriever instance
            llm: languge model instance
        """

        self.nodes = RAGNodes(retriever, llm)
        self.graph = None

    def build(self):
        """
        Build the rag  workflow
        
        Returns:
            Compied graph instance
        """

        #create state graph
        builder = StateGraph(RAGState)

        #Add nodes
        builder.add_node("retriever", self.nodes.retrieve_docs)
        builder.add_node("responder", self.nodes.generate_answer)

        #set entry point
        builder.set_entry_point("retriever")

        #add edges
        builder.add_edge("retriever", "responder")
        builder.add_edge("responder", END)

        #compile grph
        self.graph = builder.compile()
        return self.graph   
    
    # def run(self, question: str) -> str:
    #     if self.graph is None:    #         self.build()

    #     result = self.graph.invoke(
    #         RAGState(question=question)
    #     )
    #     return result.answer

    def run(self, question: str):
        if self.graph is None:
            self.build()

        result = self.graph.invoke(
            RAGState(question=question)
        )

        answer = getattr(result, "answer", None) if not isinstance(result, dict) else result.get("answer")
        docs = getattr(result, "retrieved_docs", None) if not isinstance(result, dict) else result.get("retrieved_docs", [])
        sources = getattr(result, "sources", None) if not isinstance(result, dict) else result.get("sources", [])
        confidence = getattr(result, "confidence", None) if not isinstance(result, dict) else result.get("confidence", 0.0)

        return {
        "question": question,
        "answer": answer or "",
        "retrieved_docs": docs or [],
        "sources": sources or [],
        "confidence": confidence or 0.0,
        }
        # return {
            
        #     "answer": result["answer"],
        #     "retrieved_docs": result["retrieved_docs"]        }
