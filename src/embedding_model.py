from langchain_huggingface import HuggingFaceEmbeddings

def get_embedding_model():
    embeddings_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
    return embeddings_model
