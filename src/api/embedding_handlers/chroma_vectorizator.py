from langchain_chroma import Chroma
from embedding_handlers.embedding_model import get_embedding_model
import os

vector_store_path = "./chroma/"

def create_vector_store(splitted_texts, vector_store_db_name):
    print("\nCreating vector store...\n")
    vector_store = Chroma.from_texts(
        texts = splitted_texts,
        persist_directory = f"{vector_store_path}{vector_store_db_name}",
        embedding = get_embedding_model()
    )
    print("\nVector store created and persisted.\n")
    return vector_store

def get_vector_store(vector_store_db_name):
    print("\nRetrieving vector store...\n")
    if not os.path.isdir(f"{vector_store_path}{vector_store_db_name}"):
        return Exception("Vector store not found!")
    
    vector_store = Chroma(
        embedding_function = get_embedding_model(),
        persist_directory= f"{vector_store_path}{vector_store_db_name}",
    )
    print("\nVector store retrieved.\n")
    return vector_store

