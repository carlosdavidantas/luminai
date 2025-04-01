from langchain_text_splitters import RecursiveCharacterTextSplitter

MARKDOWN_SEPARATORS = [
    "\n#{1,6} ",
    "```\n",
    "\n\\*\\*\\*+\n",
    "\n---+\n",
    "\n___+\n",
    "\n\n",
    "\n",
    " ",
    "",
]

def split(text):
    split_pattern = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100,
        separators=MARKDOWN_SEPARATORS,
        strip_whitespace=True
    )

    all_splits = split_pattern.split_text(text)
    return all_splits
