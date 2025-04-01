from youtube_audio_downloader import download_audio
from audio_transcriber import transcribe
from text_splitter import split
from chroma_vectorization import create_vector_store

downloaded_audio_path = download_audio("")
audio_transcription = transcribe(downloaded_audio_path)
splitted_texts = split(audio_transcription)
vector_store = create_vector_store(splitted_texts, "audio_test")
