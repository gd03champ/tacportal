FROM node:20

WORKDIR /app

# Install Node Exporter
RUN apt-get update && \
    apt-get install -y curl && \
    curl -LO https://github.com/prometheus/node_exporter/releases/download/v1.2.2/node_exporter-1.2.2.linux-amd64.tar.gz && \
    tar xvf node_exporter-1.2.2.linux-amd64.tar.gz && \
    cp node_exporter-1.2.2.linux-amd64/node_exporter /usr/local/bin/

COPY package.json ./

RUN npm install

COPY . .

ENV PORT=8080

# Node Exporter
EXPOSE 9100
# Server
EXPOSE 8080 

CMD npm start & /usr/local/bin/node_exporter