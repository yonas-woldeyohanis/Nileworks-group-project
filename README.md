# NileWorks 🌊

**Job & Internship Finder for Ethiopian Students**

A full-stack mobile application built with React Native (Expo) + Node.js/Express/MongoDB.

---

## Project Structure

```
nileworks/
├── frontend/          # React Native app (Expo Go / EAS Build)
├── backend/           # Node.js + Express API
└── docs/              # Academic deliverables
    ├── user_research_plan.md
    ├── workflow_map.md
    └── architecture_description.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Expo Go app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- MongoDB Atlas account (free tier is fine)
- Cloudinary account

---

## Backend Setup

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```

Edit `.env` and fill in:
- `MONGO_URI` — your MongoDB Atlas connection string
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — from your Cloudinary dashboard
- `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` — generate strong random strings
- `EMAIL_USER` and `EMAIL_PASS` — Gmail + App Password (for OTP emails)

### 3. Start the backend
```bash
npm run dev     # development (nodemon)
npm start       # production
```

The API runs on `http://localhost:5000`.

---

## Frontend Setup

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Set your backend URL

Open `constants/endpoints.js` and replace:
```js
export const BASE_URL = 'http://YOUR_LOCAL_IP:5000/api/v1';
```

Find your machine's LAN IP:
- **Mac/Linux:** `ifconfig | grep "inet "` 
- **Windows:** `ipconfig` → look for IPv4 Address

Example: `http://192.168.1.42:5000/api/v1`

> ⚠️ Your phone and computer must be on the **same Wi-Fi network**.

### 3. Start the app
```bash
npx expo start
```

Scan the QR code with:
- **Expo Go** (iOS: Camera app, Android: Expo Go app)

---

## Features

### Student
- 🔍 **Discover Jobs** — filter by type (Internship / Part-time / Full-time / Remote), search with debounce
- 📋 **Apply** — 3-step application flow: profile review → cover letter + CV → confirm
- 📊 **Track Applications** — Kanban-style status tracker (Applied → Viewed → Shortlisted → Interview → Offered)
- 💬 **Messages** — real-time chat with employers via Socket.io
- 👤 **Profile** — completeness bar, skills, bio, CV upload, avatar, links

### Employer
- 📝 **Post Jobs** — rich listing with type, location, skills, deadline, paid toggle
- 👥 **Review Applicants** — expandable cards, cover letter, CV, status updates
- 📈 **Analytics** — total jobs, applicants, shortlisted, offers sent
- 💬 **Message Candidates** — start conversations from applicant card

### Shared
- 🔔 **Notifications** — real-time status updates for applications and messages
- 🔐 **Auth** — JWT dual-token (access + refresh), OTP-based password reset

---

## API Endpoints Summary

```
POST   /api/v1/auth/register/student
POST   /api/v1/auth/register/employer
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/verify-otp
POST   /api/v1/auth/reset-password

GET    /api/v1/jobs              (with filters + pagination)
GET    /api/v1/jobs/search
GET    /api/v1/jobs/:id
POST   /api/v1/jobs              (employer)
POST   /api/v1/jobs/:id/save     (student)
POST   /api/v1/jobs/:jobId/apply (student)

GET    /api/v1/applications/my               (student)
GET    /api/v1/jobs/:jobId/applicants        (employer)
PATCH  /api/v1/applications/:id/status       (employer)

PATCH  /api/v1/students/profile
PATCH  /api/v1/students/profile/avatar
PATCH  /api/v1/students/profile/cv

PATCH  /api/v1/employers/profile
PATCH  /api/v1/employers/profile/logo
GET    /api/v1/employers/analytics

GET    /api/v1/messages/conversations
GET    /api/v1/messages/conversations/:id
POST   /api/v1/messages/conversations/:id/send
POST   /api/v1/messages/start

GET    /api/v1/notifications
PATCH  /api/v1/notifications/:id/read
PATCH  /api/v1/notifications/read-all
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | React Native 0.73, Expo SDK 54 |
| Navigation | React Navigation v6 |
| Animation | React Native Animated API |
| HTTP | Axios with JWT interceptors |
| Real-time | Socket.io |
| Backend | Node.js 20 + Express 4 |
| Database | MongoDB Atlas + Mongoose 8 |
| Auth | JWT (access + refresh tokens) |
| Files | Cloudinary + multer |
| Email | Nodemailer |
| Fonts | DM Sans + Playfair Display |

---

## Academic Deliverables

Located in `/docs/`:

| File | Description |
|------|-------------|
| `user_research_plan.md` | Research methodology, interview guides, analysis plan |
| `workflow_map.md` | System diagrams, user flows, data flow, state management |
| `architecture_description.md` | Full technical architecture, design decisions, deployment guide |

---

## Design System

| Token | Value |
|-------|-------|
| Primary | `#1B3A6B` (deep navy) |
| Accent | `#F5A623` (amber) |
| Background | `#F8F9FA` |
| Font (body) | DM Sans |
| Font (headings) | Playfair Display |

---

Built with ❤️ for Ethiopian students.
