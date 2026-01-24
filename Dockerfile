FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json pnpm-lock.yaml* ./
RUN npm install
COPY . .
RUN npm run build
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN mkdir -p /app/uploads /app/tmp
COPY --from=builder /app/package*.json ./
RUN npm install --production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
EXPOSE 3000
VOLUME ["/app/uploads"]
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["node", "dist/main.js"]