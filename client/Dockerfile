FROM node:20

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

ENV REACT_APP_API_URL=http://localhost:3001/

RUN npm run build

CMD ["npm", "run", "serve"]