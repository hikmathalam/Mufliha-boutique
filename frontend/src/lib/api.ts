/**
 * Central API base URL configuration.
 * In production, set NEXT_PUBLIC_API_URL in your Vercel environment variables.
 * e.g. NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
 */
const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL as string) || "http://localhost:5000";

export default API_BASE;
