import pathlib

def get_folder(path):
    directory = pathlib.Path(path)
    if not directory.exists() or not directory.is_dir():
        return []
    
    titles = []
    for item in directory.iterdir():
        if item.is_dir():
            titles.append(item.name)
    return titles
