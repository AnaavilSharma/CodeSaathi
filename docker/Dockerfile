FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    g++ \
    openjdk-17-jdk \
    python3 \
    python3-pip \
    nodejs \
    npm \
    swift \
    && apt-get clean

# Set working directory inside container
WORKDIR /tmp

CMD ["bash"]