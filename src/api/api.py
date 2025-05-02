from flask import Flask, jsonify, request
from flask_cors import CORS
import re
import json
import os
import sys
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.append(ROOT_DIR)

from media_handlers.audio.youtube_audio_downloader import download_audio
from media_handlers.audio.audio_transcriber import transcribe
from media_handlers.text.text_splitter import split
from embedding_handlers.chroma_vectorizator import create_vector_store, get_vector_store
from llm_handlers.llm_message_sender import llm_send_message
from folder_manipulators.folder_getter import get_folder
from media_handlers.text.json_file_reader import read_json_file
from llm_handlers.llm_title_generator import title_generate
from folder_manipulators.folder_deleter import delete_folder
from file_manipulators.file_deleter import delete_file

app = Flask(__name__)
CORS(app)

YOUTUBE_REGEX = r'(https?://)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)/(watch\?v=|embed/|v/|.+\?v=)?([^&=%\?]{11})'

def is_youtube_url(url):
    return re.match(YOUTUBE_REGEX, url) is not None


@app.route("/load-content-from-youtube", methods=["POST"])
def download_and_load_content_from_youtube():
    try:
        content = request.get_json()
        if not content:
            return jsonify({"error": "Request must be in JSON format"}), 400
            
        if 'url' not in content:
            return jsonify({"error": "Invalid request format. Use {'url': 'youtube_link'}"}), 401
            
        url = content["url"]
        
        if not url.startswith(("http://", "https://")):
            return jsonify({"error": "Invalid URL format"}), 402
            
        if not is_youtube_url(url):
            return jsonify({"error": "Invalid YouTube URL"}), 403
            
        try:
            content_array = download_audio(url)
            path = content_array[0]
            title = content_array[1]
            
            audio_transcription = transcribe(path)
            splitted_texts = split(audio_transcription)

            new_title = title_generate(splitted_texts, title)
            stripped_title = new_title.strip()

            create_vector_store(splitted_texts, stripped_title)

            delete_folder("./cache")

            return jsonify({
                "title": stripped_title,
                "status": "Video successfully downloaded!"
            }), 200
        except Exception as e:
            return jsonify({"error": f"Download failed: {str(e)}"}), 404
            
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON format"}), 405
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500


@app.route("/send-question", methods=["POST"])
def send_question():
    content = request.get_json()
    if not content:
        return jsonify({"error": "Request must be in JSON format"}), 400
            
    if "question" not in content or "title" not in content:
        return jsonify({"error": "Invalid request format. Use {'question': 'your message', 'title': 'youtube title'}"}), 401
            
    question = content["question"]
    title = content["title"]
    vector_store = get_vector_store(title)

    result = llm_send_message(question, vector_store, title)

    return jsonify({
        "reply": result["answer"].content
    }), 200

@app.route("/get-titles", methods=["GET"])
def get_titles():
    titles = get_folder("./chroma")

    if not titles:
        return jsonify({"status": "No titles found"}), 201
    
    return jsonify({
        "titles": titles
    }), 200

@app.route("/get-chat-history", methods=["GET"])
def get_chat_history():
    title = request.args.get("title") 
    print(f"Received Title: {title}")
    
    if not title:
        return jsonify({"error": "Invalid request format. Use ?title=chat_title"}), 400
            
    

    chat_history_path = f"./messages_history/{title}.json"
    if(not os.path.exists(chat_history_path)):
        return jsonify([]), 200
    
    chat_history = read_json_file(chat_history_path)

    return jsonify({
        "chat-history": chat_history
    }), 200

@app.route("/delete-chat", methods=["DELETE"])
def delete_chat():
    content = request.get_json()
    if not content:
        return jsonify({"error": "Request must be in JSON format"}), 400
            
    if "title" not in content:
        return jsonify({"error": "Invalid request format. Use {'title': 'youtube title'}"}), 401
            
    title = content["title"]

    try:
        folder_deleted = delete_folder(f"./chroma/{title}")
        file_deleted = delete_file(f"./messages_history/{title}.json")
        if not file_deleted and not folder_deleted:
            return jsonify({"status": "Chat not found"}), 200
        
    except Exception as e:
            return jsonify({"error": f"Deletion failed: {str(e)}"}), 402

    return jsonify({
        "status": "Chat was successfully deleted!"
    }), 200



if __name__ == "__main__":
    app.run(port=5000)
