from youtube_audio_downloader import download_audio
from audio_transcriber import transcribe
from text_splitter import split
from chroma_vectorization import create_vector_store
from llm_handler import llm_send_message

downloaded_audio_path = download_audio("youtube link")
audio_transcription = transcribe(downloaded_audio_path)
splitted_texts = split(audio_transcription)
vector_store = create_vector_store(splitted_texts, "audio_test")
llm_send_message("your question", vector_store)