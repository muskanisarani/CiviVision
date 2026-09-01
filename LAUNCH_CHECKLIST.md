# CiviVision Launch Checklist

This checklist contains all the remaining steps and procedures required to take CiviVision live in production.

---

## 🔑 1. Environment & API Configurations

Before launching, ensure the production environment variables in the backend hosting provider are set:

| Variable Name | Description | Current Value / Action Required |
| --- | --- | --- |
| `DATABASE_URL` | Prisma pooler connection URL | Already set to Supabase PostgreSQL pooler. |
| `DIRECT_URL` | Direct connection URL for migrations | Already set to Supabase PostgreSQL direct endpoint. |
| `JWT_SECRET` | Secret key used to sign session cookies | Change this to a secure random string in production. |
| `PORT` | Listening port for Express API | Set automatically by hosting providers (defaults to `5000`). |
| `GEMINI_API_KEY` | Gemini API Key for image validation | **[ACTION REQUIRED]** Create an API key in Google AI Studio and set it to enable high-fidelity image categorization and duplicate-checking. |

---

## 🚀 2. Deployment Procedures

Thanks to our unified setup, the Express backend serves both the API endpoints and the compiled React static files. This means you only need to deploy **one** service!

### Option A: Hosting on Render / Railway / Heroku (Recommended)
1. Link your GitHub repository to your hosting provider.
2. Set the **Build Command** depending on your build environment root:
   - If running from the **root directory**:
     ```bash
     npm run build --prefix frontend && npm install --prefix backend
     ```
   - If running from the **backend directory**:
     ```bash
     npm run build --prefix ../frontend && npm install
     ```
3. Set the **Start Command** to:
   ```bash
   npm start
   ```
5. Configure the environment variables listed in Section 1.

---

## 🗄️ 3. Database Migration & Seeding
If you change database providers or need to rebuild the database schema from scratch, run these commands inside the `backend/` folder:

* **Push Schema changes to DB**:
  ```bash
  npx prisma db push
  ```
* **Seed Initial Data** (Users, Toilets, Alerts, Notifications):
  ```bash
  npx prisma db seed
  ```
  *(Seeding sets up the default test accounts: Admin `admin@gmail.com` with password `admin123`, and User `muskan@gmail.com` with password `muskan123`).*

---

## 🧪 4. Final Sanity Checks
Ensure the following user-flows are tested on your live URL:
1. **User Sign Up / Login**: Register a new user, and verify the secure cookie `civi_session` is set and authenticated.
2. **Issue Reporting**: File a complaint with an image. Verify the AI scans the image, flags duplicate alerts (if a report is near), and creates the entry.
3. **Admin Dashboard**: Log in as `admin@gmail.com`, and verify that the newly submitted complaint is plotted on the **Geospatial Map** and that you can update its status.
