# I tried to run the client and server in the same container but it didn't work.
# It's a bad idea, a container should have only one process, thus supports only one CMD.
# So it's better to go with the multi-stage build approach and organise using docker-compose.




FROM node:20

WORKDIR /app

RUN mkdir -p /app/client /app/server

COPY server/package.json /app/server
COPY client/package.json /app/client

WORKDIR /app/server
RUN npm install

WORKDIR /app/client
RUN npm install

WORKDIR /app/server
COPY /server .

ENV PORT=3001
ENV MONGODB_URI=mongodb+srv://gd03champ:gd03champ@atlas-cluster.prpet6p.mongodb.net/tacportal

WORKDIR /app/client
COPY /client .

ENV REACT_APP_API_URL=http://localhost:3001/

RUN npm run build
RUN rm -rf node_modules
RUN npm install serve -g

WORKDIR /app/server
CMD [ "npm", "run", "dev" ]

WORKDIR /app/client
CMD ["npm", "run", "serve"]