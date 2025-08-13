# 🚀 Hono API with Supabase, Prisma & Redis

A fast, modern backend API built with [Hono](https://hono.dev/) and [Bun](https://bun.sh/), using **Supabase** (PostgreSQL) as the database, **Prisma** as ORM, and **Redis** for caching and session management.

## ✨ Features
- ⚡ **High performance** API powered by Hono & Bun.
- 🗄 **Supabase (PostgreSQL)** for scalable data storage.
- 📦 **Prisma ORM** with type-safe queries.
- 🔒 **Secure authentication** with JWT & Redis-backed sessions.
- 🛠 Modular, maintainable architecture.
- ✅ Linting & formatting for consistent code style.

## 🛠 Tech Stack
- **Runtime:** Bun
- **Framework:** Hono
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Cache / Session Store:** Redis
- **Validation:** Zod
- **Auth:** JWT

## 🚀 Getting Started
1. Install dependencies:
   ```bash
   bun install
   ````

2. Run database migrations:

   ```bash
   bunx prisma migrate dev
   ```
3. Start the development server:

   ```bash
   bun run dev
   ```

## 📌 Example Endpoints

* **POST** `/api/v1/auth/login` – User login
* **POST** `/api/v1/auth/refresh` – Refresh access token
* **GET** `/api/v1/users/me` – Get authenticated user details

## 📝 Notes

* Redis is used to manage authentication sessions for improved security and performance.
* Supabase acts as the PostgreSQL backend but can be replaced with a self-hosted instance.
* The project is designed with modular services for scalability.

## 📜 License

MIT License – feel free to use and modify.
