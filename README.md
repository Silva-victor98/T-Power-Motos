[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://dashboard.render.com/deploy?repo=https://github.com/Silva-victor98/T-Power-Motos)

Deploy one‑click no Render:
1. Clique no botão acima (faça login/crie conta no Render).
2. Confirme o repositório e os serviços.
3. Defina as variáveis de ambiente quando pedido:
   - JWT_SECRET (obrigatório)
   - UPLOAD_MAX_FILE_SIZE (opcional; padrão 26214400)
   - ADMIN_EMAIL e ADMIN_PASS (opcionais — para seed do admin)
4. Escolha criar o Managed Postgres (recomendado).
5. Clique em Deploy — aguarde até o Render mostrar a URL pública.
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
