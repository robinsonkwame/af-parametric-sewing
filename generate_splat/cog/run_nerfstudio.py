import subprocess
import os

def run_nerfstudio(directory, command_line):
    # Change the working directory
    os.chdir(directory)
    
    # Run the provided command line statement
    subprocess.run(command_line, shell=True, check=True)

if __name__ == "__main__":
    # Example usage
    run_nerfstudio("/path/to/directory", "nerfstudio process")