import torch
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline
import time

def transcribe(audio_path):
    device = "cuda" if torch.cuda.is_available() else "cpu"
    torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32
    
    model_id = "openai/whisper-large-v3-turbo"

    model = AutoModelForSpeechSeq2Seq.from_pretrained(
        model_id,
        dtype=torch_dtype,
        low_cpu_mem_usage=True,
        use_safetensors=True,
    )
    model.to(device)

    processor = AutoProcessor.from_pretrained(model_id)

    pipe = pipeline(
        task="automatic-speech-recognition",
        model=model,
        tokenizer=processor.tokenizer,
        feature_extractor=processor.feature_extractor,
        dtype=torch_dtype,
        device=device,
        return_timestamps=True
    )
    start_time = time.perf_counter()
    print("Transcribing audio...")

    result = pipe(audio_path)
    print("\nTranscription result: " + result["text"] + "\n")
    
    finish_time = time.perf_counter()
    time_taken = finish_time - start_time
    print(f"Time taken for transcription: {time_taken:.2f} seconds")
    
    return result["text"]
