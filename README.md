# KodNest Job Ecosystem

A premium, unified monorepo for the KodNest Job Ecosystem. This workspace contains the central hub and three Next.js applications dedicated to placement preparation, job tracking, and AI resume building. 

## Live Application
**🌐 Live Link:** [job-ecosystem.vercel.app](https://job-ecosystem.vercel.app)

## Recent Updates: Glassmorphism UI Redesign & Optimization
The entire ecosystem has been successfully redesigned with a **unified Glassmorphism Dark Theme**. 
- **Consistent Design Language:** All applications (`hub`, `jobs`, `placement`, `resume`) now share an exact replica of a sleek, deep-blue/cyan color palette and glassmorphism styling (`globals.css` and `tailwind.config.ts`).
- **Glassmorphic Components:** Dynamic, semi-transparent `.glass-card` elements and `radial-gradient` backgrounds have been implemented across all dashboards and layouts.
- **Performance Optimization:** Heavy components, such as the `recharts` radar in the Placement app, have been refactored to use Next.js `next/dynamic` lazy loading, optimizing the initial JavaScript bundle sizes and improving Client-Side Rendering (CSR) performance.

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

## Tech

- **Hub:** Next.js 14, Tailwind, Lucide React.
- **Placement & Jobs:** Next.js 14, Tailwind, Radix UI, Lucide React, shadcn-style components.

## License

Private – KodNest.
