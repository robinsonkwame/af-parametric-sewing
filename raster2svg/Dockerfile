FROM nvidia/cuda:10.1-cudnn7-devel-ubuntu18.04

RUN apt-get update && apt-get -y upgrade \
  && apt-get install -y --no-install-recommends \
    git \
    wget \
    g++ \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*
ENV PATH="/root/miniconda3/bin:${PATH}"
ARG PATH="/root/miniconda3/bin:${PATH}"
RUN wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh \
    && mkdir /root/.conda \
    && bash Miniconda3-latest-Linux-x86_64.sh -b \
    && rm -f Miniconda3-latest-Linux-x86_64.sh \
    && echo "Running $(conda --version)" && \
    conda init bash

# Setup DeepSVG
RUN git clone https://github.com/alexandre01/deepsvg.git

WORKDIR /deepsvg

RUN . /root/.bashrc \
    && conda create -n deepsvg python=3.7 pip \
    && conda activate deepsvg \
    && export SKLEARN_ALLOW_DEPRECATED_SKLEARN_PACKAGE_INSTALL=True \
    && pip install -r requirements.txt \
    && cd ./pretrained \
    && bash download.sh

# docker run --rm -ti deepsvg /bin/bash
CMD ["/bin/bash"]