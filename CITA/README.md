# CITA

Centralized Intake & Tracking Application (CITA) is a modern React dashboard for managing participant intake, enrollment workflow, calendars, and application progress in one place.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

<!-- GitHub badges: replace YOUR_GITHUB_USERNAME and CITA with your actual repo path -->
[![Stars](https://img.shields.io/github/stars/YOUR_GITHUB_USERNAME/CITA?style=social)](https://github.com/YOUR_GITHUB_USERNAME/CITA/stargazers)
[![Forks](https://img.shields.io/github/forks/YOUR_GITHUB_USERNAME/CITA?style=social)](https://github.com/YOUR_GITHUB_USERNAME/CITA/network/members)
[![Issues](https://img.shields.io/github/issues/YOUR_GITHUB_USERNAME/CITA)](https://github.com/YOUR_GITHUB_USERNAME/CITA/issues)
[![Last Commit](https://img.shields.io/github/last-commit/YOUR_GITHUB_USERNAME/CITA)](https://github.com/YOUR_GITHUB_USERNAME/CITA/commits/main)

## Why CITA

CITA helps teams move from disconnected updates to a clear, actionable view of participant status.

- Track participant lifecycle from intake through enrollment.
- Visualize key metrics with dashboard charts and summaries.
- Organize participant details, timelines, and stage actions.
- Manage schedules through a participant-focused calendar view.
- Improve consistency with reusable, accessible UI components.

## Key Screens

- Dashboard
	- Program enrollment charts, stage stats, and recent activity.
- Participants
	- Participant listing with drill-down detail view.
- New Intake
	- Intake workflow for capturing new participant records.
- My Application
	- Application status and full application paths.
- Participant Calendar
	- Calendar-based participant scheduling and visibility.
- User Logs
	- User activity and operational tracking.

## Tech Stack

- Next.js 15 (App Router)
- React 18
- Tailwind CSS
- React Query
- Recharts
- Radix UI primitives
- Supabase (`@supabase/ssr`)

## Project Structure

```text
CITA/
	src/
		app/
			(app)/
		components/
			dashboard/
			layout/
			participant/
			shared/
			ui/
		lib/
		pages/
		api/
		hooks/
		utils/
	supabase/
		migrations/
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/CITA.git
cd CITA
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create a `.env.local` file in the project root and add your values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key

# Optional table overrides
NEXT_PUBLIC_SUPABASE_PARTICIPANTS_TABLE=participants
NEXT_PUBLIC_SUPABASE_USERS_TABLE=profiles

# Optional local bypass profile (used when no Supabase auth session exists)
NEXT_PUBLIC_LOCAL_BYPASS_AUTH=true
NEXT_PUBLIC_LOCAL_USER_ID=local-dev-user
NEXT_PUBLIC_LOCAL_USER_EMAIL=admin@local.dev
NEXT_PUBLIC_LOCAL_USER_NAME=Local Admin
NEXT_PUBLIC_LOCAL_USER_ROLE=intake_admin
NEXT_PUBLIC_AUTH_REDIRECT_PATH=/login
```

### 4. Run locally

```bash
npm run dev
```

Open the local URL printed in the terminal (typically `http://localhost:3000`).

## Available Scripts

```bash
npm run dev        # Start local dev server
npm run build      # Production build
npm run preview    # Start production server (after build)
npm run lint       # Lint code
npm run lint:fix   # Auto-fix lint issues
npm run typecheck  # Type-check via jsconfig/tsc
```

## Environment Notes

- The app now runs locally using Supabase instead of Base44.
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are required for live reads/writes.
- `NEXT_PUBLIC_LOCAL_BYPASS_AUTH=true` lets you run locally without an active Supabase session.
- Email notifications are stubbed to `console.info` by default in local mode.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
