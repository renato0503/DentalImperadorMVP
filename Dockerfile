FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json backend/nest-cli.json backend/tsconfig.json ./backend/

RUN npm install

COPY backend/prisma ./backend/prisma/
RUN cd backend && npx prisma generate

COPY backend/src ./backend/src/
RUN cd backend && npx nest build

ENV NODE_ENV=production
ENV DATABASE_URL=file:./dev.db
ENV PORT=8080

EXPOSE 8080

CMD ["node", "backend/dist/src/main.js"]
