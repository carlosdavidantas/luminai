from langchain_text_splitters import RecursiveCharacterTextSplitter

def split(text):
    split_pattern = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
    all_splits = split_pattern.split_text(text)

    return all_splits
