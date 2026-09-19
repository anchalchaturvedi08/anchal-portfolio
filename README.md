# Anchal Chaturvedi — Portfolio (MERN)

A dark, bento-grid developer portfolio with a content-management panel. Every piece of
content on the site (profile, projects, skills, experience) lives in MongoDB and is edited
from `/admin` — no code changes are needed to keep it current.

| Layer    | Technology |
|----------|------------|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS v4, Motion, TanStack Query, React Router |
| Backend  | Node.js, Express 5, TypeScript, Zod validation, JWT auth, Helmet, rate limiting |
| Database | MongoDB with Mongoose |
| Hosting  | Vercel — static client plus a serverless function for the API |

## Project structure

An npm workspaces monorepo:

```
api/index.ts   Vercel serverless entry point — hands requests to the Express app
client/        React app (public site + lazy-loaded /admin panel)
  src/sections/     Hero, About, Projects, Skills, Experience, Contact
  src/admin/        Login, profile editor, generic CRUD manager, message inbox
  src/index.css     Design tokens — change --color-accent to re-skin the site
server/        Express API
  src/models/       Mongoose models
  src/routes/       auth, profile, messages   (projects/skills/experience use lib/crud.ts)
  src/db.ts         Cached MongoDB connection, safe for serverless reuse
  src/seedData.ts   Starting content taken from the CV
```

The same Express app serves local development and production; only the entry point differs.

## Run locally

Requires Node.js 20+.

```bash
npm install                          # installs every workspace at once
cp server/.env.example server/.env   # then edit the values
```

**Option A — real database (recommended).** Create a free cluster at MongoDB Atlas, put its
connection string in `server/.env` as `MONGODB_URI`, then:

```bash
npm run seed    # loads the starting content and creates the admin account
npm run dev     # API on :5000, site on http://localhost:5173
```

**Option B — no database installed.** `npm run dev:memory` starts a temporary in-memory MongoDB
(downloaded automatically on first run) and seeds it. Data is discarded on exit.

Sign in at `http://localhost:5173/admin` with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `server/.env`.

If `npm run dev` fails on Windows with `spawn cmd.exe ENOENT`, run the two halves in separate
terminals instead — `npm run dev:api` and `npm run dev:web`.

### Changing the starting content

`npm run seed` only fills collections that are empty, so it never overwrites edits made in the
admin panel. To discard the content and reload it from `server/src/seedData.ts`:

```bash
npm run reseed
```

Contact-form messages are left untouched either way.

## API

| Method | Route | Access |
|--------|-------|--------|
| GET | `/api/portfolio` | public — everything the home page needs in one request |
| GET | `/api/projects`, `/api/skills`, `/api/experience`, `/api/profile` | public |
| POST / PUT / DELETE | `/api/projects/:id?`, `/api/skills/:id?`, `/api/experience/:id?` | admin |
| PUT | `/api/profile` | admin |
| POST | `/api/messages` | public — contact form (rate-limited, honeypot-protected) |
| GET / PATCH / DELETE | `/api/messages`, `/api/messages/:id/read`, `/api/messages/:id` | admin |
| POST | `/api/auth/login` | public (rate-limited) → `{ token }` |

## Deploy to Vercel

Push the repository to GitHub, then import it at vercel.com. Leave the root directory as the
repository root — `vercel.json` already sets the build command, the output directory and the
single-page-app rewrite, and Vercel picks up `api/index.ts` automatically.

Set these environment variables in the Vercel project (Settings → Environment Variables):

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | the Atlas connection string, ending in `/portfolio` |
| `JWT_SECRET` | a long random string — `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `ADMIN_EMAIL` | the admin login email |
| `ADMIN_PASSWORD` | the admin login password |

In Atlas, Network Access must allow `0.0.0.0/0`, because Vercel's outbound IP addresses are not fixed.

The client calls `/api` on its own domain, so `VITE_API_URL` is not needed and there is no CORS
configuration to get wrong. Seed the live database by running `npm run seed` locally with the same
`MONGODB_URI` in `server/.env` — it is the same cluster.

One caveat: rate limiting is held in memory, so on Vercel the limits apply per warm instance
rather than globally. That is acceptable for a contact form; move to a MongoDB-backed store if
abuse ever becomes a problem.

## Customising

- **Accent colour / fonts:** `client/src/index.css`, `@theme` block.
- **Images:** the admin panel takes an image URL. Put files in `client/public/images/` and use
  `/images/name.png`, or paste any https URL (e.g. Cloudinary).
- **Page title and social preview:** `client/index.html`.
