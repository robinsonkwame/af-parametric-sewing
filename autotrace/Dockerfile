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

ENV PYTHONUNBUFFERED=1

COPY ./app /app
EXPOSE 8111

# Note this avoids the nice auto tuning features of this image
# todo: go back and figure out how to get that working w ctrl-c?,
# and accessing across networks (kept on getting refused to connect)
WORKDIR /app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8111"]