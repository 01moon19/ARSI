"""LangGraph nodes for RAG Workflow + ReAct Agent inside generate_content"""

from typing import List, Optional
from app.rag.state.rag_state import RAGState

from langchain_core.documents import Document
from langchain_core.tools import Tool
from langchain_core.messages import HumanMessage
from langgraph.prebuilt import create_react_agent
from langchain.agents import create_agent

#Wikipedia tool
from langchain_community.utilities import WikipediaAPIWrapper
from langchain_community.tools.wikipedia.tool import WikipediaQueryRun

class RAGNodes:
    """contains the node functions for rag workflow"""

    def __init__(self, retriever, llm):
        self.retriever = retriever
        self.llm = llm
        self._agent = None #lazy initializtion agent
    
    def retrieve_docs(self, state: RAGState) -> RAGState:
        """
        Retrieve relevant documents node
        
        Args:
            state: current RAG state
        
        returns:
            updated rag stte with retrieved documents
        """
        docs = self.retriever.invoke(state.question)
        return RAGState(
            question = state.question,
            retrieved_docs = docs
        )
    
    ###build tools
    def _build_tools(self) -> List[Tool]:
        """Build retriever + wikipedia tools"""

        def retriever_tool_fn(query: str) -> str:
            docs: List[Document] = self.retriever.invoke(query)
            if not docs:
                return "NO_DOCS_FOUND"
             # simple relevance check
            relevant_docs = [
                d for d in docs if len(d.page_content.strip()) > 50
            ]
            if not relevant_docs:
                return "NO_DOCS_FOUND"
            
            merged = []
            for i, d in enumerate(docs[:8], start = 1):
                meta = d.metadata if hasattr(d, "metadata") else{}
                title = meta.get("title") or meta.get("source") or f"doc_{i}"
                merged.append(f"[{i}] {title}\n{d.page_content}")
            return "\n\n".join(merged)
        
        retriever_tool = Tool(
            name = "retriever",
            description = (
                """Primary tool: search the indexed document collection and return relevant snippets.
                If query is within doc scope, answer from these docs.
                If useful, include short quoted doc text and source metadata.
                If no match, return NO_DOCS_FOUND so agent can fallback."""
            ),
            func = retriever_tool_fn
        )
        wiki = WikipediaQueryRun(
            api_wrapper = WikipediaAPIWrapper(top_k_results = 3, lang = "en")
        )
        
        def wikipedia_tool_fn(query: str) -> str:
            return wiki.run(query)
        
        wikipedia_tool = Tool(
            name = "wikipedia",
            description = (
                "Secondary fallback: use only when retriever is not sufficient or returns NO_DOCS_FOUND for a related query. "
                "Do not use for unrelated queries."
            ),
            func = wikipedia_tool_fn,
        )

        return[retriever_tool, wikipedia_tool]
        # return[retriever_tool, wiki]
    

    ##build agent
    def _build_agent(self):
        """ReAct gent with tools"""
        tools = self._build_tools()
        system_prompt = (
            # "You are a strict RAG assistant.\n"
            # "- First use retriever output. If docs are relevant, form answer from them.\n"
            # "- If retriever returns NO_DOCS_FOUND or insufficient info, call wikipedia for extra context, but keep it minimal.\n"
            # "- If query appears unrelated to doc domain and you can't answer from docs/wikipedia, return exactly: "
            # "'I cannot answer this from the current documents.'\n"
            # "- Never hallucinate."
            # 
    
            "You are an intelligent RAG assistant.\n"

            "1) Always start by using the retriever tool.\n"

            "2) If retriever returns useful content:\n"
            "- Answer primarily from retrieved documents.\n"
            "- ALSO call wikipedia to enrich the answer with 1-2 additional lines of context.\n"
            "- Clearly mention sources.\n"

            "3) If retriever content does NOT fully answer the question (missing details, examples, or current info):\n"
            "- Use wikipedia to supplement missing or modern information.\n"
            "- Combine both into a single coherent answer.\n"

            "4) If retriever returns NO_DOCS_FOUND:\n"
                "- Determine if the query is related to the document topic.\n"
                "  • If related → MUST use wikipedia to answer.\n"
                "  • If unrelated → reply: 'I cannot answer this from the current documents.'\n"

            "5) If query is NOT related to document domain:\n"
            "- Reply exactly: 'I cannot answer this from the current documents.'\n"

            "Important:\n"
                "- Never return 'I cannot answer this from the current documents.' unless BOTH:\n"
                "  • retriever has no useful information\n"
                "  • AND wikipedia cannot help answer the query\n"

            "6) Never ignore retriever when it has relevant content.\n"
            "7) Never hallucinate.\n"

            "8) If the query involves time, evolution, trends, or comparisons across periods (e.g., past, present, future, latest, recent, 2025, history, evolution):\n"
                "- MUST call wikipedia to provide temporal or contextual information.\n"
                "- Combine it with retriever content if available.\n"
            
            "Output format:\n"
                "- Main answer\n"
                "- Optional extra context\n"
                "- Sources used (retriever / wikipedia)\n"

            "Before answering, you MUST:\n"
                "1) Check if retriever fully answers the question\n"
                "2) If not, call wikipedia\n"
                "3) Combine both sources before final answer\n"

            "9) If the question has multiple parts (e.g., definition + application, concept + modern use):\n"
                "- Break the question into parts.\n"
                "- Answer each part using the best source.\n"
                "- Use retriever for core concepts.\n"
                "- Use wikipedia for modern context or applications.\n"
                "- Combine into a single final answer.\n"
            
            "10) Do NOT reject a question just because one part is missing in retriever.\n"
                "- Try to answer using a combination of retriever and wikipedia.\n"
        )
        self._agent = create_agent(self.llm, tools = tools, system_prompt = system_prompt)

    # def generate_answer(self, state: RAGState) -> RAGState:
    #     """
    #     generate answer using ReAct agent with retriever + wikipedia.
    #     """
    #     if self._agent is None:
    #         self._build_agent()

    #     result = self._agent.invoke({"messages": [HumanMessage(content = state.question)]})

    #     messages = result.get("messages", [])
    #     answer: Optional[str] = None
    #     if messages:
    #         answer_msg = messages[-1]
    #         answer = getattr(answer_msg, "content", None)

    #     return RAGState(
    #         question = state.question,
    #         retrieved_docs = state.retrieved_docs,
    #         answer = answer or "Could not generate answer."
    #     )
    def generate_answer(self, state: RAGState) -> RAGState:
        
        # if not state.retrieved_docs:
        #     # If initial retrieval found nothing relevant, do not run full agent.
        #     return RAGState(
        #         question=state.question,
        #         retrieved_docs=[],
        #         answer="I cannot answer this from the current documents."
        #     )
        
        if self._agent is None:
            self._build_agent()

        context = "\n\n".join([
            f"[Source: {doc.metadata.get('source', 'unknown')}]\n{doc.page_content}"
            for doc in state.retrieved_docs
        ]) if state.retrieved_docs else "NO_CONTEXT"

        query = f"""
        Context:
        {context}

        Question:
        {state.question}
        Instructions:
        - Use context first
        - If context is enough → do NOT use wikipedia
        - If incomplete → use wikipedia
        - Always include sources in answer
        - Format answer cleanly
        """

        result = self._agent.invoke(
            {"messages": [HumanMessage(content=query)]}
        )

        messages = result.get("messages", [])
        answer: Optional[str] = None

        # if messages:
        #     answer_msg = messages[-1]
        #     content = getattr(answer_msg, "content", None)

        # if isinstance(content, list):
        #     # Gemini 2.x structured blocks
        #     answer = "".join(
        #         block.get("text", "")
        #         for block in content
        #         if isinstance(block, dict) and block.get("type") == "text"
        #     ).strip()
        # elif isinstance(content, str):
        #     answer = content.strip()

        if messages:
            # answer_msg = messages[-1]
            # answer = getattr(answer_msg, "content", None)
            # if isinstance(answer, list):
            #     answer = "".join(
            #         block["text"] for block in answer if block.get("type") == "text"
            #     )
            last = messages[-1]
            answer = getattr(last, "content", "") or ""
            if isinstance(answer, list):
                answer = "".join(
                    block.get("text", "")
                    for block in answer
                    if isinstance(block, dict) and block.get("type") == "text"
                )
        
            answer = (answer or "").strip()
            if not answer:
                answer = "I cannot answer this from the current documents."

        sources = list(set([
            doc.metadata.get("source", "unknown")
            for doc in state.retrieved_docs
        ]))

        scores = [
            doc.metadata.get("score", 1.0)
            for doc in state.retrieved_docs
        ]

        confidence = round(1 - (sum(scores) / len(scores)), 2) if scores else 0

        return RAGState(
            question=state.question,
            retrieved_docs=state.retrieved_docs,
            answer=answer or "Could not generate answer.",
            sources=sources,
            confidence=confidence  
        )

