import os




full_path = os.path.realpath(__file__)
path, filename = os.path.split(full_path)
dir = full_path.rstrip(filename+'\\').rstrip(path.split('\\')[-1])



main_url = f"file://{dir}chat.html"
reg_url = f"file://{dir}index.html"

