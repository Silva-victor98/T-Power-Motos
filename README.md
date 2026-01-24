type: web name: t-power-motos env: node repo: https://github.com/Silva-victor98/T-Power-Motos branch: main plan: free buildCommand: npm install && npm run build startCommand: npm run start:prod envVars:
key: JWT_SECRET required: true
key: UPLOAD_MAX_FILE_SIZE value: "26214400"
key: ADMIN_EMAIL
key: ADMIN_PASS
databases:

name: tpower-postgres engine: postgres plan: starter version: "15"
# T-Power-Motos - Backend (scaffold)

Stack: NestJS + TypeScript + Prisma + PostgreSQL

Quick start (dev):
1. copy .env.example -> .env (adjust DATABASE_URL)
2. docker-compose up -d
3. npm install
4. npx prisma generate
5. npx prisma migrate dev --name init
6. npm run seed (set ADMIN_EMAIL and ADMIN_PASS in .env to create admin)
7. npm run start:dev

API prefix: /api

Notes:
- Admin seed runs only if ADMIN_EMAIL and ADMIN_PASS are set (you chose to keep conditional).
- Uploads are stored in /uploads locally (development). For production, configure S3 following the docs.
