// @ts-nocheck
/* eslint-disable */
import express from "express";
import cors from "cors";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import pg from "pg";
import { eq, desc, asc } from "drizzle-orm";
import { z } from "zod";
import multer from "multer";

// ─── DB ────────────────────────────────────────────────────────────────────────
const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set. Add it in Vercel environment variables.");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL ?? "" });
const db = drizzle(pool);

// ─── Schema ────────────────────────────────────────────────────────────────────
const blogPostsTable = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleHindi: text("title_hindi").notNull(),
  content: text("content").notNull(),
  contentHindi: text("content_hindi").notNull(),
  author: text("author").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

const galleryAlbumsTable = pgTable("gallery_albums", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameHindi: text("name_hindi").notNull(),
  description: text("description"),
  coverImageUrl: text("cover_image_url"),
  eventDate: text("event_date"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

const galleryPhotosTable = pgTable("gallery_photos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleHindi: text("title_hindi").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  albumId: integer("album_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

const staffTable = pgTable("staff", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameHindi: text("name_hindi").notNull(),
  role: text("role").notNull(),
  roleHindi: text("role_hindi").notNull(),
  photoUrl: text("photo_url"),
  order: integer("order").notNull().default(0),
  bio: text("bio"),
  bioHindi: text("bio_hindi"),
  bioEnabled: boolean("bio_enabled").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

const siteSettingsTable = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Validators ────────────────────────────────────────────────────────────────
const IdParam = z.object({ id: z.coerce.number().int().positive() });
const BlogBody = z.object({ title: z.string().min(1), titleHindi: z.string().min(1), content: z.string().min(1), contentHindi: z.string().min(1), author: z.string().min(1), imageUrl: z.string().optional().nullable() });
const AlbumBody = z.object({ name: z.string().min(1), nameHindi: z.string().min(1), description: z.string().optional().nullable(), coverImageUrl: z.string().optional().nullable(), eventDate: z.string().optional().nullable() });
const PhotoBody = z.object({ title: z.string().min(1), titleHindi: z.string().min(1), imageUrl: z.string().min(1), category: z.string().min(1), albumId: z.number().int().nullable().optional() });
const StaffBody = z.object({ name: z.string().min(1), nameHindi: z.string().min(1), role: z.string().min(1), roleHindi: z.string().min(1), photoUrl: z.string().optional().nullable(), order: z.number().int().default(0), bio: z.string().optional().nullable(), bioHindi: z.string().optional().nullable(), bioEnabled: z.boolean().default(false) });
const LoginBody = z.object({ username: z.string().min(1), password: z.string().min(1) });

// ─── App ───────────────────────────────────────────────────────────────────────
const app = express();
app.use(cors({ credentials: true, origin: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);

const PgSession = connectPgSimple(session);
app.use(
  session({
    store: new PgSession({ pool, createTableIfMissing: true }),
    secret: process.env.SESSION_SECRET ?? "mni-school-secret-2024",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// ─── Auth guard ────────────────────────────────────────────────────────────────
function requireAdmin(req, res, next) {
  if (!req.session?.isAdmin) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

// ─── Auth routes ───────────────────────────────────────────────────────────────
const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "mni@school2024";

app.post("/api/auth/login", async (req, res) => {
  const p = LoginBody.safeParse(req.body);
  if (!p.success) { res.status(400).json({ error: "Invalid request" }); return; }
  if (p.data.username === ADMIN_USERNAME && p.data.password === ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    req.session.username = p.data.username;
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

app.get("/api/auth/me", (req, res) => {
  if (req.session?.isAdmin) res.json({ isAdmin: true, username: req.session.username });
  else res.status(401).json({ isAdmin: false });
});

// ─── Blog ──────────────────────────────────────────────────────────────────────
app.get("/api/blog", async (_req, res) => {
  const posts = await db.select().from(blogPostsTable).orderBy(desc(blogPostsTable.createdAt));
  res.json(posts);
});

app.get("/api/blog/:id", async (req, res) => {
  const p = IdParam.safeParse(req.params);
  if (!p.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const [post] = await db.select().from(blogPostsTable).where(eq(blogPostsTable.id, p.data.id));
  if (!post) { res.status(404).json({ error: "Not found" }); return; }
  res.json(post);
});

app.post("/api/blog", requireAdmin, async (req, res) => {
  const p = BlogBody.safeParse(req.body);
  if (!p.success) { res.status(400).json({ error: p.error.message }); return; }
  const [post] = await db.insert(blogPostsTable).values(p.data).returning();
  res.status(201).json(post);
});

app.put("/api/blog/:id", requireAdmin, async (req, res) => {
  const id = IdParam.safeParse(req.params);
  if (!id.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const p = BlogBody.partial().safeParse(req.body);
  if (!p.success) { res.status(400).json({ error: p.error.message }); return; }
  const [post] = await db.update(blogPostsTable).set({ ...p.data, updatedAt: new Date() }).where(eq(blogPostsTable.id, id.data.id)).returning();
  if (!post) { res.status(404).json({ error: "Not found" }); return; }
  res.json(post);
});

app.delete("/api/blog/:id", requireAdmin, async (req, res) => {
  const p = IdParam.safeParse(req.params);
  if (!p.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(blogPostsTable).where(eq(blogPostsTable.id, p.data.id));
  res.sendStatus(204);
});

// ─── Gallery Albums ────────────────────────────────────────────────────────────
app.get("/api/gallery/albums", async (_req, res) => {
  const albums = await db.select().from(galleryAlbumsTable).orderBy(desc(galleryAlbumsTable.createdAt));
  res.json(albums);
});

app.get("/api/gallery/albums/:id/photos", async (req, res) => {
  const p = IdParam.safeParse(req.params);
  if (!p.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const photos = await db.select().from(galleryPhotosTable).where(eq(galleryPhotosTable.albumId, p.data.id)).orderBy(asc(galleryPhotosTable.createdAt));
  res.json(photos);
});

app.post("/api/gallery/albums", requireAdmin, async (req, res) => {
  const p = AlbumBody.safeParse(req.body);
  if (!p.success) { res.status(400).json({ error: p.error.message }); return; }
  const [album] = await db.insert(galleryAlbumsTable).values(p.data).returning();
  res.status(201).json(album);
});

app.put("/api/gallery/albums/:id", requireAdmin, async (req, res) => {
  const id = IdParam.safeParse(req.params);
  if (!id.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const p = AlbumBody.partial().safeParse(req.body);
  if (!p.success) { res.status(400).json({ error: p.error.message }); return; }
  const [album] = await db.update(galleryAlbumsTable).set(p.data).where(eq(galleryAlbumsTable.id, id.data.id)).returning();
  res.json(album);
});

app.delete("/api/gallery/albums/:id", requireAdmin, async (req, res) => {
  const p = IdParam.safeParse(req.params);
  if (!p.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(galleryPhotosTable).where(eq(galleryPhotosTable.albumId, p.data.id));
  await db.delete(galleryAlbumsTable).where(eq(galleryAlbumsTable.id, p.data.id));
  res.sendStatus(204);
});

// ─── Gallery Photos ────────────────────────────────────────────────────────────
app.get("/api/gallery", async (_req, res) => {
  const photos = await db.select().from(galleryPhotosTable).orderBy(desc(galleryPhotosTable.createdAt));
  res.json(photos);
});

app.post("/api/gallery", requireAdmin, async (req, res) => {
  const p = PhotoBody.safeParse(req.body);
  if (!p.success) { res.status(400).json({ error: p.error.message }); return; }
  const [photo] = await db.insert(galleryPhotosTable).values(p.data).returning();
  res.status(201).json(photo);
});

app.put("/api/gallery/:id", requireAdmin, async (req, res) => {
  const id = IdParam.safeParse(req.params);
  if (!id.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const p = PhotoBody.partial().safeParse(req.body);
  if (!p.success) { res.status(400).json({ error: p.error.message }); return; }
  const [photo] = await db.update(galleryPhotosTable).set(p.data).where(eq(galleryPhotosTable.id, id.data.id)).returning();
  res.json(photo);
});

app.delete("/api/gallery/:id", requireAdmin, async (req, res) => {
  const p = IdParam.safeParse(req.params);
  if (!p.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(galleryPhotosTable).where(eq(galleryPhotosTable.id, p.data.id));
  res.sendStatus(204);
});

// ─── Staff ─────────────────────────────────────────────────────────────────────
app.get("/api/staff", async (_req, res) => {
  const staff = await db.select().from(staffTable).orderBy(asc(staffTable.order));
  res.json(staff);
});

app.post("/api/staff", requireAdmin, async (req, res) => {
  const p = StaffBody.safeParse(req.body);
  if (!p.success) { res.status(400).json({ error: p.error.message }); return; }
  const [member] = await db.insert(staffTable).values(p.data).returning();
  res.status(201).json(member);
});

app.put("/api/staff/:id", requireAdmin, async (req, res) => {
  const id = IdParam.safeParse(req.params);
  if (!id.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const p = StaffBody.partial().safeParse(req.body);
  if (!p.success) { res.status(400).json({ error: p.error.message }); return; }
  const [member] = await db.update(staffTable).set(p.data).where(eq(staffTable.id, id.data.id)).returning();
  res.json(member);
});

app.delete("/api/staff/:id", requireAdmin, async (req, res) => {
  const p = IdParam.safeParse(req.params);
  if (!p.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(staffTable).where(eq(staffTable.id, p.data.id));
  res.sendStatus(204);
});

// ─── Settings ──────────────────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  home_title: "MNI Higher Secondary School",
  home_title_hindi: "एम.एन.आई. उच्चतर माध्यमिक विद्यालय",
  home_tagline: "ज्ञान, संस्कार और उत्कृष्टता की ओर — एक सशक्त भविष्य की नींव",
  home_tagline_english: "Nurturing minds, building character, and shaping futures for generations.",
  home_stats_students: "1200+",
  home_stats_teachers: "60+",
  home_stats_years: "30+",
  founder_name: "Late Mr. Zaheer Ahmad Hashmi",
  founder_bio: "Late Mr. Zaheer Ahmad Hashmi was the visionary founder of MNI Higher Secondary School, Sambhal.\n\nHis Philosophy: Education for All\n\nHe believed that quality education should be accessible to every child, regardless of their economic background. His tireless efforts built an institution that has transformed thousands of lives across generations in Sambhal and surrounding districts.\n\nLegacy: Under his guidance, the school grew from a small institution to one of the most respected educational establishments in the region.",
  contact_address: "MNI Higher Secondary School, Sambhal, Uttar Pradesh — 244302",
  contact_address_hindi: "एम.एन.आई. उच्चतर माध्यमिक विद्यालय, संभल, उत्तर प्रदेश — 244302",
  contact_phone: "+91 XXXXX XXXXX",
  contact_email: "info@mnischool.edu.in",
  contact_hours: "Monday – Saturday: 8:00 AM – 4:00 PM\nSunday: Closed",
};

app.get("/api/settings", async (_req, res) => {
  const rows = await db.select().from(siteSettingsTable);
  const fromDB = {};
  rows.forEach(r => { fromDB[r.key] = r.value; });
  res.json({ ...DEFAULT_SETTINGS, ...fromDB });
});

app.put("/api/settings", requireAdmin, async (req, res) => {
  const updates = req.body;
  for (const [key, value] of Object.entries(updates)) {
    await db.insert(siteSettingsTable).values({ key, value }).onConflictDoUpdate({ target: siteSettingsTable.key, set: { value, updatedAt: new Date() } });
  }
  const rows = await db.select().from(siteSettingsTable);
  const fromDB = {};
  rows.forEach(r => { fromDB[r.key] = r.value; });
  res.json({ ...DEFAULT_SETTINGS, ...fromDB });
});

// ─── Upload ────────────────────────────────────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, /jpeg|jpg|png|gif|webp/.test(file.mimetype));
  },
});

app.post("/api/upload", requireAdmin, upload.single("file"), (req, res) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }
  const dataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
  res.json({ url: dataUrl });
});

// ─── Health ────────────────────────────────────────────────────────────────────
app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "connected", env: { hasDbUrl: !!process.env.DATABASE_URL, nodeEnv: process.env.NODE_ENV } });
  } catch (e) {
    res.status(503).json({ status: "degraded", db: "disconnected", error: e.message, env: { hasDbUrl: !!process.env.DATABASE_URL } });
  }
});

// ─── Global error handler (must be last) ───────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error("API Error:", err?.message ?? err);
  res.status(err?.status ?? 500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "production" ? "Something went wrong" : (err?.message ?? String(err)),
  });
});

export default app;
