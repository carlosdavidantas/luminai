from youtube_audio_downloader import download_audio
from audio_transcriber import transcribe

downloaded_audio_path = download_audio("https://www.youtube.com/shorts/8OJkwyja2MY") #https://www.youtube.com/shorts/8OJkwyja2MY  https://www.youtube.com/watch?v=vFSNUmw32t0
audio_transcription = transcribe(downloaded_audio_path)
