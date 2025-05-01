import os

def change_folder_name(old_folder_path_name, new_folder_path_name):
    try:
        os.rename(old_folder_path_name, new_folder_path_name)
    
    except Exception as e:
        print(f"Error renaming folder: {e}")
