FROM ubuntu:18.04

# Install dependencies
RUN apt-get update && \
    apt-get install -y autoconf automake build-essential libtool libjpeg-dev libpng-dev intltool libxml2-dev

# Install additional development packages for autotrace
RUN apt-get install -y libglib2.0-dev libgtk2.0-dev libxml2-dev libxslt1-dev

# Install ImageMagick library
RUN apt-get install -y libmagick++-dev

# Install autotrace
RUN apt-get install -y git
RUN git clone https://github.com/autotrace/autotrace.git /autotrace
WORKDIR /autotrace
RUN autoreconf --install && \
    ./configure --without-pstoedit --without-libpotrace && \
    make && \
    make install

# Copy the test image
COPY sleeve.png /sleeve.png

# Convert the image to SVG format using autotrace
RUN autotrace -output-format svg -output-file sleeve.svg sleeve.png

# Print the contents of the generated SVG file
RUN cat sleeve.svg
