# VibeText

**Share text with a code.** Paste any text, get a short code. Open that code on any device to see your text. No sign-up, no email — just a code.

Built with **Next.js 16**, **Tailwind CSS**, and **PostgreSQL** — ready to host and demo in interviews.

---

## Features

- **Paste → Get code** — Enter text, click "Generate code", receive a 6-character code and shareable link
- **Open by code** — On any device, enter the code or open the link to view the text
- **No authentication** — No accounts, no email; the code is the only key
- **Persistent storage** — Text stored in PostgreSQL; codes remain valid until you deploy a fresh DB
- **Responsive** — Works on desktop and mobile
- **Accessible** — Semantic HTML, ARIA where needed, keyboard-friendly

---

## Tech stack

| Layer        | Tech                |
| ------------ | ------------------- |
| Framework    | Next.js 16 (App Router) |
| Styling      | Tailwind CSS 4      |
| Database     | PostgreSQL          |
| DB client    | `pg` (node-postgres)|
| Language     | TypeScript          |

---

## Quick start (local)

### 1. Install dependencies

```bash
npm install
```

### 2. Set up PostgreSQL

Create a database (e.g. `vibetext` or `sharetxt`). In your SQL client or pgAdmin, run:

```sql
CREATE TABLE IF NOT EXISTS rooms (
  code text PRIMARY KEY,
  content text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set `DATABASE_URL` to your PostgreSQL connection string:

```
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/YOUR_DATABASE_NAME"
```

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Paste text → Generate code → Open the code on another device or tab.

---

## Deploy (production)

### Option A: Vercel + hosted PostgreSQL

1. **Database** — Create a PostgreSQL database (e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com), [Railway](https://railway.app), or any hosted Postgres). Run the same `CREATE TABLE` SQL as above.

2. **Vercel** — Push the repo to GitHub and import the project in [Vercel](https://vercel.com). Add the environment variable:
   - `DATABASE_URL` = your production PostgreSQL connection string (use SSL if required, e.g. `?sslmode=require` for Neon).

3. **Deploy** — Vercel will build and deploy. Your app will be live at `https://your-project.vercel.app`.

### Option B: Other hosts

- **Build:** `npm run build`
- **Start:** `npm start` (set `NODE_ENV=production` and `DATABASE_URL` in the host’s env).
- Ensure the host provides a **Node.js** runtime and supports **server-side** Next.js (not static export only).

---

## Project structure

```
app/
  layout.tsx          # Root layout, metadata
  page.tsx            # Home: paste text, generate code, open by code
  not-found.tsx       # 404 page
  text/[code]/        # View shared text by code
  api/
    text/             # POST: create text, return code & url
    text/[code]/      # GET: fetch text by code
lib/
  db.ts               # PostgreSQL pool + getTextByCode, saveTextWithCode
```

---

## API

| Method | Path           | Description                    |
| ------ | ----------------- | ------------------------------ |
| POST   | `/api/text`       | Body: `{ "content": "string" }`. Returns `{ "code", "url" }`. |
| GET    | `/api/text/[code]`| Returns `{ "code", "content", "createdAt" }` or 404.        |

---

## License

MIT.
