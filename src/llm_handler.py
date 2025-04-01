from langchain_huggingface import HuggingFaceEndpoint
from langchain import hub
from dotenv import load_dotenv
import os
from typing_extensions import List, TypedDict
from langgraph.graph import START, StateGraph

load_dotenv()

huggingface_repository_id = "mistralai/Mistral-7B-Instruct-v0.3"

def llm_send_message(question, vector_store):
    llm = HuggingFaceEndpoint(
        repo_id= huggingface_repository_id,
        temperature=0.5,
        model_kwargs={
            "max_length": 512
        },
        huggingfacehub_api_token=os.getenv("HUGGINGFACE_API_KEY")
    )

    prompt = hub.pull("rlm/rag-prompt")

    example_message = prompt.invoke(
        {"context": "(context goes here)", "question": "(question goes here)"}
    ).to_messages()

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

    print(f'Context: {result["context"]}\n\n')
    print(f'Answer: {result["answer"]}')
