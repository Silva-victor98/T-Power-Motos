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
