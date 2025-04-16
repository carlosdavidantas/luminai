from langchain import hub
from dotenv import load_dotenv
import os
from typing_extensions import List, TypedDict
from langgraph.graph import START, StateGraph
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

def llm_send_message(question, vector_store):
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash-001",
        temperature=0.5,
        max_tokens=None,
        timeout=None,
        max_retries=2,
        api_key=os.getenv("GOOGLE_API_KEY"),
    )

    prompt = hub.pull("rlm/rag-prompt")

    class State(TypedDict):
        question: str
        context: List[str]
        answer: str

    def retrieve(state: State):
        retrieved_texts = vector_store.similarity_search(state["question"], k=2)
        return {"context": retrieved_texts}
    
    def generate(state: State):
        texts_content = "\n\n".join(doc.page_content for doc in state["context"])
        messages = prompt.invoke({"question": state["question"], "context": texts_content})
        response = llm.invoke(messages)
        return {"answer": response}

    graph_builder = StateGraph(State).add_sequence([retrieve, generate])
    graph_builder.add_edge(START, "retrieve")
    graph = graph_builder.compile()


    result = graph.invoke({f"question": question})
    return result
