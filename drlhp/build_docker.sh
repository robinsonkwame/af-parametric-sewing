#!/bin/bash

# Exit on error
set -o errexit

# Setup build environment
export PATCH=patch_stablebaseline3.sh
export SB3=stable-baselines3
# export REPO=https://github.com/DLR-RM/stable-baselines3.git
export REPO="--branch v1.8.0 https://github.com/DLR-RM/stable-baselines3.git"
export USE_GPU=True

# Fetch parent repository
rm -rf stable-baselines3
git clone ${REPO} && cd ${SB3}

# Patch the library to include imitation
../${PATCH}
[[ $? -ne 0 ]] && exit # Exit if non-zero exit code

# Build new library, that contains imitation
echo "... building ${SB3}"
./scripts/build_docker.sh
[[ $? -ne 0 ]] && exit # Exit if non-zero exit code

cd ..
echo "... Use ./run.sh to run an imitation demo that uses stablebaseline3"