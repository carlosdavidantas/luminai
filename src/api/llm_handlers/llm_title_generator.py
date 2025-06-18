from llm_handlers.llm_model import get_model
from langchain.prompts import PromptTemplate
from langchain.prompts.chat import ChatPromptTemplate, HumanMessagePromptTemplate
from typing_extensions import List, TypedDict
from langgraph.graph import START, StateGraph


def title_generate(splitted_texts, title):
    llm = get_model()

    custom_prompt_template = """
    You are a creative assistant specialized in generating short titles for chatbots.
    Based on the provided context and content name, create a phrase or title with a maximum of 27 characters (including spaces).
    The title must be relevant, clear, direct, and aligned with the theme.
    The title should not include any emojis or special characters, and it should not end with a period or any other punctuation mark.

    Important rules:
    - The content name may include emojis and special characters, but you MUST NOT include them in the title you create.
    - Do NOT add emojis or special characters to the title.
    - Do NOT end the title with a period (.) or any other punctuation mark.
    - Create only one title that is concise and impactful.

    Provided information:
    Context: {context}
    Content name: {content_name}
    """

    prompt_template = PromptTemplate(
        input_variables=["context", "content_name"],
        template=custom_prompt_template,
    )

    prompt = ChatPromptTemplate.from_messages([HumanMessagePromptTemplate(prompt=prompt_template)])

    class State(TypedDict):
        context: List[str]
        content_name: str
        title: str

    def retrieve(state: State):
        retrieved_texts = splitted_texts[:3]
        return {"context": retrieved_texts}
    
    def generate(state: State):
        texts_content = "\n\n".join(state["context"])
        message = prompt.invoke({"context": texts_content, "content_name": state["content_name"]})

        response = llm.invoke(message)
        return {"title": response}

    graph_builder = StateGraph(State).add_sequence([retrieve, generate])
    graph_builder.add_edge(START, "retrieve")
    graph = graph_builder.compile()


    result = graph.invoke({f"content_name": title})
    return result["title"].content
