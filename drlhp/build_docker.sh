export SB3=stable-baselines3
git clone https://github.com/DLR-RM/stable-baselines3.git && cd $SB3

export USE_GPU=True

echo "... building ${SB3}"
./scripts/build_docker.sh

echo "... removing ${SB3} repository. Use 'docker run --rm ${SB3}' to launch."
cd ..
rm -rf $SB3