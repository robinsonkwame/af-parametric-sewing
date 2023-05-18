# Use a base image with Ubuntu 18.04
FROM ubuntu:18.04

# Update the package lists
RUN apt-get update

# Install dependencies for autotrace and build tools
RUN apt-get install -y build-essential autoconf automake libtool

# Install gettext-base for autopoint command
RUN apt-get install -y gettext-base

# Install libpng library
RUN apt-get install -y libpng-dev

# Install additional development packages for autotrace
RUN apt-get install -y libglib2.0-dev libgtk2.0-dev libxml2-dev libxslt1-dev

# Install specific version of intltool
RUN apt-get install -y intltool=0.51.0-5ubuntu1

# Install ImageMagick library
RUN apt-get install -y libmagick++-dev

# Clone autotrace repository
RUN apt-get install -y git
RUN git clone https://github.com/autotrace/autotrace.git

# Build and install autotrace without pstoedit
WORKDIR /autotrace
RUN autoreconf --install
RUN ./configure --without-pstoedit
RUN make
RUN make install

# Copy the test image file
COPY sleeve.png /autotrace/sleeve.png

# Convert the image to SVG format using autotrace
RUN autotrace -output-format svg -output-file sleeve.svg sleeve.png

# Print the contents of the generated SVG file
RUN cat sleeve.svg
