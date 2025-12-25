# Next.js Migration

The frontend has been migrated to Next.js in the `frontend-nextjs` directory.

## Getting Started

1. Navigate to the directory:
   ```bash
   cd frontend-nextjs
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Changes Made

- Created a new Next.js 15 (App Router) project.
- Migrated all pages from `src/pages` to `src/app` (Home, Login, Signup, Dashboard, About, Contact).
- Migrated `src/components`, `src/hooks`, `src/lib`.
- Configured Tailwind CSS v4 with custom theme variables.
- Updated routing to use `next/link` and `next/navigation`.
- Added `"use client"` directives where necessary (e.g., components using hooks).
- Preserved the original design and functionality.

## Key File Locations

- Pages: `src/app/`
- Components: `src/components/`
- Global Styles: `src/app/globals.css`
- Tailwind Config: `tailwind.config.ts` (referenced by globals.css)
