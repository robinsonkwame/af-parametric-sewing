#!/bin/bash

docker run --gpus all \\
            -u $(id -u) \\
            -v ./data:/workspace/ \\
            -v ./cache/:/home/user/.cache/ \\
            -p 0.0.0.0:7007:7007 \\
            --rm -it \\
            --shm-size=12gb \\
            dromni/nerfstudio:1.0.1 \\
            ns-process-data video --data /workspace/video.mp4
