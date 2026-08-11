-- WARCO INDIA — PostgreSQL schema
-- Run this once against a fresh database, e.g.:
--   psql "$DATABASE_URL" -f server/db/schema.sql

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(60) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          VARCHAR(20) NOT NULL DEFAULT 'editor',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Single-row table holding everything the admin dashboard can edit and the
-- public site displays: status badge text, hero quote, phone numbers.
CREATE TABLE IF NOT EXISTS site_content (
  id              SMALLINT PRIMARY KEY DEFAULT 1,
  status_text     TEXT NOT NULL DEFAULT '24×7 Rescue Helpline Active',
  hero_quote      TEXT,
  phone_primary   VARCHAR(30) NOT NULL DEFAULT '+91 98765 43210',
  phone_secondary VARCHAR(30) NOT NULL DEFAULT '+91 91234 56789',
  updated_at      TIMESTAMPTZ,
  updated_by      VARCHAR(60),
  CONSTRAINT single_row CHECK (id = 1)
);

-- ---------------------------------------------------------------------------
-- Awareness: bilingual description + video + a stacked-carousel image set,
-- all editable from the admin dashboard.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS awareness_content (
  id              SMALLINT PRIMARY KEY DEFAULT 1,
  description_en  TEXT,
  description_kn  TEXT,
  video_url       TEXT,
  updated_at      TIMESTAMPTZ,
  updated_by      VARCHAR(60),
  CONSTRAINT single_row_awareness CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS awareness_images (
  id           BIGSERIAL PRIMARY KEY,
  filename     TEXT NOT NULL,
  url          TEXT NOT NULL,
  caption      TEXT,
  sort_order   INT NOT NULL DEFAULT 0,
  uploaded_by  VARCHAR(60),
  uploaded_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Training: restricted to Police / Forest / Army audiences. Bilingual
-- description + image + video, plus a "Book Training" request queue.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS training_content (
  id              SMALLINT PRIMARY KEY DEFAULT 1,
  description_en  TEXT,
  description_kn  TEXT,
  image_url       TEXT,
  video_url       TEXT,
  contact_phone   VARCHAR(30),
  contact_email   VARCHAR(120),
  updated_at      TIMESTAMPTZ,
  updated_by      VARCHAR(60),
  CONSTRAINT single_row_training CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS training_bookings (
  id              BIGSERIAL PRIMARY KEY,
  name            VARCHAR(120) NOT NULL,
  department      VARCHAR(60) NOT NULL, -- Police / Forest / Army
  designation     VARCHAR(120),
  phone           VARCHAR(30) NOT NULL,
  email           VARCHAR(120),
  location        VARCHAR(200),
  preferred_date  DATE,
  message         TEXT,
  status          VARCHAR(20) NOT NULL DEFAULT 'new', -- new / contacted / scheduled / done
  received_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS training_images (
  id           BIGSERIAL PRIMARY KEY,
  filename     TEXT NOT NULL,
  url          TEXT NOT NULL,
  caption      TEXT,
  sort_order   INT NOT NULL DEFAULT 0,
  uploaded_by  VARCHAR(60),
  uploaded_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Rescue Services: a single hero image + video shown on the public
-- Services page, editable from the admin dashboard.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS services_content (
  id              SMALLINT PRIMARY KEY DEFAULT 1,
  image_url       TEXT,
  video_url       TEXT,
  updated_at      TIMESTAMPTZ,
  updated_by      VARCHAR(60),
  CONSTRAINT single_row_services CHECK (id = 1)
);

-- ---------------------------------------------------------------------------
-- Research: simple title + description (+ optional link) cards.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS research_items (
  id           BIGSERIAL PRIMARY KEY,
  title        TEXT NOT NULL,
  description  TEXT,
  link_url     TEXT,
  sort_order   INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS submissions (
  id            BIGSERIAL PRIMARY KEY,
  name          VARCHAR(120) NOT NULL,
  phone         VARCHAR(30) NOT NULL,
  email         VARCHAR(120),
  location      VARCHAR(200),
  request_type  VARCHAR(60) NOT NULL,
  message       TEXT,
  received_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed the single site_content row if it doesn't exist yet.
INSERT INTO site_content (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO awareness_content (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO training_content (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO services_content (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Seed media: Awareness carousel, Training gallery, Rescue Services hero,
-- and the shared field-video, taken from the school/forest-department visits.
-- Safe to re-run: each insert is guarded so it won't duplicate rows.
-- ---------------------------------------------------------------------------
INSERT INTO awareness_images (filename, url, caption, sort_order)
SELECT * FROM (VALUES
  ('seed-awareness-1.jpg', '/uploads/seed-awareness-1.jpg', 'School awareness drive with Youth for Seva, Tumakuru', 0),
  ('seed-awareness-2.jpg', '/uploads/seed-awareness-2.jpg', 'Snake awareness talk for students', 1),
  ('seed-awareness-3.webp', '/uploads/seed-awareness-3.webp', 'Village school awareness session', 2),
  ('seed-awareness-4.webp', '/uploads/seed-awareness-4.webp', 'Open-ground awareness talk with local officials', 3)
) AS v(filename, url, caption, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM awareness_images WHERE filename = v.filename);

UPDATE awareness_content
SET video_url = '/uploads/seed-warco-video.mp4', updated_at = now(), updated_by = 'seed'
WHERE id = 1 AND (video_url IS NULL OR video_url = '');

INSERT INTO training_images (filename, url, caption, sort_order)
SELECT * FROM (VALUES
  ('seed-training-1.jpg', '/uploads/seed-training-1.jpg', 'Forest Technical & Administrative Training Institute, Kadugodi', 0),
  ('seed-training-2.jpg', '/uploads/seed-training-2.jpg', 'Briefing forest department field staff', 1),
  ('seed-training-3.jpg', '/uploads/seed-training-3.jpg', 'Classroom session for forest guards', 2),
  ('seed-training-4.jpg', '/uploads/seed-training-4.jpg', 'Live snake-handling demonstration for forest staff', 3),
  ('seed-training-5.jpg', '/uploads/seed-training-5.jpg', 'Certificate distribution at Karnataka Forest Department', 4),
  ('seed-training-6.jpg', '/uploads/seed-training-6.jpg', 'Safe capture demonstration during training', 5),
  ('seed-training-7.webp', '/uploads/seed-training-7.webp', 'Field training walk in forest habitat', 6),
  ('seed-training-8.webp', '/uploads/seed-training-8.webp', 'Training batch group photo with certificates', 7)
) AS v(filename, url, caption, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM training_images WHERE filename = v.filename);

UPDATE training_content
SET image_url = COALESCE(NULLIF(image_url, ''), '/uploads/seed-training-1.jpg'),
    video_url = COALESCE(NULLIF(video_url, ''), '/uploads/seed-warco-video.mp4'),
    updated_at = now(), updated_by = 'seed'
WHERE id = 1;

UPDATE services_content
SET image_url = COALESCE(NULLIF(image_url, ''), '/uploads/seed-training-6.jpg'),
    video_url = COALESCE(NULLIF(video_url, ''), '/uploads/seed-warco-video.mp4'),
    updated_at = now(), updated_by = 'seed'
WHERE id = 1;

INSERT INTO research_items (title, description, link_url, sort_order)
SELECT * FROM (VALUES
  (
    'Human-Snake Conflict Patterns in Peri-Urban Karnataka',
    'A field survey of rescue-call data from villages and small towns, mapping which snake species are most commonly encountered near homes and farms, and at what time of year.',
    NULL,
    0
  ),
  (
    'Effectiveness of Translator-Led Awareness Sessions on Snakebite First Aid',
    'Pre- and post-session assessment of school and village audiences, measuring how well translator-delivered awareness talks improve correct snakebite first-aid knowledge and reduce fear-driven killing of non-venomous snakes.',
    NULL,
    1
  ),
  (
    'Standard Operating Procedures for Departmental Snake-Handling Training',
    'A working note on the training curriculum used with Police, Forest Department and Army personnel — covering safe capture, species identification and post-rescue release protocol.',
    NULL,
    2
  )
) AS v(title, description, link_url, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM research_items WHERE title = v.title);

-- If you are upgrading an existing WARCO INDIA database (not a fresh install),
-- the old gallery table is no longer used by the app. It's safe to drop once
-- you've moved any images you want to keep:
--   DROP TABLE IF EXISTS gallery;
