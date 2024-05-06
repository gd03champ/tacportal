FROM node:20

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

ENV PORT=8080
ENV MONGODB_URI=mongodb://host.docker.internal:3002/tacportal

EXPOSE 8080

CMD ["npm", "start"]