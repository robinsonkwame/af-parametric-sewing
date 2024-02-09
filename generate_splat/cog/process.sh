#!/bin/bash

FILE_PATH=${1:-video/LionStatue.mov}
DATA_TYPE=${2:-video}
OUTPUT_DIR=${3:-datasets}
OUTPUT_FOLDER=/output/
FILE_NAME=$(basename ${FILE_PATH})

echo "ns-process-data ${DATA_TYPE} --data /data --output-dir /${OUTPUT_DIR}/${OUTPUT_FOLDER}"

ns-process-data ${DATA_TYPE} --data /data/${FILE_NAME} --output-dir /${OUTPUT_DIR}/${OUTPUT_FOLDER}