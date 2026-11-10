# Pearl & SiRi Love App ❤️ — PostgreSQL + Render

This version keeps the supplied frontend and artwork and changes permanent message storage from SQLite to PostgreSQL.

## Preserved in this build
- `I LOVE YOU THALAIVAREYYY` page content and existing layout
- Pearl/Joker, SiRi/Witch, love and inbox background artwork
- Butterfly animations and three-picture layout
- `PearlSiRi` login (recommended: set it as `LOVE_APP_PASSWORD` on Render)
- Sending messages, inbox loading, sender labels and permanent message history

## Existing message history
The original SQLite database contained one saved SiRi message. It has been copied into `data/messages-seed.json`. On first startup, the app creates the PostgreSQL table and imports this message. The import is safe to repeat and will not duplicate existing IDs.

## Run locally
1. Install Node.js 18 or newer and PostgreSQL.
2. Create a PostgreSQL database, for example `pearl_siri`.
3. Open a terminal in this project folder and run `npm install`.
4. Set the database connection string and password.

Windows PowerShell:
```powershell
$env:DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/pearl_siri"
$env:LOVE_APP_PASSWORD="PearlSiRi"
npm start
```

macOS/Linux:
```bash
export DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/pearl_siri"
export LOVE_APP_PASSWORD="PearlSiRi"
npm start
```

Open `http://localhost:3000`.

## Deploy on Render
1. Push this project folder to a GitHub repository. Do not upload `node_modules`.
2. In Render, create a **PostgreSQL** database.
3. Create a **Web Service** from the GitHub repository.
4. Set **Build Command** to `npm install` and **Start Command** to `npm start`.
5. In the web service's Environment settings, add:
   - `DATABASE_URL` = the PostgreSQL **Internal Database URL** from your Render database (use the External URL only if connecting from outside Render).
   - `LOVE_APP_PASSWORD` = `PearlSiRi` (or choose a different private password).
   - `NODE_ENV` = `production`
6. Deploy. On first startup, the app creates the table and imports the included original message.

## Important
- Keep the Render PostgreSQL database. Message history lives there, not in the web service filesystem.
- Do not delete/recreate the PostgreSQL database if you want to keep messages.
- The inbox endpoint requires the login password. Message sending remains available through the app's message form.
- For security, change the default `PearlSiRi` password in Render environment variables before sharing the site publicly.
