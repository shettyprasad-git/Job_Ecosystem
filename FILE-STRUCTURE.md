# Job Ecosystem – File Structure

```
Job Ecosystem/                    ← repo root
├── .gitignore
├── README.md
├── FILE-STRUCTURE.md             ← this file
│
└── apps/
    │
    ├── hub/                      ← Landing page (KodNest Job Ecosystem home)
    │   ├── app/
    │   │   ├── config.ts         # APP_URLS for placement, jobs, resume
    │   │   ├── globals.css
    │   │   ├── layout.tsx
    │   │   └── page.tsx          # Home page with 3 app cards
    │   ├── next.config.mjs
    │   ├── package.json
    │   ├── postcss.config.mjs
    │   ├── tailwind.config.ts
    │   └── tsconfig.json
    │
    ├── placement/                ← Placement Readiness Platform
    │   ├── app/
    │   │   ├── dashboard/        # Dashboard layout + pages
    │   │   │   ├── assessments/
    │   │   │   ├── history/
    │   │   │   ├── practice/
    │   │   │   ├── profile/
    │   │   │   ├── resources/
    │   │   │   ├── layout.tsx
    │   │   │   └── page.tsx
    │   │   ├── prp/              # PRP flows (07-test, 08-ship, proof)
    │   │   │   ├── 07-test/
    │   │   │   ├── 08-ship/
    │   │   │   └── proof/
    │   │   ├── results/
    │   │   │   └── [id]/         # Result detail page
    │   │   ├── globals.css
    │   │   ├── layout.tsx
    │   │   └── page.tsx          # JD Analyzer entry
    │   ├── components/
    │   │   ├── dashboard/
    │   │   │   └── skill-breakdown-chart.tsx
    │   │   ├── layout/
    │   │   │   ├── dashboard-header.tsx
    │   │   │   ├── dashboard-nav.tsx
    │   │   │   ├── dashboard-nav-items.ts
    │   │   │   └── dashboard-sidebar.tsx
    │   │   └── ui/               # shadcn-style components
    │   │       ├── accordion.tsx
    │   │       ├── alert-dialog.tsx
    │   │       ├── alert.tsx
    │   │       ├── avatar.tsx
    │   │       ├── badge.tsx
    │   │       ├── button.tsx
    │   │       ├── calendar.tsx
    │   │       ├── card.tsx
    │   │       ├── carousel.tsx
    │   │       ├── chart.tsx
    │   │       ├── checkbox.tsx
    │   │       ├── collapsible.tsx
    │   │       ├── dialog.tsx
    │   │       ├── dropdown-menu.tsx
    │   │       ├── form.tsx
    │   │       ├── input.tsx
    │   │       ├── label.tsx
    │   │       ├── menubar.tsx
    │   │       ├── popover.tsx
    │   │       ├── progress.tsx
    │   │       ├── radio-group.tsx
    │   │       ├── scroll-area.tsx
    │   │       ├── select.tsx
    │   │       ├── separator.tsx
    │   │       ├── sheet.tsx
    │   │       ├── sidebar.tsx
    │   │       ├── skeleton.tsx
    │   │       ├── slider.tsx
    │   │       ├── switch.tsx
    │   │       ├── table.tsx
    │   │       ├── tabs.tsx
    │   │       ├── textarea.tsx
    │   │       ├── toast.tsx
    │   │       ├── toaster.tsx
    │   │       └── tooltip.tsx
    │   ├── hooks/
    │   │   ├── use-mobile.tsx
    │   │   └── use-toast.ts
    │   ├── lib/
    │   │   ├── analysis.ts
    │   │   ├── company-intel.ts
    │   │   ├── history.ts
    │   │   ├── placeholder-images.ts
    │   │   ├── placeholder-images.json
    │   │   ├── skills.ts
    │   │   ├── types.ts
    │   │   └── utils.ts
    │   ├── next.config.mjs
    │   ├── package.json
    │   ├── postcss.config.mjs
    │   ├── tailwind.config.ts
    │   └── tsconfig.json
    │
    └── jobs/                     ← Job Notification Tracker
        ├── app/
        │   ├── dashboard/
        │   │   └── page.tsx      # Job listings dashboard
        │   ├── digest/
        │   ├── proof/
        │   ├── saved/
        │   ├── settings/
        │   ├── ship/
        │   ├── actions.ts
        │   ├── globals.css
        │   ├── layout.tsx
        │   └── page.tsx          # Redirects to dashboard
        ├── ai/                   # AI / Genkit (if used)
        │   ├── dev.ts
        │   ├── flows/
        │   │   └── ai-audit-design-consistency.ts
        │   └── genkit.ts
        ├── components/
        │   ├── job-tracker/
        │   │   ├── filter-bar.tsx
        │   │   ├── header.tsx
        │   │   ├── job-card.tsx
        │   │   ├── logo.tsx
        │   │   ├── nav.tsx
        │   │   ├── page-placeholder.tsx
        │   │   ├── status-dropdown.tsx
        │   │   └── view-job-modal.tsx
        │   ├── kodnest/
        │   │   ├── ai-audit-tool.tsx
        │   │   ├── clipboard-button.tsx
        │   │   ├── context-header.tsx
        │   │   ├── primary-workspace.tsx
        │   │   ├── proof-footer.tsx
        │   │   ├── secondary-panel.tsx
        │   │   └── top-bar.tsx
        │   └── ui/               # same shadcn-style set as placement
        │       └── (accordion … tooltip)
        ├── hooks/
        │   ├── use-local-storage.ts
        │   ├── use-mobile.tsx
        │   └── use-toast.ts
        ├── lib/
        │   ├── jobs.ts
        │   ├── placeholder-images.ts
        │   ├── placeholder-images.json
        │   ├── types.ts
        │   └── utils.ts
        ├── next.config.mjs
        ├── package.json
        ├── postcss.config.mjs
        ├── tailwind.config.ts
        └── tsconfig.json
```

## Summary

| Path            | Purpose                                      |
|-----------------|----------------------------------------------|
| **apps/hub**    | Single landing page; links to placement, jobs, resume |
| **apps/placement** | JD analysis, readiness score, dashboard, practice, results |
| **apps/jobs**   | Job listings, saved jobs, status tracking, settings, digest, proof, ship |

Each app is a standalone Next.js app with its own `package.json` and config; Vercel uses **Root Directory** `apps/hub`, `apps/placement`, or `apps/jobs` per project.
