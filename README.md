# StayRooms

StayRooms is a Vite + React (TypeScript) application for browsing, booking, and managing verified hostel and PG rooms across India. Customers can search and inquire about rooms while hosts can publish listings, review inquiries, and update booking statuses.

## Tech stack
- Vite + React 18 with TypeScript
- Tailwind CSS, Radix UI, and `class-variance-authority` for UI styling and design-system utilities
- Supabase for authentication and data storage
- TanStack Query for client caching, Lucide icons, Recharts charts, and day-fns for date handling

## Getting started
1. Install dependencies:
   ```sh
   npm install
   ```
2. Copy `.env.example` (if available) to `.env` and fill in the Supabase URL/Key plus any other secrets.
3. Start the development server:
   ```sh
   npm run dev -- --host 0.0.0.0 --port 8080
   ```
4. Build and preview production output:
   ```sh
   npm run build
   npm run preview
   ```

> Always run `npm run lint` before committing to keep ESLint/TypeScript rules satisfied.

## Available scripts
| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server (hot reloading) |
| `npm run build` | Bundle the app for production |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across the project |

## Deployment
Deploy the `dist` directory produced by `npm run build` to your chosen hosting provider (Vercel, Netlify, Cloudflare Pages, etc.). Provide the same environment variables (Supabase URL/KEY, etc.) your local `.env` file uses.

## Development notes
- Shared UI primitives live under `src/components/ui`; reuse the existing Radix/Tailwind components and variants.
- Hooks are located in `src/hooks`; wrap routes needing authentication with the `AuthProvider` and `ProtectedRoute` helpers in `src/App.tsx`.
- Keep logging minimal and never expose secrets directly in code.
