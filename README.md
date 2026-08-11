# WARCO INDIA — Website + Admin Dashboard

Wildlife Awareness and Reptile Conservation Organization
ವನ್ಯಜೀವಿ ಜಾಗೃತಿ ಹಾಗೂ ಉರಗ ಸಂರಕ್ಷಣಾ ಸಂಸ್ಥೆ

## What this is

Two things in one project:

1. **The public website** — no login needed. Bilingual (English / ಕನ್ನಡ), light/dark
   mode, rescue services, an **Awareness** page (stacked-carousel photos + a
   bilingual description + a video, about snake-awareness sessions for villages and
   schools, delivered with a translator), a **Training** page (Police / Forest
   Department / Army only, with a "Book Training" request form), a **Research**
   page (title + description cards), a message widget, a "24×7 Active" status
   badge, and a service-area map.
2. **An admin dashboard** at `/admin` — login required. From here your team can
   change the status badge text, the homepage headline, both phone numbers, manage
   the Awareness carousel images/description/video, the Training description/image/
   video/contact info and its incoming bookings, and add/remove Research entries —
   all of it updates the public site immediately, with no code changes or
   redeploying.

## Stack

- **client/** — React.js, React Router, Bootstrap 5
- **server/** — Node.js, Express, **PostgreSQL** (via the `pg` driver)

## A note on login security

You asked for login restricted by IP address and MAC address. A quick, important
clarification: **a MAC address is never visible to a website** — it only exists on
your local network and gets stripped away the moment a request leaves your router.
No website (not even large ones) can check it. That's not a limitation of this
project specifically, it's how the internet works.

What's actually built in, which gets you the same real-world outcome:

- Two real accounts (see below), password-protected, sessions expire after 12 hours
- Passwords are hashed (never stored in plain text) and changeable from the dashboard
- An **IP allowlist** for the login endpoint — restricts logins to specific IP
  address(es). It's currently turned **on** and set to `192.168.1.7` (your office/
  home network IP) in `server/.env`. Because that address usually only applies
  while you're on that same local network, add any other trusted IPs the same way
  (comma-separated), and remove the value entirely if you ever get locked out from
  a different network. See `server/.env.example` for details.
  > **Note:** `192.168.1.7` is a *private* network address — it only matches when
  > the server itself is running on that same local network (e.g. testing on your
  > Windows machine). Once you deploy the site to the internet, the server will see
  > each visitor's *public* IP address instead, so you'll need to replace this with
  > your real public IP (search "what is my IP") for the allowlist to keep working.

## Default accounts — change these immediately

The first time the server starts, it creates two accounts automatically:

| Username | Password         | Role   |
|----------|------------------|--------|
| admin    | WarcoAdmin@123   | admin  |
| warco    | WarcoTeam@123    | editor |

Log in at `/admin/login`, go to the **Change Password** tab, and change both.

## Setting up PostgreSQL (one-time)

You need PostgreSQL installed and running. If you don't have it:

- **Windows/Mac**: install [Postgres.app](https://postgresapp.com/) (Mac) or the
  installer from [postgresql.org](https://www.postgresql.org/download/) (Windows)
- **Linux**: `sudo apt install postgresql postgresql-contrib`

Once it's running, create the database and load the schema:

```
createdb warco_india
psql -d warco_india -f server/db/schema.sql
```

(If your PostgreSQL user isn't the default `postgres` user, adjust accordingly —
e.g. `psql -U youruser -d warco_india -f server/db/schema.sql`.)

## Configure the server

```
cd server
cp .env.example .env
```

Open `.env` and set `DATABASE_URL` to match your database, e.g.:

```
DATABASE_URL=postgres://postgres:yourpassword@localhost:5432/warco_india
```

Also set `JWT_SECRET` to any long random string — this signs login sessions.

## Running it locally

### 1. Start the backend
```
cd server
npm install
npm start
```
Runs the API on **http://localhost:5000**. On first run it prints the two default
login accounts to the terminal — that's normal.

### 2. Start the frontend (in a second terminal)
```
cd client
npm install
npm start
```
Opens the site at **http://localhost:3000**, responsive on phone, tablet and
desktop. The admin dashboard is at **http://localhost:3000/admin/login**
(also linked quietly at the bottom of the site footer, "Staff Login").

## Folder layout

```
warco-india/
  client/                  React front-end
    src/
      pages/                Home, About, Services, Awareness, Training, Research, Contact
      pages/admin/           AdminLogin, AdminDashboard (login-protected)
      components/            Navbar, Footer, ChatWidget, StatusBadge, LocationMap,
                              StackedCarousel, VideoEmbed, ...
      data/content.js        every piece of static bilingual text — edit freely
  server/                  Express back-end
    db/
      schema.sql            PostgreSQL table definitions — run once
      pool.js                database connection
    routes/
      auth.js                login, session check, change password
      siteContent.js         GET (public) / PUT (admin) status text, quote, phones
      awareness.js            GET (public) / PUT (admin) description+video, images CRUD
      training.js             GET (public) / PUT (admin) description+media+contact,
                               POST /book (public booking), GET/PUT /bookings (admin)
      research.js              GET (public) / POST + PUT + DELETE (admin) research items
      contact.js               rescue requests
    utils/
      notify.js                emails (and optionally WhatsApp/SMS via Twilio) the
                                admin whenever a training booking comes in
    uploads/                 uploaded awareness/training images live here as plain files
```

## What you should customize before going live

1. **Static text and phone/email defaults** — `client/src/data/content.js` (the `ORG`
   object at the top). Anything you change from the admin dashboard afterwards will
   override the phone numbers and homepage headline shown here.
2. **Logo** — `client/public/logo.jpg` is your real WARCO mark; swap the file to
   update it everywhere (navbar + browser tab icon).
3. **Training-booking notifications** — when someone books a training, it's always
   saved and visible in Admin → Training → Bookings. To also get it by email, fill
   in `NOTIFY_EMAIL_TO`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` in
   `server/.env` (nodemailer is already installed). WhatsApp/SMS is optional and
   needs a paid Twilio account — see the comment at the top of
   `server/utils/notify.js` for the two extra steps.
4. **Awareness / Training content** — add your real description text, upload photos
   (Awareness carousel), and a training image, from the admin dashboard once the
   site is running; there's nothing to edit in code for these.
5. **Upgrading an existing database?** The old `gallery` table is no longer used —
   see the comment at the bottom of `server/db/schema.sql` for the one-line command
   to drop it once you've saved any photos you want to keep.
6. **Production deployment** — build the client with `npm run build` inside
   `client/` (produces a static `build/` folder you can host anywhere), and deploy
   the server + a PostgreSQL database to any Node host (Render, Railway, a VPS,
   etc). Set `DATABASE_URL`, `JWT_SECRET` and `ALLOWED_LOGIN_IPS` (see the IP note
   above) as real environment variables there — don't reuse the local development
   values.
