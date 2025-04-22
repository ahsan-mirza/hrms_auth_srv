FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build
RUN ls -la dist

FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY .env ./
COPY start.sh ./

RUN chmod +x start.sh
RUN ls -la dist

EXPOSE 6100

CMD ["./start.sh"]