import pathlib

def get_folders(path):
    directory = pathlib.Path(path)
    titles = []
    for item in directory.iterdir():
        if item.is_dir():
            titles.append(item.name)
    return titles
