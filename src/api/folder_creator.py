import os

def f_create(path):
    if not os.path.exists(path):
        os.makedirs(path)
