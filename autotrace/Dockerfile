FROM tiangolo/uvicorn-gunicorn-fastapi:python3.11

# Following https://github.com/autotrace/autotrace/blob/master/.github/workflows/linux_test.yml
ENV DEB_DH_SHLIBDEPS_ARGS_ALL="--dpkg-shlibdeps-params=--ignore-missing-info"

# Install dependencies
RUN apt update && \
    apt install -y libgraphicsmagick1-dev libpng-dev \
    libexiv2-dev libtiff-dev libjpeg-dev libxml2-dev \
    libbz2-dev libfreetype6-dev libpstoedit-dev autoconf \
    automake libtool intltool autopoint git

# Clone autotrace
RUN git clone https://github.com/autotrace/autotrace.git /autotrace
WORKDIR /autotrace

# Build autotrace
RUN ./autogen.sh && \
    ./configure && \
    make && \
    make check

COPY ./app /app