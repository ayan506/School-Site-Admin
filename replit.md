# MNI Higher Secondary School Website

## Overview

Full-stack school website for MNI Higher Secondary School (एम.एन.आई. उच्चतर माध्यमिक विद्यालय), Sambhal, Uttar Pradesh. Bilingual (Hindi + English) with admin panel.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/mni-school)
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Animations**: Framer Motion
- **Routing**: Wouter
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)

## Features

- **Home**: Hero, stats, principal's message, latest blog posts
- **About Us**: School history, mission, vision, facilities
- **Photo Gallery**: Grid with category filters, lightbox view
- **Blog**: Post listing + individual post pages (Hindi + English)
- **Administrative**: Staff cards with photo, name (Hindi/English), role (Hindi/English)
- **Contact Us**: Contact form, info, address
- **Admin Panel** (`/admin`): Secure login → dashboard with full CRUD for:
  - Blog posts (title, content in Hindi + English)
  - Photo gallery (image URL, category)
  - Staff management (name, role, photo, display order)
- **Background Music**: Auto-plays `Ilm_Ka_Naya_Safar.mp3` on loop; floating toggle button

## Admin Credentials

- Username: `admin`
- Password: `mni@school2024`

## Database Tables

- `blog_posts` — Blog articles
- `gallery_photos` — Gallery images with categories
- `staff` — Administrative staff members

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks
- `pnpm --filter @workspace/db run push` — push DB schema changes
- `pnpm --filter @workspace/api-server run dev` — run API server
- `pnpm --filter @workspace/mni-school run dev` — run frontend

## Color Theme

- Primary: Saffron/Orange (hsl 28 90% 45%)
- Secondary: Deep Green (hsl 120 35% 22%)
- Background: Warm cream (hsl 40 33% 97%)
