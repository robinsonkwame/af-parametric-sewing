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

# library requirements
RUN apt-get update \
    && apt-get install -y software-properties-common \
    && add-apt-repository universe \
    && git clone git://git.cairographics.org/git/pycairo \
    && apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev 

# repository and software requirements
# todo: remove pip install pycairo?
RUN . /root/.bashrc \
    && conda create -n deepsvg python=3.8 pip \
    && conda activate deepsvg \
    && export SKLEARN_ALLOW_DEPRECATED_SKLEARN_PACKAGE_INSTALL=True \
    && pip install pycairo \
    && pip install -r requirements.txt \
    && pip install svgtrace \
    && cd ./pretrained \
    && bash download.sh

CMD ["/bin/bash"]