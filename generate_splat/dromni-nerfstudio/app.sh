#!/bin/bash

DATA_DIR=${1:-/datasets}
DATA_NAME=${2:-blender}
METHOD=${3:-nerfacto}

echo "Using --data /${DATA_DIR}/${DATA_NAME}"

docker run --gpus all \
            --user $(id -u):$(id -g) \
            -v $(pwd)/workspace:/workspace/ \
            -v $(pwd)/datasets:/datasets/ \
            -v $(pwd)/cache:/home/user/.cache/ \
            -v $(pwd)/outputs:/outputs/ \
            -p 0.0.0.0:7007:7007 \
            --rm -it \
            --shm-size=12gb \
            dromni/nerfstudio:1.0.1 \
            ns-train ${METHOD} --data /${DATA_DIR}/${DATA_NAME} --output-dir /outputs/

# docker run --gpus all -it --user $(id -u):$(id -g) --rm -v $(pwd)/workspace:/workspace -v  $(pwd)/datasets:/datasets -v $(pwd)/cache:/home/user/.cache dromni/nerfstudio:1.0.1 bash