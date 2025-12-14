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
    print("\nSplitting text into chunks...\n")
    split_pattern = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100,
        separators=MARKDOWN_SEPARATORS,
        strip_whitespace=True
    )

    all_splits = split_pattern.split_text(text)
    print(f"\nSplitted result: {all_splits}\n")
    return all_splits
