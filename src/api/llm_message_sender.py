from langchain.prompts import PromptTemplate
from langchain.prompts.chat import ChatPromptTemplate, HumanMessagePromptTemplate
from langgraph.graph import START, StateGraph
from llm_model import get_model
from langchain_community.chat_message_histories import FileChatMessageHistory
from typing_extensions import List, TypedDict
from dotenv import load_dotenv
import os
from folder_creator import f_create



load_dotenv()
os.environ["LANGCHAIN_API_KEY"] = os.getenv("LANGCHAIN_API_KEY")

MESSAGES_HISTORY_FOLDER_NAME = "messages_history"

def llm_send_message(question, vector_store, title):
    llm = get_model()

    f_create(f"./{MESSAGES_HISTORY_FOLDER_NAME}")

    message_history = FileChatMessageHistory(file_path=f"./{MESSAGES_HISTORY_FOLDER_NAME}/{title}.json")

    custom_prompt_template = """
    You are an AI specialized in answering questions based on two main elements:

    1. **Informational context**: transcribed content, which may come from videos, PDFs, or other formats. Use this as the factual basis for answering technical, conceptual, or contextual questions.

    2. **Conversation history**: a list of previous messages between the user (HumanMessage) and the AI (AIMessage), which may include personal information (e.g., the user's name) or specific style preferences.

    Your job is to:

    - Directly answer the user's most recent question based on the provided transcription and chat history.
    - Use the chat history to maintain conversational continuity (e.g., remembering the user's name or preferred tone).
    - Avoid repeating information and respond only with what is necessary based on relevant context.
    - Do not make up facts beyond the content provided, unless needed to keep the conversation natural and coherent.

    ### Chat history:
    {chat_history}

    ### Extracted context (transcription):
    {context}

    ### New user question:
    {question}

    Generate a clear, direct response that respects the conversation history and is always grounded in the transcribed context.
    """

    prompt_template = PromptTemplate(
        input_variables=["chat_history", "context", "question"],
        template=custom_prompt_template,
    )
    prompt = ChatPromptTemplate.from_messages([HumanMessagePromptTemplate(prompt=prompt_template)])

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
        
        messages = prompt.invoke({"chat_history": history_context, "question": state["question"], "context": texts_content})

        response = llm.invoke(messages)

        message_history.add_user_message(state["question"])
        message_history.add_ai_message(response)

        return {"answer": response}

    graph_builder = StateGraph(State).add_sequence([retrieve, generate])
    graph_builder.add_edge(START, "retrieve")
    graph = graph_builder.compile()


    result = graph.invoke({f"question": question})
    return result
