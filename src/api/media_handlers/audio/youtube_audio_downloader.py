from folder_manipulators.folder_creator import f_create
from pytubefix import YouTube
import os


def download_audio(url):
    audio_destination_path = r"./cache"
    f_create(audio_destination_path)

    youtube = YouTube(url)
    audio = youtube.streams.filter(only_audio=True).first()
    audio_destination = audio.download(output_path = audio_destination_path)
    base, ext = os.path.splitext(audio_destination)
    audio = base + ".mp3"
    os.rename(audio_destination, audio)
    print(youtube.title + " has been successfully downloaded!")
    return [audio, youtube.title]
