FROM nvidia/cuda:10.1-cudnn7-devel-ubuntu18.04
RUN git clone https://github.com/alexandre01/deepsvg.git
RUN cd deepsvg

RUN conda create -n deepsvg python=3.7
RUN conda activate deepsvg
RUN sudo apt-get install libcairo2-dev
RUN pip install -r requirements.txt

RUN cd ../pretrained/
RUN bash download.sh