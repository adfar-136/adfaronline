# Adfar Rasheed Portfolio & Masterclass Platform

Welcome to your personal portfolio and weekly masterclass registration platform. This application is built using Next.js 16 (App Router), Tailwind CSS v4, the official native MongoDB driver, Better Auth (credentials only), and Framer Motion for premium animations.

---

## 🚀 Tech Stack Highlights

- **Framework**: Next.js 16 (App Router) + React Server Components (RSC) + Server Actions.
- **Styling**: Tailwind CSS v4 + custom premium shadcn-equivalent UI components.
- **Database**: Official `mongodb` native client driver (cached globally to prevent connection leaks during development). **No Mongoose ODM** used.
- **Authentication**: **Better Auth** with email and password provider + native MongoDB adapter.
- **Animations**: GPU-friendly scroll-triggered reveals, number count-up counters, and micro-interactions powered by `framer-motion` and `canvas-confetti`.
- **Icons & Alerts**: `lucide-react` + styled `sonner` notifications.

---

## 🛠️ Environment Variables Configuration

Before launching the server, copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

### Required Keys:

```ini
MONGODB_URI=mongodb://localhost:27017/adfarport
BETTER_AUTH_SECRET=fbe1ad9c2d1396b27e4e1a0b3c6d7e8f90123456789abcdef0123456789abcde
BETTER_AUTH_URL=http://localhost:3000
ADMIN_EMAIL=adfarrasheed136@gmail.com
```

> [!IMPORTANT]
> The `ADMIN_EMAIL` defines the admin privileges. Any user logging in with this email will see the **Admin Console** link in their navigation profile dropdown and gain access to the `/admin` path.

---

## 📦 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Seed the Database

A custom seeding script is provided in `scripts/seed.js`. Run this command to clear existing data and populate your database with an upcoming open masterclass, a past closed class, and three mock student registrations:

```bash
node scripts/seed.js
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🖥️ How it Works

### 1. YouTube Playlists management

The playlists showcase is fast, SEO-friendly, and does not require database overhead. You can edit playlists directly in `src/data/playlists.ts`.

Example Playlist Schema:
```typescript
export type Playlist = {
  id: string;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  thumbnail: string;   // Tailwind gradient classes or image path
  youtubeUrl: string;  // Paste your playlist link here (use '#' for Coming Soon)
  channel: "College Wallah" | "Learnyard";
};
```

Cards with `youtubeUrl: "#"` will automatically render in a disabled "Coming soon" state.

---

### 2. Social Links & Bio

All static external URLs, bios, statistics, timeline history, and press releases are consolidated in `src/data/site.ts` for simple, single-point editing.

---

### 3. Student Registration Flow

- **Landing page Spotlight & `/masterclass`**: Highlights the next upcoming open masterclass.
- **Registration**: If a student is logged in, clicking "Register Now" calls a Next.js Server Action to insert their record. It validates capacity constraints and enforces a unique index on `{ masterclassId, userId }` to prevent duplicate registrations.
- **Interactive Feedback**: A successful registration triggers a toast alert and fires a canvas confetti explosion, flipping the button to "You're registered ✓".

---

### 4. Admin Operations (`/admin`)

Logged-in users matching `ADMIN_EMAIL` have full system access:
- **Announce Masterclass**: Create a new session with topic details, date picker, duration, capacity cap, pricing, and custom payment details.
- **Manage Sessions**: Open/close registrations dynamically, edit class parameters, or delete sessions.
- **Roster Export**: Click any masterclass row to expand its student roster. Features include:
  - **Copy Emails**: Copies all student emails to clipboard as a comma-separated list.
  - **Export CSV**: Downloads the full roster as a clean, compliant CSV file.

---

## 🧪 Production Verification

Verify static optimization structures and compile states using:

```bash
npm run build
```
```bash
npm run start
```
