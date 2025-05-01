import shutil
import os

def delete_folder(path):
    if os.path.exists(path):
        shutil.rmtree(path)
