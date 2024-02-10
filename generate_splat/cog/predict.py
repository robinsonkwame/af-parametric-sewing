# Prediction interface for Cog ⚙️
import os
from cog import BasePredictor, Input, Path, File
from run_nerfstudio import run_nerfstudio
from shutil import make_archive
import tempfile

class Predictor(BasePredictor):
    def predict(self) -> Path:
        return Path('done')

# class Predictor(BasePredictor):
#     def predict(
#         self,
#         video: File = Input(description="Client video"),
#         name: str = Input(description="Name of garment and client", default="default-monique"),
#     ) -> File:
#         # Determine video format
#         video_format = video.name.split('.')[-1]
        
#         # Write video to disk with its original format
#         video_path = f"/tmp/{name}.{video_format}"  # Temporary path for the video
#         with open(video_path, "wb") as video_file:
#             video_file.write(video.read())
        
#         # Call run_nerfstudio with the location of the video
#         run_nerfstudio(video_path)
        
#         # Assuming run_nerfstudio outputs to /outputs/<name>, zip this directory
#         output_dir = f"/outputs/{name}"
#         zip_path = tempfile.mkdtemp() + f"/{name}.zip"
#         make_archive(zip_path.replace('.zip', ''), "zip", output_dir)
        
#         # Convert the zip file to a cog.File object to return
#         return File(zip_path + '.zip')