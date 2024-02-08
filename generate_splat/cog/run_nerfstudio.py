import subprocess

def run_nerfstudio():
    # Example command to run a bash script or command-line tool
    command = "bash train.sh"
    subprocess.run(command, shell=True, check=True)

if __name__ == "__main__":
    run_nerfstudio()