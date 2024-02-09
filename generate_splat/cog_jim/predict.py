from cog import BasePredictor, Input, Path

from run_nerfstudio import run_nerfstudio

class Predictor(BasePredictor):
    def predict(self) -> Path:
        run_nerfstudio()
        return Path(f"hello_world.zip")
