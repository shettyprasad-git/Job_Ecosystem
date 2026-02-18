/**
 * Base URLs for the three apps. In development, run each app on a different port
 * and set these in .env.local, e.g.:
 *   NEXT_PUBLIC_PLACEMENT_URL=http://localhost:3001
 *   NEXT_PUBLIC_JOBS_URL=http://localhost:3002
 *   NEXT_PUBLIC_RESUME_URL=http://localhost:3003
 * In production, use your deployed URLs or same-origin paths if using a reverse proxy.
 */
export const APP_URLS = {
  placement:
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_PLACEMENT_URL
      ? process.env.NEXT_PUBLIC_PLACEMENT_URL
      : "/placement",
  jobs:
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_JOBS_URL
      ? process.env.NEXT_PUBLIC_JOBS_URL
      : "/jobs",
  resume:
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_RESUME_URL
      ? process.env.NEXT_PUBLIC_RESUME_URL
      : "/resume",
};
