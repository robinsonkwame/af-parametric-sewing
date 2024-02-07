#!/bin/bash

chmod 777 datasets cache workspace

DATA_NAME=${1:-blender}

docker run --gpus all \
            --user $(id -u):$(id -g) \
            -v $(pwd)/workspace:/workspace/ \
            -v $(pwd)/datasets:/datasets/ \
            -v $(pwd)/cache:/home/user/.cache/ \
            -p 0.0.0.0:7007:7007 \
            --rm -it \
            --shm-size=12gb \
            dromni/nerfstudio:1.0.1 \
            ns-download-data $DATA_NAME --save-dir /datasets

# docker run -it --user $(id -u):$(id -g) --rm -v $(pwd)/workspace:/workspace -v  $(pwd)/datasets:/datasets -v $(pwd)/cache:/home/user/.cache dromni/nerfstudio:1.0.1 bash