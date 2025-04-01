from langchain_chroma import Chroma
from embedding_model import get_embedding_model

vector_store_path = "./chroma/"

def create_vector_store(splitted_texts, vector_store_db_name):
    vector_store = Chroma.from_texts(
        texts = splitted_texts,
        persist_directory = f"{vector_store_path}{vector_store_db_name}",
        embedding = get_embedding_model()
    )
    return vector_store
