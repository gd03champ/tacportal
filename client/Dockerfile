FROM node:20

WORKDIR /app

# Install Node Exporter
RUN apt-get update && \
    apt-get install -y curl && \
    curl -LO https://github.com/prometheus/node_exporter/releases/download/v1.2.2/node_exporter-1.2.2.linux-amd64.tar.gz && \
    tar xvf node_exporter-1.2.2.linux-amd64.tar.gz && \
    cp node_exporter-1.2.2.linux-amd64/node_exporter /usr/local/bin/

COPY package.json .

RUN npm install

COPY . .

ENV REACT_APP_API_URL=http://localhost:3001/

RUN npm run build

EXPOSE 9100

CMD npm run serve & /usr/local/bin/node_exporter
