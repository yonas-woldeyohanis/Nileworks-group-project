# Hunarly — System Architecture Description

## 1. Introduction

Hunarly is a mobile-first job and internship discovery platform built specifically for Ethiopian university students and local employers. This document describes the technical architecture of the system, covering the client-side mobile application, the server-side API, the database design, real-time communication, file storage, and external integrations.

---

## 2. Architecture Pattern

Hunarly follows a **Client–Server architecture** with a **RESTful API** as the primary communication layer, supplemented by **WebSocket** connections for real-time messaging. The mobile client is decoupled from the backend, communicating exclusively through versioned JSON APIs (`/api/v1/`).

```
┌──────────────────┐         HTTPS          ┌───────────────────┐
│  React Native    │◄──────────────────────▶│  Express.js API   │
│  Mobile Client   │         WSS            │  (Node.js)        │
│  (Expo Go)       │◄──────────────────────▶│  Socket.io        │
└──────────────────┘                        └─────────┬─────────┘
                                                      │
                                       ┌──────────────┼──────────────┐
                                       ▼              ▼              ▼
                                  MongoDB Atlas   Cloudinary   Nodemailer
```

---

## 3. Frontend Architecture

### 3.1 Technology Stack

| Concern | Technology |
|---------|-----------|
| Framework | React Native 0.73 (Expo SDK 50) |
| Build Tool | Expo Go (managed workflow) |
| Language | JavaScript (ES2022) |
| Navigation | React Navigation v6 (Stack + Bottom Tabs) |
| HTTP Client | Axios with JWT interceptors |
| Real-time | Socket.io client |
| State | React Context API + useState hooks |
| Storage | expo-secure-store (tokens), in-memory (UI state) |
| Animation | react-native-reanimated v3, Animated API |
| File Picking | expo-image-picker, expo-document-picker |
| Fonts | DM Sans (body), Playfair Display (headings) |

### 3.2 Directory Structure

```
frontend/
├── App.js                  # Entry point: font loading, providers
├── navigation/
│   ├── RootNavigator.js    # Auth state gate
│   ├── AuthNavigator.js    # Splash + auth stack
│   ├── StudentTabNavigator.js
│   └── EmployerTabNavigator.js
├── screens/
│   ├── auth/               # Splash, RoleSelection, Login, Register, ForgotPW
│   ├── student/            # Home, JobDetail, Search, Apply, Tracker, Profile
│   ├── employer/           # Dashboard, PostJob, ApplicantDashboard, Profile
│   └── shared/             # Messaging, Conversation, Notifications
├── components/common/      # Button, Input, Badge, Avatar, JobCard, etc.
├── context/AuthContext.js  # Global auth state
├── services/api.js         # Axios instance + interceptors
├── constants/              # Colors, typography, layout, endpoints
├── utils/helpers.js        # Date formatting, validation, badge configs
└── hooks/                  # useJobs, useApplications
```

### 3.3 Authentication Flow

Tokens are stored in `expo-secure-store` (hardware-backed on supported devices). On each API request, the Axios request interceptor automatically attaches the `Bearer` token. On a 401 response, the interceptor attempts a token refresh. If the refresh fails, the user is logged out and redirected to the login screen. A request queue ensures concurrent requests are held during the refresh, then retried.

### 3.4 Design System

- **Primary color:** `#1B3A6B` (deep navy — trust, professionalism)
- **Accent color:** `#F5A623` (amber — energy, opportunity)
- **Background:** `#F8F9FA` (off-white — clean, readable)
- **Shadows:** Three-level elevation system (sm, md, lg)
- **Border radius:** Consistent scale (6, 10, 14, 20, 28, full)
- **Animation:** Spring-based transitions (react-native-reanimated 3)

---

## 4. Backend Architecture

### 4.1 Technology Stack

| Concern | Technology |
|---------|-----------|
| Runtime | Node.js 20 LTS |
| Framework | Express.js 4 |
| Database ORM | Mongoose 8 |
| Authentication | JWT (access + refresh token pair) |
| Real-time | Socket.io 4 |
| File Storage | Cloudinary + multer-storage-cloudinary |
| Email | Nodemailer (SMTP) |
| Security | Helmet, CORS, express-rate-limit, bcryptjs |
| Process Manager | nodemon (dev), PM2 (production) |

### 4.2 Project Structure

```
backend/
├── server.js               # Express app + Socket.io setup
├── config/
│   ├── db.js               # MongoDB Atlas connection
│   └── cloudinary.js       # Cloudinary + multer config
├── models/
│   ├── User.js             # Mongoose discriminator (Student + Employer)
│   ├── Job.js
│   └── index.js            # Application, Conversation, Message, Notification
├── controllers/
│   ├── authController.js
│   ├── jobController.js
│   ├── applicationController.js
│   ├── messageController.js
│   ├── profileController.js
│   └── notificationController.js
├── routes/
│   ├── auth.js
│   ├── jobs.js
│   └── index.js            # Student, employer, app, message, notif routers
├── middleware/
│   ├── auth.js             # protect(), requireRole()
│   └── errorHandler.js     # Global error handler, asyncHandler wrapper
└── utils/
    ├── jwt.js              # Token generation + OTP
    └── email.js            # Nodemailer templates
```

### 4.3 API Design

All endpoints are prefixed `/api/v1/`. Responses follow a consistent envelope:

