#!/bin/bash

FILE_PATH=${1:-video/LionStatue.mov}
DATA_TYPE=${2:-video}
OUTPUT_DIR=${3:-datasets}
OUTPUT_FOLDER=$(basename ${FILE_PATH} .mov)
FILE_NAME=$(basename ${FILE_PATH})

echo "ns-process-data ${DATA_TYPE} --data /data --output-dir /${OUTPUT_DIR}/${OUTPUT_FOLDER}"

docker run --gpus all \
            --user $(id -u):$(id -g) \
            -v $(pwd)/workspace:/workspace/ \
            -v $(pwd)/${DATA_TYPE}:/data/ \
            -v $(pwd)/datasets:/datasets/ \
            --rm -it \
            --shm-size=12gb \
            dromni/nerfstudio:1.0.1 \
            ns-process-data ${DATA_TYPE} --data /data/${FILE_NAME} --output-dir /${OUTPUT_DIR}/${OUTPUT_FOLDER}

# docker run --gpus all -it --user $(id -u):$(id -g) --rm -v $(pwd)/workspace:/workspace -v $(pwd)/${DATA_TYPE}:/data/ -v $(pwd)/datasets:/datasets/ dromni/nerfstudio:1.0.1 bash
