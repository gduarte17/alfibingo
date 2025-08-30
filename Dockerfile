FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src
COPY data ./data
COPY assets ./assets
COPY src/bingo/options.json ./src/bingo/options.json

RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
