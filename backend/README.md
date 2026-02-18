## BlackBank backend

Node.js (Fastify + TypeScript) backend для учебного банковского приложения BlackBank с PostgreSQL, Prisma и Swagger.

### Стек

- **Node.js**: LTS (образ `node:lts` в Docker).
- **Язык**: TypeScript.
- **Фреймворк**: Fastify.
- **ORM**: Prisma (PostgreSQL + driver adapter `@prisma/adapter-pg`).
- **БД**: PostgreSQL (контейнер `postgres:16`).
- **Документация API**: Swagger UI (`/docs`).

### Подготовка окружения

1. Установите Docker и Docker Compose.
2. В корне `backend` создайте файл `.env` (можно скопировать из `.env.example`):

```bash
cp .env.example .env
```

В `.env` по умолчанию:

- `PORT=3000`
- `JWT_SECRET=supersecret_jwt_key_change_me` (в проде обязательно заменить)
- `DATABASE_URL=postgresql://postgres:postgres@localhost:5433/blackbank`

### Режим разработки (с hot-reload)

#### Вариант 1: Локальный запуск (рекомендуется для разработки)

1. Убедитесь, что база данных запущена:

```bash
docker-compose up -d db
```

2. Установите зависимости (если ещё не установлены):

```bash
npm install
```

3. Сгенерируйте Prisma Client:

```bash
npm run prisma:generate
```

4. Запустите сервер в режиме разработки:

```bash
npm run dev
```

Сервер запустится на `http://localhost:3000` с автоматической перезагрузкой при изменении файлов.

#### Вариант 2: Docker Compose в режиме разработки

Если предпочитаете запускать всё в Docker:

```bash
docker-compose --profile dev up
```

Это поднимет:
- **db**: PostgreSQL на порту `5433`
- **api-dev**: Fastify API с hot-reload на порту `3000` (изменения в коде применяются автоматически)

Остановка:

```bash
docker-compose --profile dev down
```

### Продакшн-режим (Docker)

Для запуска собранного приложения:

```bash
docker-compose up -d
```

Это поднимет:

- **db**: PostgreSQL `blackbank-db` на порту `5433`.
- **api**: Fastify API `blackbank-api` на порту `3000` (собранный production build).

Проверка:

- API health-check: `http://localhost:3000/health`
- Swagger UI: `http://localhost:3000/docs`

Остановка:

```bash
docker-compose down
```

### Миграции Prisma

Сначала поднимите базу:

```bash
docker-compose up -d db
```

Затем выполните миграции (из каталога `backend`):

```bash
npx prisma migrate dev --name init
```

В контейнере `api` (если нужно выполнить миграции там):

```bash
docker-compose exec api npx prisma migrate deploy
```

### Подключение pgAdmin

В pgAdmin создайте новое подключение:

- **Host**: `localhost`
- **Port**: `5433`
- **Username**: `postgres`
- **Password**: `postgres`
- **Database**: `blackbank`

### Основные эндпоинты

- **Auth**
  - `POST /auth/register` — регистрация (email, password, fullName).
  - `POST /auth/login` — логин, возвращает `accessToken` и `refreshToken`.
  - `POST /auth/refresh` — обновление `accessToken` по `refreshToken`.

- **Users**
  - `GET /users/me` — профиль текущего пользователя (по Bearer JWT).

- **Accounts**
  - `GET /accounts` — список счетов пользователя.
  - `POST /accounts` — создать счёт (по умолчанию `currency = "RUB"`).
  - `DELETE /accounts/:id` — закрыть счёт (статус `CLOSED`).
  - `GET /accounts/:id/balance` — получить баланс конкретного счёта.

Все защищённые эндпоинты используют Bearer JWT в заголовке `Authorization: Bearer <accessToken>`.

