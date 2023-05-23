FROM stablebaselines/stable-baselines3

# Update the package manager and install pip
USER root
RUN apt-get update && apt-get install -y python3-pip

# Install the imitation library
RUN pip3 install imitation

# Copy the preference comparison script to the Docker image
COPY preference_comparison_script.py /app/preference_comparison_script.py

# Set the working directory
WORKDIR /app

# Run the preference comparison script
CMD ["python3", "preference_comparison_script.py"]
