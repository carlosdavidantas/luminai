import shutil
import os

def delete_folder(path):
    print(f"Deleted folder at path: {path}")
    if os.path.exists(path):
        shutil.rmtree(path)
        return True
    else:
        return False
