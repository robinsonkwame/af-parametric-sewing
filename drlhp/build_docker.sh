export SB3=stable-baselines3
git clone https://github.com/DLR-RM/stable-baselines3.git && cd $SB3

export USE_GPU=True

echo "... building ${SB3}"
./scripts/build_docker.sh

cd ..
echo "... Use ./run_pref_demo.sh to run a demo using stablebaseline3"

