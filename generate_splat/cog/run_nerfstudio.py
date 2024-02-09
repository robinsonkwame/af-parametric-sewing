import subprocess

def run_nerfstudio():
    command = "process.sh && train.sh"
    #subprocess.run(command, shell=True, check=True)
    # figure out end to end of script; I suspect the output will be in the same directory as predict

if __name__ == "__main__":
    run_nerfstudio()