🧮 Calculator App

Live Demo: https://calculator-azure-six-37.vercel.app/

## Features
- Basic calculations
- History stored in database
- Clear history option

## Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: PostgreSQL
- Deployment: Vercel + Supabase

## Supabase migration
1. Create a new Supabase project.
2. Open the SQL editor and run [backend/supabase-schema.sql](backend/supabase-schema.sql).
3. Copy the Supabase PostgreSQL connection string into `backend/.env` as `DATABASE_URL`.
4. Keep `DATABASE_SSL=true` when using Supabase. Set `DATABASE_SSL=false` only for local Postgres.
5. Restart the backend and verify `/api/history` returns rows from the new database.
