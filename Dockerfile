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

ENV DATABASE_URL=${DATABASE_URL:-file:./dev.db}
RUN if echo "$DATABASE_URL" | grep -q "^postgres"; then \
      npx prisma migrate deploy --skip-generate; \
    else \
      npx prisma db push --accept-data-loss --skip-generate; \
    fi

CMD ["node", "dist/src/main.js"]
