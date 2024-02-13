import os
from cog import BasePredictor, Input, File
from run_nerfstudio import run_nerfstudio
from shutil import make_archive, unpack_archive
import zipfile
import tempfile
import re

def list_files(startpath):
    """Utility function to list all files and directories at a given path"""
    paths = []
    for root, dirs, files in os.walk(startpath):
        for file in files:
            paths.append(
                os.path.relpath(
                    os.path.join(root, file), startpath
                )
            )
    return paths

class Predictor(BasePredictor):
    def predict(
        self,
        zipped_file: File = Input(description="Zipped file containing input data"),
        command_line: str = Input(description="Nerfstudio command line statement"),
        name: str = Input(description="Name of garment and client", default="default-monique"),
    ) -> File:
        # Validate command_line
        if not re.match(r"^(ns-[\w\-]+)$", command_line) or ";" in command_line:
            raise ValueError("Invalid command line statement. Must be a nerfstudio command without shell escape characters.")

        temp_dir = tempfile.mkdtemp()
        unpack_archive(zipped_file, temp_dir)

        before_files = set(list_files(temp_dir))

        # Call run_nerfstudio with the directory and command line statement
        run_nerfstudio(temp_dir, command_line)
        
        # List directory contents after running the command
        after_files = set(list_files(temp_dir))

        # Determine new content
        new_files = after_files - before_files

        # Zip only the new content
        zip_path = tempfile.mkdtemp() + f"/{name}.zip"
        with zipfile.ZipFile(zip_path, 'w') as zipf:
            for file in new_files:
                zipf.write(os.path.join(temp_dir, file), arcname=file)
        
        # Convert the zip file to a cog.File object to return
        return File(zip_path)