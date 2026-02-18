# KodNest Job Ecosystem

Monorepo for the KodNest Job Ecosystem: a hub plus three Next.js apps for placement prep, job tracking, and resume building.

## Structure

```
apps/
  hub/         # Landing page & entry point (links to other apps)
  placement/   # Placement Readiness Platform – JD analysis, readiness, practice
  jobs/        # Job Notification Tracker – listings, saved jobs, status
  resume/      # AI Resume Builder – builder, preview, proof
```

## Run locally

Each app is a separate Next.js app. From the repo root:

```bash
# Hub (port 3000)
cd apps/hub && npm install && npm run dev

# Placement (port 3001)
cd apps/placement && npm install && npm run dev

# Jobs (port 3002)
cd apps/jobs && npm install && npm run dev

# Resume (port 3003)
cd apps/resume && npm install && npm run dev
```

Set hub env vars so the hub links to the right URLs:

- In `apps/hub/.env.local`:
  - `NEXT_PUBLIC_PLACEMENT_URL=http://localhost:3001`
  - `NEXT_PUBLIC_JOBS_URL=http://localhost:3002`
  - `NEXT_PUBLIC_RESUME_URL=http://localhost:3003` (optional)

## Deploy on Vercel (monorepo)

Create **three Vercel projects** from this repo, one per app.

1. **Hub**
   - Import this repo.
   - **Root Directory:** `apps/hub`
   - **Environment variables (Production):**
     - `NEXT_PUBLIC_PLACEMENT_URL` = your Placement app URL (e.g. `https://placement-xxx.vercel.app`)
     - `NEXT_PUBLIC_JOBS_URL` = your Jobs app URL (e.g. `https://jobs-xxx.vercel.app`)
     - `NEXT_PUBLIC_RESUME_URL` = your Resume app URL (optional)

2. **Placement**
   - Import the same repo (or add as project from same GitHub repo).
   - **Root Directory:** `apps/placement`
   - No extra env vars required for basic run.

3. **Jobs**
   - Same repo again.
   - **Root Directory:** `apps/jobs`
   - No extra env vars required for basic run.

After deploy, set the hub’s env vars to the real Placement and Jobs URLs, then redeploy the hub.

## Tech

- **Hub:** Next.js 14, Tailwind, Lucide React.
- **Placement & Jobs:** Next.js 14, Tailwind, Radix UI, Lucide React, shadcn-style components.

## Push to GitHub

1. Create a new repository on GitHub (e.g. `job-ecosystem`). Do **not** initialize with a README (this repo already has one).

2. From this folder, run:

   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repo name.

3. (Optional) Set your git identity if you haven’t:

   ```bash
   git config --global user.email "your@email.com"
   git config --global user.name "Your Name"
   ```

## License

Private – KodNest.
