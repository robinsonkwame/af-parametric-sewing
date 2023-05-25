#!/bin/bash
SB3="stable-baselines3"
THE_SCRIPT="preference_comparsion_script.py"
cp "${THE_SCRIPT}" "./${SB3}"
cd "${SB3}"

./scripts/run_docker_gpu.sh python "${THE_SCRIPT}"

rm "${THE_SCRIPT}"
cd ..