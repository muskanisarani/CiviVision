# 🚀 Deploying CiviVision to Vercel (with Supabase PostgreSQL)

Vercel runs on a **serverless, read-only filesystem**. If you deploy using SQLite, database writes (user registration, complaint submissions, status updates) will either fail or reset every time Vercel recycles your serverless functions.

To list this project on your resume as a true **production-ready full-stack application**, it is highly recommended to connect it to a free **Supabase PostgreSQL database** (which takes less than 5 minutes to set up).

---

## Step 1: Create a Free PostgreSQL Database on Supabase

1. Go to [Supabase](https://supabase.com/) and sign up for a free account.
2. Click **New Project** and select a database region close to you.
3. Choose a strong database password and click **Create New Project**.
4. Once the database is ready, navigate to the **Project Settings** (gear icon) -> **Database** in the sidebar.
5. Scroll down to **Connection string** -> Select **URI** (or **Prisma**). Copy the connection string. It will look like this:
   ```text
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxx.supabase.co:5432/postgres
   ```
   *(Make sure to replace `[YOUR-PASSWORD]` with the database password you chose during setup).*

---

## Step 2: Configure Prisma for PostgreSQL

To tell Prisma to use PostgreSQL instead of SQLite, make these two modifications:

### 1. Update `prisma/schema.prisma`
Open `prisma/schema.prisma` and replace the `datasource` block at the top with:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 2. Update your local `.env` file
Create a file named `.env` in the root of your project directory and add your connection string:
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxx.supabase.co:5432/postgres"
JWT_SECRET="generate-any-random-long-string-for-security-sessions"
GEMINI_API_KEY="your-optional-gemini-vision-api-key"
```

---

## Step 3: Push Schema & Seed Database

1. Push your tables directly to the Supabase cloud instance:
   ```bash
   npx prisma db push
   ```
2. Seed the cloud database with default accounts (Muskan & Admin), public toilets, and alerts:
   ```bash
   node prisma/seed.js
   ```

---

## Step 4: Deploy to Vercel

1. Push all code updates to your GitHub repository:
   ```bash
   git add .
   git commit -m "chore: configure database for PostgreSQL Supabase deployment"
   git push origin main
   ```
2. Log in to [Vercel](https://vercel.com/) and click **Add New** -> **Project**.
3. Import your `CiviVision` GitHub repository.
4. Under **Environment Variables**, add:
   * `DATABASE_URL` = *(Your Supabase Connection String)*
   * `JWT_SECRET` = *(Your random secret string)*
   * `GEMINI_API_KEY` = *(Your Google Gemini API Key - Optional)*
5. Click **Deploy**. Vercel will automatically run the build, trigger `prisma generate`, and host your live website!

---

### Alternative: Local-only Database (Using SQLite)
If you want to keep using SQLite locally, you can run a local development server by reverting `schema.prisma` to:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```
And starting the dev server with `npm run dev`.
