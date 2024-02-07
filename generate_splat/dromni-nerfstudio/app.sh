#!/bin/bash

DATA_DIR=${1:-/datasets}
DATA_NAME=${2:-blender}
DATA_SET=${3:-mic}
METHOD=${4:-nerfacto}


# TODO
# docker run ... ns-process-data ... COLMAP'ed images (recall there was a faster COLMAP runner) over TYPE, --data location

docker run --gpus all \
            --user $(id -u):$(id -g) \
            -v $(pwd)/workspace:/workspace/ \
            -v $(pwd)/datasets:/datasets/ \
            -v $(pwd)/cache:/home/user/.cache/ \
            -p 0.0.0.0:7007:7007 \
            --rm -it \
            --shm-size=12gb \
            dromni/nerfstudio:1.0.1 \
            ns-train ${METHOD} --data ${DATA_DIR}/${DATA_NAME}/${DATA_SET}
