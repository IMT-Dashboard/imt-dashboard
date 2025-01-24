FROM node:23-alpine AS dev

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]

FROM node:23-alpine AS prod

WORKDIR /app

COPY --from=dev /app/package*.json ./
COPY --from=dev /app/build ./build

RUN npm install --omit=dev

EXPOSE 3000

CMD ["node", "build"]