```json
{
  "success": true | false,
  "data": { ... },
  "message": "Human-readable message"
}
```

**Core Endpoint Groups:**

| Group | Base Path | Auth |
|-------|-----------|------|
| Auth | `/auth` | Public / Protected |
| Jobs | `/jobs` | Protected |
| Students | `/students` | Student only |
| Employers | `/employers` | Employer only |
| Applications | `/applications` | Role-based |
| Messages | `/messages` | Protected |
| Notifications | `/notifications` | Protected |

### 4.4 Security Measures

- Passwords hashed with `bcryptjs` (salt rounds: 12)
- Access tokens expire in 15 minutes; refresh tokens in 7 days
- Refresh tokens stored in the database and validated on use
- Rate limiting: 100 req/15min globally; 10 req/15min on auth endpoints
- Helmet sets security-relevant HTTP headers
- All file uploads validated by type and size before reaching Cloudinary
- Mongoose schema validation as a second layer after Express validation

---

## 5. Database Design

### 5.1 Database: MongoDB Atlas (Cloud)

MongoDB is used for its flexible document model, which suits the varied profile structures of students and employers. Mongoose discriminators allow Student and Employer to share a `users` collection while having different schema fields.

### 5.2 Collections

| Collection | Key Fields |
|-----------|-----------|
| `users` | `role` (discriminator), `email`, `password`, `refreshToken`, `pushToken` |
| `users` (student) | `fullName`, `university`, `department`, `yearOfStudy`, `skills`, `cv`, `savedJobs` |
| `users` (employer) | `companyName`, `industry`, `companySize`, `logo`, `isVerified` |
| `jobs` | `employer` (ref), `title`, `jobType`, `location`, `deadline`, `skills`, `isFeatured`, `isActive` |
| `applications` | `job`, `student`, `employer` (refs), `coverLetter`, `cv`, `status` |
| `conversations` | `participants` (refs), `lastMessage`, `unreadCounts` (Map) |
| `messages` | `conversation`, `sender` (refs), `content`, `readBy` |
| `notifications` | `recipient` (ref), `type`, `title`, `message`, `isRead` |

### 5.3 Indexes

- `jobs`: text index on `title + description + location` for full-text search; compound index on `jobType + isActive + deadline`
- `applications`: unique compound index on `{ student, job }` (one application per job per student)
- `notifications`: compound index on `{ recipient, isRead, createdAt }`
- `messages`: compound index on `{ conversation, createdAt }`

---

## 6. Real-Time Communication

Socket.io handles real-time messaging. Upon opening a conversation, the mobile client emits `join_conversation` with the conversation ID, joining a Socket.io room. When a message is sent via the REST endpoint, the server emits `new_message` to that room, delivering the message to all participants in real time. The client uses optimistic updates — the message appears immediately in the UI before the API response confirms it.

---

## 7. File Storage

All user-uploaded files are stored on **Cloudinary**:

| File Type | Folder | Transformations |
|-----------|--------|----------------|
| Student/employer avatars | `hunarly/images` | 400×400 crop, quality auto |
| Employer logos | `hunarly/images` | 400×400 crop, quality auto |
| Student CVs | `hunarly/documents` | PDF, raw resource type |
| Application CVs | `hunarly/documents` | PDF, raw resource type |

Multer intercepts multipart form data before the controller; `multer-storage-cloudinary` streams directly to Cloudinary without saving to disk. The returned Cloudinary URL is stored in MongoDB.

---

## 8. Scalability Considerations

| Concern | Approach |
|---------|---------|
| Database load | MongoDB Atlas auto-scaling; indexes on all query fields |
| API load | Stateless Express; horizontal scaling possible |
| File storage | Cloudinary CDN; no local file storage |
| Real-time | Socket.io with Redis adapter (for multi-instance, future) |
| Token management | Short-lived access tokens reduce DB reads |
| Push notifications | Expo Push API (future implementation) |

---

## 9. Development & Deployment

### Development
- **Frontend:** `expo start` → scan QR with Expo Go app
- **Backend:** `npm run dev` (nodemon)
- **Database:** MongoDB Atlas free tier (M0)
- **Local networking:** Frontend `BASE_URL` set to machine's LAN IP

### Production (Recommended)
- **Backend:** Deploy to Railway, Render, or a VPS (Ubuntu + PM2 + Nginx)
- **Frontend:** Build with EAS Build → submit to Google Play / App Store
- **Database:** MongoDB Atlas M10+ for production
- **Environment:** All secrets in `.env`, never committed to version control

---

## 10. Technology Justification

| Decision | Rationale |
|---------|-----------|
| React Native / Expo | Single codebase for Android + iOS; fast iteration with Expo Go; large ecosystem |
| Node.js + Express | JavaScript consistency across stack; large library ecosystem; fast async I/O |
| MongoDB | Flexible schema suits varied user types; good free-tier hosting via Atlas |
| Cloudinary | Reliable CDN, free tier sufficient for MVP, built-in image transformations |
| Socket.io | Mature, widely-used WebSocket library with automatic fallbacks and room management |
| JWT (dual-token) | Stateless auth scales well; short-lived access tokens + revocable refresh tokens balance security and UX |
| Mongoose discriminators | Avoids separate collections for students/employers; simplifies auth middleware |
