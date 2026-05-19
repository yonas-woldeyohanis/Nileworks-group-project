# Hunarly — System Workflow Map

## 1. High-Level System Overview

```
┌─────────────────────────────────────────────────────────┐
│                     HUNARLY MOBILE APP                  │
│              React Native (Expo Go)                     │
├──────────────────────┬──────────────────────────────────┤
│   Student Interface  │      Employer Interface           │
│   - Discover Jobs    │      - Post Listings              │
│   - Apply           │      - Review Applicants          │
│   - Track Status    │      - Update Application Status  │
│   - Messages        │      - Message Candidates         │
│   - Profile         │      - Analytics Dashboard        │
└──────────────────────┴──────────────────────────────────┘
                         │  HTTPS REST API
                         │  WebSocket (Socket.io)
                         ▼
┌─────────────────────────────────────────────────────────┐
│               NODE.JS / EXPRESS BACKEND                 │
│  Auth │ Jobs │ Applications │ Messages │ Notifications  │
└───────────────────────┬─────────────────────────────────┘
                        │
          ┌─────────────┼──────────────┐
          ▼             ▼              ▼
    MongoDB Atlas   Cloudinary    Nodemailer
    (Data store)  (File uploads)  (Email/OTP)
```

---

## 2. Authentication Workflow

```
User Opens App
      │
      ▼
Check SecureStore for accessToken
      │
   ┌──┴──┐
 Found  Not Found
   │       │
   ▼       ▼
Validate  Show Splash
Token     → Role Selection
   │
┌──┴──┐
Valid Expired
  │      │
  ▼      ▼
Enter  Call /auth/refresh
App    with refreshToken
          │
       ┌──┴──┐
     OK    Failed
      │       │
      ▼       ▼
 New tokens  Logout →
 Retry req   Login Screen
```

---

## 3. Student User Flows

### 3.1 Registration Flow
```
Splash Screen (2.4s)
      ↓
Role Selection Screen
      ↓ (select "Student")
Student Register — Step 1
  └─ Full Name, Email, Password, Confirm Password
      ↓
Student Register — Step 2
  └─ University (chip picker), Department, Year of Study
      ↓
POST /auth/register/student
      ↓
Tokens stored in SecureStore
      ↓
Student Home Screen
```

### 3.2 Job Discovery Flow
```
Home Screen
  ├─ Category filter (All / Internship / Part-time / Full-time / Remote)
  ├─ Pull-to-refresh
  ├─ Infinite scroll pagination (10 items/page)
  └─ Search FAB → Search Screen
         ├─ Debounced query (400ms)
         ├─ Filter modal (type, location, salary, sort)
         └─ Results list

Job Card → Job Detail Screen
  ├─ Company info, description, skills, stats
  ├─ Save/Unsave (POST /jobs/:id/save)
  └─ Apply button → Apply Flow
```

### 3.3 Application Flow
```
Apply Screen — Step 1: Profile Review
  └─ Shows student profile; prompts CV upload if missing

Apply Screen — Step 2: Cover Letter
  ├─ Text area (optional)
  └─ Option to upload different CV (DocumentPicker)

Apply Screen — Step 3: Confirm & Submit
  └─ POST /jobs/:jobId/apply (multipart/form-data)

Apply Screen — Step 4: Success ✓
  └─ Spring scale animation + navigation options
```

### 3.4 Application Tracking Flow
```
Application Tracker Tab
  ├─ Summary row (Total / Offers / Interviews / Viewed)
  ├─ Status filter pills
  └─ Application cards (color-coded left border by status)
       └─ Status: applied → viewed → shortlisted → interview → offered / rejected
```

---

## 4. Employer User Flows

### 4.1 Registration Flow
```
Role Selection Screen → "I'm an Employer"
      ↓
Employer Register Screen
  └─ Company Name, Contact Person, Email, Password,
     Industry (chip grid), Company Size (chips), Website
      ↓
POST /auth/register/employer
      ↓
Employer Dashboard (Home)
```

### 4.2 Job Posting Flow
```
Dashboard → Post Job CTA / "+" tab
      ↓
Post Job Screen
  ├─ Title, Description (min 50 chars)
  ├─ Job Type (chip)
  ├─ Location (chip)
  ├─ Salary, Openings, Deadline
  ├─ Skills (add/remove)
  └─ Paid toggle
      ↓
POST /jobs
      ↓
Dashboard updates → Notification sent to matched students
```

### 4.3 Applicant Review Flow
```
Dashboard Listing → View Applicants
      ↓
Applicant Dashboard
  ├─ Filter by status
  └─ Applicant Card (expandable)
       ├─ Student profile preview
       ├─ Cover letter preview
       ├─ CV link
       └─ Action buttons: Viewed / Shortlist / Interview / Offer / Reject
            ↓
       PATCH /applications/:id/status
            ↓
       Notification sent to student
```

---

## 5. Messaging Workflow

```
Employer: Start Conversation from Applicant Card
  └─ POST /messages/start { recipientId }
         ↓
  Conversation created or retrieved
         ↓
  ConversationScreen opened

Real-time messaging:
  Client                          Server
    │── socket.emit('join_conversation', id) ──▶│
    │                                            │ (joins Socket.io room)
    │── POST /messages/conversations/:id/send ──▶│
    │                                            │── io.to(room).emit('new_message') ──▶│
    │◀── new_message event ──────────────────────│
    │ (optimistic update already shown)          │
```

---

## 6. Notification Workflow

```
Trigger Event (backend)              Student App
  e.g. employer updates status
         │
         ▼
  Notification.create() in DB
         │
         ▼ (future: Expo Push Notification)
  POST to Expo Push API
         │
         ▼
  Device receives push notification
         │
         ▼
  User taps → NotificationsScreen
         │
         ▼
  PATCH /notifications/:id/read
```

---

## 7. Data Flow Diagram

```
[Mobile App]
     │
     │ JWT in Authorization header
     ▼
[Express Middleware]
  protect() → verify JWT → attach req.user
  requireRole() → check role
     │
     ▼
[Controller]
  Business logic
     │
  ┌──┼──────────────┐
  ▼  ▼              ▼
[MongoDB]  [Cloudinary]  [Socket.io]
 Data       File URLs     Real-time
  │
  ▼
JSON Response → [Mobile App] → State Update → UI Re-render
```

---

## 8. State Management

| State Type | Location | Tool |
|-----------|----------|------|
| Authentication | Global | AuthContext (React Context) |
| User profile | Global | AuthContext + SecureStore |
| Job listings | Screen-local | useState + API calls |
| Application list | Screen-local | useState + API calls |
| Messages | Screen-local | useState + Socket.io |
| Notifications | Screen-local | useState + API calls |
| Navigation | Global | React Navigation |

---

## 9. Error Handling Strategy

| Layer | Approach |
|-------|----------|
| API calls | try/catch with user-facing Alert |
| Token expiry | Axios interceptor → auto refresh → retry |
| Network errors | Retry suggestion in UI |
| Form validation | Client-side before API call |
| Server errors | Standardized `{ success, message }` JSON |
| Socket disconnect | Automatic reconnect by Socket.io client |
