from langchain import hub
from dotenv import load_dotenv
import os
from typing_extensions import List, TypedDict
from langgraph.graph import START, StateGraph
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.memory import FileChatMessageHistory
from folder_creator import f_create

load_dotenv()

MESSAGES_HISTORY_FOLDER_NAME = "messages_history"

def llm_send_message(question, vector_store, title):
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash-001",
        temperature=0.5,
        max_tokens=None,
        timeout=None,
        max_retries=2,
        api_key=os.getenv("GOOGLE_API_KEY"),
    )

    f_create(f"./{MESSAGES_HISTORY_FOLDER_NAME}")

    message_history = FileChatMessageHistory(file_path=f"./{MESSAGES_HISTORY_FOLDER_NAME}/{title}.json")

    prompt = hub.pull("rlm/rag-prompt")
    
    class State(TypedDict):
        question: str
        context: List[str]
        answer: str

    def retrieve(state: State):
        retrieved_texts = vector_store.similarity_search(state["question"], k=2)
        return {"context": retrieved_texts}
    
    def generate(state: State):
        history_messages = message_history.messages
        history_context = "\n".join([f"{type(msg).__name__}: {msg.content}" for msg in history_messages])

        texts_content = "\n\n".join(doc.page_content for doc in state["context"])
        full_context = f"{history_context}\n\n{texts_content}"

        messages = prompt.invoke({"question": state["question"], "context": full_context})
        response = llm.invoke(messages)

        message_history.add_user_message(state["question"])
        message_history.add_ai_message(response)

        return {"answer": response}

    graph_builder = StateGraph(State).add_sequence([retrieve, generate])
    graph_builder.add_edge(START, "retrieve")
    graph = graph_builder.compile()


    result = graph.invoke({f"question": question})
    return result
