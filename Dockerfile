FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app/backend

COPY package.json package-lock.json /app/
COPY backend/package.json backend/nest-cli.json backend/tsconfig.json ./
COPY backend/prisma ./prisma/

RUN npm install --prefix /app

RUN npx prisma generate

COPY backend/src ./src/

RUN npx nest build

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

RUN npx prisma db push --accept-data-loss --skip-generate

CMD ["node", "dist/src/main.js"]
