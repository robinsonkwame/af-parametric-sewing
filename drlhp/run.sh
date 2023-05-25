#!/bin/bash
IMAGE=imitation

cmd_line="$@"

echo "Executing imitation container w command! (gpu image):"
echo $cmd_line

if [ -x "$(which nvidia-docker)" ]; then
  # old-style nvidia-docker2
  NVIDIA_ARG="--runtime=nvidia"
else
  NVIDIA_ARG="--gpus all"
fi

docker run -it ${NVIDIA_ARG} --rm --network host --ipc=host \
  --mount src=$(pwd),target=/tmp,type=bind ${IMAGE} \
  $cmd_line
