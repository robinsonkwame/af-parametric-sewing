FROM humancompatibleai/imitation:base

RUN pip install imitation

RUN pip install ffmpeg imageio-ffmpeg && \
    pip install pillow

WORKDIR /tmp

ENTRYPOINT ["python3"]