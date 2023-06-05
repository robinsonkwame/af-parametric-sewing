FROM humancompatibleai/imitation:base

RUN pip install imitation

# cairosvg requirements
RUN apt update && \
    apt install -y libcairo2-dev libffi-dev python3-dev && \
    pip install --upgrade pip

RUN pip install ffmpeg imageio-ffmpeg && \
    pip install cairosvg

WORKDIR /tmp

ENTRYPOINT ["python3"]