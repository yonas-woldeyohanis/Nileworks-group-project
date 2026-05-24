# NileWorks - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Installation & Setup](#installation--setup)
5. [Backend Documentation](#backend-documentation)
6. [Frontend Documentation](#frontend-documentation)
7. [Database Schema](#database-schema)
8. [API Documentation](#api-documentation)
9. [Features & Functionality](#features--functionality)
10. [Development Guidelines](#development-guidelines)
11. [Troubleshooting](#troubleshooting)
12. [Contributing](#contributing)

---

## Project Overview

### What is NileWorks?

NileWorks is a comprehensive mobile application platform designed to bridge the employment gap between Ethiopian university students and local employers. The platform facilitates the discovery, application, and management of internships, part-time, and full-time employment opportunities.

### Key Objectives
- **Simplify Job Discovery:** Enable students to find relevant opportunities efficiently
- **Streamline Recruitment:** Provide employers with tools to manage postings and review candidates
- **Enable Real-Time Communication:** Facilitate direct messaging between students and recruiters
- **Build Professional Profiles:** Allow students to showcase their skills and experience
- **Track Applications:** Provide transparent application status tracking

### Target Users
- **Students:** Ethiopian university students seeking employment opportunities
- **Employers:** Local companies and organizations looking to hire talent
- **Recruiters:** HR professionals managing recruitment campaigns

---

## System Architecture

### Overall Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                    NileWorks Platform                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐          ┌──────────────────────┐     │
│  │   Mobile App     │          │   Admin Panel        │     │
│  │  (React Native)  │◄────────►│   (Web - Optional)   │     │
│  └────────┬─────────┘          └──────────────────────┘     │
│           │                                                   │
│           │ HTTP/REST & WebSocket                            │
│           │                                                   │
│  ┌────────▼──────────────────────────────────────────┐      │
│  │        Express.js Backend Server                  │      │
│  │  ┌────────────────────────────────────────────┐   │      │
│  │  │  Authentication & Authorization (JWT)     │   │      │
│  │  │  Job Listings API                         │   │      │
│  │  │  User Profile Management                  │   │      │
│  │  │  Application Tracking                     │   │      │
│  │  │  Real-time Messaging (Socket.io)         │   │      │
│  │  │  File Upload Handler (Cloudinary)        │   │      │
│  │  │  Email Notifications                      │   │      │
│  │  └────────────────────────────────────────────┘   │      │
│  └────────┬──────────────────────────────────────────┘      │
│           │                                                   │
│  ┌────────┴──────────────────────────────────────────┐      │
│  │                                                   │      │
│  ├──────────────────┬──────────────────┬─────────┐   │      │
│  │                  │                  │         │   │      │
│  ▼                  ▼                  ▼         ▼   ▼      │
│ MongoDB         Cloudinary         Socket.io   Email       │
│ (Database)      (Media Storage)    (Real-time) Server      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Components

#### Frontend (React Native + Expo)
- **Platform Support:** iOS, Android, and Web
- **State Management:** React hooks and context API
- **Navigation:** React Navigation with tab and stack navigation
- **HTTP Client:** Axios for API communication
- **Real-time Updates:** Socket.io client
- **Local Storage:** Async Storage for persisting user data
- **Authentication:** JWT token management

#### Backend (Node.js + Express)
- **API Design:** RESTful architecture with versioning (v1)
- **Authentication:** JWT-based (Access & Refresh tokens)
- **Database Interface:** Mongoose ODM for MongoDB
- **Real-time Engine:** Socket.io for live messaging
- **File Handling:** Multer for file uploads
- **Media Management:** Cloudinary for image/document storage
- **Security:** Helmet, CORS, Rate limiting, Input validation
- **Logging:** Morgan HTTP logger
- **Compression:** Gzip response compression

#### Database (MongoDB)
- **Hosting:** MongoDB Atlas
- **Document Model:** Flexible schema with Mongoose validation
- **Collections:** Users, Jobs, Applications, Messages, etc.
- **Indexing:** Performance optimization on frequently queried fields

#### External Services
- **Cloudinary:** Image and file storage
- **JWT:** Authentication tokens
- **Nodemailer:** Email notifications
- **Socket.io:** Real-time communication

---

## Technology Stack

### Frontend Dependencies
```json
{
  "react": "19.1.0",
  "react-native": "0.81.5",
  "expo": "~54.0.0",
  "@react-navigation/native": "^6.1.18",
  "@react-navigation/bottom-tabs": "^6.6.1",
  "@react-navigation/stack": "^6.4.1",
  "axios": "^1.7.9",
  "socket.io-client": "^4.8.1",
  "@react-native-async-storage/async-storage": "2.2.0",
  "expo-image-picker": "~17.0.11",
  "expo-document-picker": "~14.0.8",
  "react-native-toast-message": "^2.2.1"
}
```

### Backend Dependencies
```json
{
  "express": "^4.18.2",
  "mongoose": "^8.3.1",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "dotenv": "^16.4.5",
  "cors": "^2.8.5",
  "helmet": "^7.1.0",
  "express-rate-limit": "^7.2.0",
  "multer": "^1.4.5-lts.1",
  "cloudinary": "^1.41.3",
  "socket.io": "^4.7.5",
  "nodemailer": "^6.9.13",
  "express-validator": "^7.0.1",
  "morgan": "^1.10.0",
  "compression": "^1.7.4"
}
```

### Key Technologies Explained

| Technology | Purpose | Version |
|-----------|---------|---------|
| **React Native** | Cross-platform mobile development | 0.81.5 |
| **Expo** | React Native development platform | ~54.0.0 |
| **Express.js** | Web application framework | 4.18.2 |
| **MongoDB** | NoSQL database | 8.3.1 (Mongoose) |
| **JWT** | Secure authentication | 9.0.2 |
| **Cloudinary** | Cloud file storage | 1.41.3 |
| **Socket.io** | Real-time bidirectional communication | 4.7.5 / 4.8.1 |
| **Bcryptjs** | Password hashing | 2.4.3 |
| **Axios** | HTTP client | 1.7.9 |
| **Nodemailer** | Email service | 6.9.13 |

---

## Installation & Setup

### Prerequisites
- **Node.js:** v18 or higher
- **npm:** v9 or higher
- **MongoDB:** Atlas account (cloud) or local MongoDB
- **Cloudinary:** Free account for media storage
- **Gmail/SMTP:** For email notifications
- **Expo Go:** Mobile app for development (optional)

### Step 1: Clone the Repository
```bash
git clone https://github.com/yonas-woldeyohanis/Nileworks-group-project.git
cd Nileworks-group-project
```

### Step 2: Backend Setup

#### 2.1 Navigate to backend directory
```bash
cd backend
npm install
```

#### 2.2 Create `.env` file
Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/nileworks?retryWrites=true&w=majority

# JWT Configuration
JWT_ACCESS_SECRET=your_secret_key_here_minimum_32_characters
JWT_REFRESH_SECRET=your_refresh_secret_key_here_minimum_32_characters
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL (for CORS)
FRONTEND_URL=http://192.168.x.x:19000

# Application URLs
API_BASE_URL=https://nileworks-backend.onrender.com/api/v1
FRONTEND_BASE_URL=http://localhost:3000
```

#### 2.3 Start backend server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Backend will run on `http://localhost:5000`

### Step 3: Frontend Setup

#### 3.1 Navigate to frontend directory
```bash
cd ../frontend
npm install
```

#### 3.2 Configure API endpoint
Edit `frontend/constants/endpoints.js`:

```javascript
// For local development
export const BASE_URL = 'http://192.168.x.x:5000/api/v1';

// Replace 192.168.x.x with your machine's IPv4 address
// Find it using: ipconfig (Windows) or ifconfig (Mac/Linux)
```

#### 3.3 Start frontend development server
```bash
npx expo start
```

#### 3.4 Run on device/emulator
- **iOS:** Press `i` in the terminal
- **Android:** Press `a` in the terminal
- **Web:** Press `w` in the terminal
- **Physical Device:** Scan QR code with Expo Go app

### Step 4: Verify Installation

#### Backend Health Check
```bash
curl http://localhost:5000/api/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "API is running"
}
```

#### Frontend Launch
App should load successfully on your device/emulator without errors

---

## Backend Documentation

### Project Structure
```
backend/
├── models/              # Mongoose schemas
│   ├── User.js         # User model (Student/Employer)
│   ├── Job.js          # Job posting model
│   ├── Application.js   # Job application model
│   ├── Message.js      # Direct messages
│   └── Notification.js # User notifications
├── routes/             # API endpoints
│   ├── auth.js         # Authentication routes
│   ├── users.js        # User profile routes
│   ├── jobs.js         # Job listing routes
│   ├── applications.js # Application routes
│   └── messages.js     # Messaging routes
├── controllers/        # Business logic
│   ├── authController.js
│   ├── userController.js
│   ├── jobController.js
│   ├── applicationController.js
│   └── messageController.js
├── middleware/         # Custom middleware
│   ├── auth.js        # JWT verification
│   ├── validation.js   # Input validation
│   ├── errorHandler.js # Error handling
│   └── upload.js      # File upload handling
├── utils/             # Helper functions
│   ├── cloudinary.js  # Cloudinary integration
│   ├── email.js       # Email service
│   ├── jwt.js        # JWT utilities
│   └── seed.js       # Database seeding
├── config/            # Configuration files
│   └── database.js    # MongoDB connection
├── server.js          # Main application file
└── package.json       # Dependencies
```

### Core Modules

#### Authentication Module
**File:** `controllers/authController.js`

Key endpoints:
- `POST /api/v1/auth/register` - User registration (Student/Employer)
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/verify-email` - Email verification

Authentication flow:
```
1. User submits credentials
   ↓
2. Backend validates input
   ↓
3. Check if user exists (prevents duplicate)
   ↓
4. Hash password with bcryptjs
   ↓
5. Store user in database
   ↓
6. Generate JWT tokens (Access & Refresh)
   ↓
7. Return tokens to client
   ↓
8. Client stores tokens in secure storage
```

#### User Profile Module
**File:** `controllers/userController.js`

Key endpoints:
- `GET /api/v1/users/:userId` - Get user profile
- `PUT /api/v1/users/:userId` - Update profile
- `POST /api/v1/users/:userId/avatar` - Upload profile picture
- `POST /api/v1/users/:userId/cv` - Upload CV (students)
- `GET /api/v1/users/search` - Search users

User profile includes:
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  role: "student" | "employer",
  
  // Student-specific fields
  avatar: String (Cloudinary URL),
  bio: String,
  skills: [String],
  cv: String (Cloudinary URL),
  university: String,
  graduationYear: Number,
  externalLinks: [{ title, url }],
  
  // Employer-specific fields
  company: String,
  companyLogo: String,
  industry: String,
  companySize: String,
  
  // Common fields
  createdAt: Date,
  updatedAt: Date,
  isVerified: Boolean,
  isActive: Boolean
}
```

#### Job Management Module
**File:** `controllers/jobController.js`

Key endpoints:
- `POST /api/v1/jobs` - Create job posting (employer only)
- `GET /api/v1/jobs` - List all jobs with filters
- `GET /api/v1/jobs/:jobId` - Get job details
- `PUT /api/v1/jobs/:jobId` - Update job posting
- `DELETE /api/v1/jobs/:jobId` - Delete job posting
- `GET /api/v1/jobs/search` - Search jobs with filters

Job filtering options:
```javascript
{
  type: "internship" | "part-time" | "full-time" | "contract",
  location: "remote" | "on-site" | "hybrid",
  experience: "entry" | "mid" | "senior",
  salary_min: Number,
  salary_max: Number,
  skills: [String],
  company: String,
  search: String (text search)
}
```

Job posting structure:
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  company: ObjectId (reference to User),
  type: String,
  location: String,
  salary: {
    min: Number,
    max: Number,
    currency: String
  },
  requirements: [String],
  responsibilities: [String],
  skills: [String],
  deadline: Date,
  status: "active" | "closed" | "draft",
  applicantCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### Application Tracking Module
**File:** `controllers/applicationController.js`

Key endpoints:
- `POST /api/v1/applications` - Submit job application
- `GET /api/v1/applications` - Get applications (filtered by user role)
- `PUT /api/v1/applications/:applicationId` - Update application status
- `DELETE /api/v1/applications/:applicationId` - Withdraw application

Application status flow:
```
Submitted → Reviewed → Shortlisted → Interview → Offered → Accepted/Rejected
```

Application document:
```javascript
{
  _id: ObjectId,
  job: ObjectId (reference to Job),
  applicant: ObjectId (reference to Student User),
  employer: ObjectId (reference to Employer User),
  status: "submitted" | "reviewed" | "shortlisted" | "interview" | "offered" | "rejected",
  appliedAt: Date,
  statusUpdatedAt: Date,
  notes: String,
  cv: String (Cloudinary URL - optional)
}
```

#### Real-Time Messaging Module
**File:** `controllers/messageController.js` & Socket.io handlers

Key endpoints:
- `POST /api/v1/messages` - Send message
- `GET /api/v1/messages/:conversationId` - Get conversation history
- `GET /api/v1/conversations` - List all conversations

Socket.io events:
```javascript
// Client to Server
socket.emit('join_room', { conversationId })
socket.emit('send_message', { conversationId, text, sender })
socket.emit('typing', { conversationId, sender })

// Server to Client
socket.on('receive_message', (message) => { })
socket.on('user_typing', (data) => { })
socket.on('message_delivered', (messageId) => { })
```

Message structure:
```javascript
{
  _id: ObjectId,
  sender: ObjectId (reference to User),
  receiver: ObjectId (reference to User),
  text: String,
  attachment: String (Cloudinary URL - optional),
  timestamp: Date,
  isRead: Boolean
}
```

### Middleware Functions

#### Authentication Middleware
```javascript
// middleware/auth.js
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};
```

Usage in routes:
```javascript
router.get('/api/v1/jobs', authenticateToken, jobController.getJobs);
```

#### Authorization Middleware
```javascript
// middleware/auth.js
const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    next();
  };
};
```

Usage:
```javascript
router.post('/api/v1/jobs', 
  authenticateToken, 
  authorizeRole(['employer']), 
  jobController.createJob
);
```

#### Input Validation Middleware
```javascript
// middleware/validation.js
const validateJobInput = [
  body('title').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('type').isIn(['internship', 'part-time', 'full-time']),
  body('deadline').isISO8601()
];
```

### Error Handling
```javascript
// middleware/errorHandler.js
const globalErrorHandler = (err, req, res, next) => {
  console.error(err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};
```

---

## Frontend Documentation

### Project Structure
```
frontend/
├── screens/                 # Screen components
│   ├── auth/
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   └── OnboardingScreen.js
│   ├── jobs/
│   │   ├── JobListScreen.js
│   │   ├── JobDetailsScreen.js
│   │   └── JobApplicationScreen.js
│   ├── applications/
│   │   ├── ApplicationsScreen.js
│   │   └── ApplicationDetailsScreen.js
│   ├── messages/
│   │   ├── ConversationsScreen.js
│   │   └── ChatScreen.js
│   └── profile/
│       ├── ProfileScreen.js
│       └── EditProfileScreen.js
├── components/              # Reusable components
│   ├── JobCard.js
│   ├── UserCard.js
│   ├── ApplicationCard.js
│   ├── MessageBubble.js
│   └── CustomHeader.js
├── navigation/              # Navigation setup
│   ├── StudentNavigator.js
│   ├── EmployerNavigator.js
│   └── AuthNavigator.js
├── context/                 # Context API (State)
│   ├── AuthContext.js
│   ├── JobContext.js
│   └── MessageContext.js
├── services/                # API services
│   ├── authService.js
│   ├── jobService.js
│   ├── userService.js
│   ├── applicationService.js
│   └── messageService.js
├── utils/                   # Utility functions
│   ├── storage.js          # Async storage helpers
│   ├── formatting.js       # Date/text formatting
│   └── validation.js       # Input validation
├── constants/               # App constants
│   ├── endpoints.js        # API endpoints
│   ├── colors.js           # Theme colors
│   └── strings.js          # UI strings
└── App.js                  # Root component
```

### Navigation Structure

#### Student Flow
```
Authentication
├── Login
├── Register
└── Email Verification
    ↓
Main App (Tab Navigation)
├── Home
│   ├── Job List
│   └── Job Details → Apply
├── Applications
│   ├── My Applications
│   └── Application Details
├── Messages
│   ├── Conversations
│   └── Chat
├── Profile
│   ├── View Profile
│   └── Edit Profile
└── Settings
```

#### Employer Flow
```
Authentication
├── Login
├── Register (Company Setup)
└── Email Verification
    ↓
Main App (Tab Navigation)
├── Home
│   ├── Dashboard
│   └── Active Jobs
├── Post Job
│   ├── Job Form
│   └── Preview
├── Applications
│   ├── Incoming Applications
│   └── Applicant Details
├── Messages
│   ├── Conversations
│   └── Chat
├── Profile
│   ├── Company Profile
│   └── Edit Profile
└── Settings
```

### Key Screens

#### Login Screen
```javascript
// Features
- Email/password input with validation
- Social login (optional)
- Remember me checkbox
- Password recovery link
- Registration link

// Form validation
- Email format check
- Password minimum length
- Real-time error display
```

#### Job List Screen
```javascript
// Features
- List view with infinite scroll
- Search by keyword
- Filter by:
  - Job type (internship, part-time, full-time)
  - Location (remote, on-site, hybrid)
  - Experience level
  - Salary range
- Sort by (newest, most applications)
- Save job for later
- Apply directly

// UI Components
- JobCard: Shows title, company, location, salary
- SearchBar: For text search
- FilterButton: Opens filter modal
```

#### Job Details Screen
```javascript
// Sections
1. Job Header (Title, Company, Location)
2. Job Stats (Applications, Posted date)
3. Description
4. Requirements
5. Responsibilities
6. Skills required
7. Company info
8. Application status (if already applied)
9. Apply Button

// Actions
- Save/Remove from saved
- Share job
- Apply for job
- Report job
```

#### Application Dashboard (Kanban)
```javascript
// Columns
- To Review (Newly submitted)
- Reviewing (In progress)
- Shortlisted (Selected candidates)
- Interview (Scheduled)
- Offered (Job offered)
- Rejected/Withdrawn

// Features
- Drag-and-drop between columns
- Click to view applicant details
- Bulk actions
- Filter by status
```

#### Chat Screen
```javascript
// Features
- Message history with dates
- Real-time message delivery indicators
- Typing indicators
- Message timestamps
- File sharing (images, documents)
- Emoji support
- Message reactions (optional)

// Socket.io Integration
- Auto-connect to conversation room
- Listen for new messages
- Listen for typing indicators
- Auto-scroll to latest message
```

#### Profile Screen - Student
```javascript
// Sections
1. Avatar with upload
2. Basic Info (Name, Contact)
3. About/Bio
4. CV Upload
5. Skills (Tagging system)
6. Experience (Work history)
7. Education
8. External Links (Portfolio, GitHub, LinkedIn)
9. Application Statistics
10. Account Settings

// Editable Fields
- Most fields in-app
- Avatar: Image picker
- CV: Document picker
- Skills: Searchable dropdown
```

#### Profile Screen - Employer
```javascript
// Sections
1. Company Logo
2. Company Info (Name, Industry)
3. About Company
4. Company Size
5. Contact Information
6. Posted Jobs (Count & Link)
7. Account Statistics
8. Account Settings

// Editable Fields
- Company info
- Logo: Image picker
- Description
- Contact details
```

### State Management (Context API)

#### Auth Context
```javascript
// AuthContext.js
export const AuthContext = createContext();

// State
{
  user: null,
  token: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  isAuthenticated: false
}

// Actions
- setUser(user)
- setToken(token, refreshToken)
- logout()
- loginError(error)
- clearError()
- refreshAccessToken()
```

#### Job Context
```javascript
// JobContext.js
{
  jobs: [],
  filteredJobs: [],
  currentJob: null,
  isLoading: false,
  error: null,
  filters: {
    type: [],
    location: [],
    salaryRange: [0, 100000],
    search: ''
  }
}

// Actions
- fetchJobs()
- filterJobs(filters)
- setCurrentJob(job)
- applyFilters()
```

#### Message Context
```javascript
// MessageContext.js
{
  conversations: [],
  currentConversation: null,
  messages: [],
  typingUsers: [],
  isLoading: false,
  error: null
}

// Actions
- fetchConversations()
- sendMessage(text, attachments)
- fetchMessageHistory(conversationId)
- markAsRead(conversationId)
```

### API Services

#### Job Service
```javascript
// services/jobService.js
export const jobService = {
  // Get all jobs with pagination and filters
  getJobs: (page, filters) => {
    // Returns: { jobs: [], total, pages }
  },
  
  // Get single job details
  getJob: (jobId) => {
    // Returns: { job: {...} }
  },
  
  // Search jobs
  searchJobs: (query) => {
    // Returns: { results: [] }
  },
  
  // Apply for job
  applyForJob: (jobId, formData) => {
    // Returns: { application: {...} }
  },
  
  // Save job
  saveJob: (jobId) => {
    // Returns: { success: true }
  }
};
```

#### User Service
```javascript
// services/userService.js
export const userService = {
  // Get user profile
  getProfile: (userId) => {
    // Returns: { user: {...} }
  },
  
  // Update profile
  updateProfile: (userId, data) => {
    // Returns: { user: {...} }
  },
  
  // Upload avatar
  uploadAvatar: (userId, image) => {
    // Returns: { avatarUrl: 'cloudinary_url' }
  },
  
  // Upload CV
  uploadCV: (userId, document) => {
    // Returns: { cvUrl: 'cloudinary_url' }
  },
  
  // Search users
  searchUsers: (query) => {
    // Returns: { users: [] }
  }
};
```

#### Message Service
```javascript
// services/messageService.js
export const messageService = {
  // Get conversations
  getConversations: () => {
    // Returns: { conversations: [] }
  },
  
  // Get message history
  getMessages: (conversationId, page) => {
    // Returns: { messages: [], hasMore: true }
  },
  
  // Send message
  sendMessage: (conversationId, text, attachment) => {
    // Returns: { message: {...} }
  },
  
  // Mark as read
  markAsRead: (conversationId) => {
    // Returns: { success: true }
  }
};
```

---

## Database Schema

### User Schema
```javascript
{
  _id: ObjectId,
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 8 },
  role: { 
    type: String, 
    enum: ['student', 'employer'], 
    required: true 
  },
  
  // Student fields
  avatar: { type: String, default: null },
  bio: { type: String, maxlength: 500 },
  skills: [{ type: String, trim: true }],
  cv: { type: String, default: null },
  university: String,
  graduationYear: Number,
  externalLinks: [{
    title: String,
    url: String
  }],
  
  // Employer fields
  company: String,
  companyLogo: String,
  industry: String,
  companySize: String,
  
  // Common fields
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}

// Indexes
- email (unique, ascending)
- role (ascending)
- createdAt (descending) - for sorting recent users
```

### Job Schema
```javascript
{
  _id: ObjectId,
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  company: { 
    type: ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  type: { 
    type: String,
    enum: ['internship', 'part-time', 'full-time', 'contract'],
    required: true
  },
  location: {
    type: String,
    enum: ['remote', 'on-site', 'hybrid'],
    required: true
  },
  
  salary: {
    min: { type: Number, default: null },
    max: { type: Number, default: null },
    currency: { type: String, default: 'ETB' }
  },
  
  requirements: [{ type: String, trim: true }],
  responsibilities: [{ type: String, trim: true }],
  skills: [{ type: String, trim: true }],
  
  deadline: { type: Date, required: true },
  status: { 
    type: String,
    enum: ['active', 'closed', 'draft'],
    default: 'active'
  },
  
  applicantCount: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}

// Indexes
- company (ascending) - find jobs by employer
- status (ascending) - filter by status
- deadline (ascending) - sort by deadline
- createdAt (descending) - recent jobs
- skills (ascending) - search by skills
```

### Application Schema
```javascript
{
  _id: ObjectId,
  job: { 
    type: ObjectId, 
    ref: 'Job', 
    required: true 
  },
  applicant: { 
    type: ObjectId, 
    ref: 'User', 
    required: true 
  },
  employer: { 
    type: ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  status: { 
    type: String,
    enum: ['submitted', 'reviewed', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn'],
    default: 'submitted'
  },
  
  appliedAt: { type: Date, default: Date.now },
  statusUpdatedAt: { type: Date, default: Date.now },
  
  employerNotes: String,
  applicantCoverLetter: String,
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}

// Indexes
- job, applicant (compound, unique) - prevent duplicate applications
- employer (ascending) - find employer's received applications
- applicant (ascending) - find applicant's applications
- status (ascending) - filter by status
```

### Message Schema
```javascript
{
  _id: ObjectId,
  sender: { 
    type: ObjectId, 
    ref: 'User', 
    required: true 
  },
  receiver: { 
    type: ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  text: { type: String, required: true },
  attachment: {
    url: String,
    type: { type: String } // 'image', 'document', 'video'
  },
  
  isRead: { type: Boolean, default: false },
  readAt: Date,
  
  createdAt: { type: Date, default: Date.now }
}

// Indexes
- sender, receiver (compound, ascending) - get conversation
- receiver (ascending) - find unread messages
- createdAt (descending) - sort by time
```

### Notification Schema
```javascript
{
  _id: ObjectId,
  user: { 
    type: ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  type: {
    type: String,
    enum: ['application', 'message', 'job_posted', 'status_update'],
    required: true
  },
  
  title: String,
  message: String,
  
  relatedId: {
    type: ObjectId // ID of related job, application, etc.
  },
  
  isRead: { type: Boolean, default: false },
  readAt: Date,
  
  createdAt: { type: Date, default: Date.now }
}

// Indexes
- user, isRead (compound) - find unread notifications
- createdAt (descending) - recent first
```

---

## API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/v1/auth/register
Content-Type: application/json

Body:
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "student" | "employer",
  "company": "Tech Corp" (only if role is employer),
  "university": "AAU" (only if role is student)
}

Response (201):
{
  "success": true,
  "message": "User registered successfully. Check your email.",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

#### Login
```
POST /api/v1/auth/login
Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "student",
    "avatar": "https://res.cloudinary.com/..."
  }
}
```

#### Refresh Token
```
POST /api/v1/auth/refresh-token
Content-Type: application/json

Body:
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (200):
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Job Endpoints

#### Get All Jobs
```
GET /api/v1/jobs?page=1&limit=10&type=internship&location=remote&search=software

Headers:
Authorization: Bearer <accessToken>

Response (200):
{
  "success": true,
  "data": {
    "jobs": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Junior Software Developer",
        "company": {
          "_id": "507f1f77bcf86cd799439012",
          "firstName": "Tech",
          "lastName": "Corp",
          "company": "Tech Corp"
        },
        "type": "internship",
        "location": "remote",
        "salary": {
          "min": 5000,
          "max": 8000,
          "currency": "ETB"
        },
        "skills": ["JavaScript", "React", "Node.js"],
        "applicantCount": 12,
        "createdAt": "2024-01-15T10:30:00Z",
        "deadline": "2024-02-15T23:59:59Z"
      }
      // ... more jobs
    ],
    "total": 45,
    "pages": 5,
    "currentPage": 1
  }
}
```

#### Get Job Details
```
GET /api/v1/jobs/:jobId

Headers:
Authorization: Bearer <accessToken>

Response (200):
{
  "success": true,
  "data": {
    "job": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Junior Software Developer",
      "description": "We are looking for a talented junior developer...",
      "company": {
        "_id": "507f1f77bcf86cd799439012",
        "firstName": "Tech",
        "lastName": "Corp",
        "email": "hr@techcorp.com",
        "company": "Tech Corp",
        "companyLogo": "https://res.cloudinary.com/..."
      },
      "type": "internship",
      "location": "remote",
      "salary": {
        "min": 5000,
        "max": 8000,
        "currency": "ETB"
      },
      "requirements": [
        "Knowledge of JavaScript",
        "Understanding of React",
        "Git proficiency"
      ],
      "responsibilities": [
        "Develop web applications",
        "Write clean code",
        "Participate in code reviews"
      ],
      "skills": ["JavaScript", "React", "Node.js"],
      "deadline": "2024-02-15T23:59:59Z",
      "status": "active",
      "applicantCount": 12,
      "views": 234,
      "createdAt": "2024-01-15T10:30:00Z",
      "applicationStatus": "applied" | "not_applied" | "saved"
    }
  }
}
```

#### Create Job (Employer Only)
```
POST /api/v1/jobs
Content-Type: application/json

Headers:
Authorization: Bearer <accessToken>

Body:
{
  "title": "Junior Software Developer",
  "description": "We are looking for...",
  "type": "internship",
  "location": "remote",
  "salary": {
    "min": 5000,
    "max": 8000,
    "currency": "ETB"
  },
  "requirements": ["JavaScript", "React"],
  "responsibilities": ["Development", "Testing"],
  "skills": ["JavaScript", "React", "Node.js"],
  "deadline": "2024-02-15T23:59:59Z"
}

Response (201):
{
  "success": true,
  "message": "Job created successfully",
  "data": {
    "job": { /* full job object */ }
  }
}
```

#### Update Job (Employer Only)
```
PUT /api/v1/jobs/:jobId
Content-Type: application/json

Headers:
Authorization: Bearer <accessToken>

Body:
{
  "title": "Senior Software Developer",
  "status": "closed"
  // ... other fields to update
}

Response (200):
{
  "success": true,
  "message": "Job updated successfully",
  "data": {
    "job": { /* updated job object */ }
  }
}
```

#### Delete Job (Employer Only)
```
DELETE /api/v1/jobs/:jobId

Headers:
Authorization: Bearer <accessToken>

Response (200):
{
  "success": true,
  "message": "Job deleted successfully"
}
```

### Application Endpoints

#### Submit Application
```
POST /api/v1/applications
Content-Type: application/json

Headers:
Authorization: Bearer <accessToken>

Body:
{
  "jobId": "507f1f77bcf86cd799439011",
  "coverLetter": "I am interested in this position because..."
}

Response (201):
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "application": {
      "_id": "507f1f77bcf86cd799439013",
      "job": "507f1f77bcf86cd799439011",
      "applicant": "507f1f77bcf86cd799439020",
      "employer": "507f1f77bcf86cd799439012",
      "status": "submitted",
      "appliedAt": "2024-01-20T10:30:00Z"
    }
  }
}
```

#### Get Applications
```
GET /api/v1/applications?status=submitted&sortBy=-appliedAt

Headers:
Authorization: Bearer <accessToken>

Response (200):
{
  "success": true,
  "data": {
    "applications": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "job": {
          "_id": "507f1f77bcf86cd799439011",
          "title": "Junior Software Developer"
        },
        "applicant": {
          "_id": "507f1f77bcf86cd799439020",
          "firstName": "Jane",
          "lastName": "Smith",
          "email": "jane@example.com",
          "avatar": "https://res.cloudinary.com/..."
        },
        "status": "reviewed",
        "appliedAt": "2024-01-20T10:30:00Z",
        "statusUpdatedAt": "2024-01-21T14:00:00Z"
      }
      // ... more applications
    ]
  }
}
```

#### Update Application Status (Employer Only)
```
PUT /api/v1/applications/:applicationId
Content-Type: application/json

Headers:
Authorization: Bearer <accessToken>

Body:
{
  "status": "shortlisted" | "interview" | "offered" | "rejected",
  "notes": "Great candidate, ready for interview"
}

Response (200):
{
  "success": true,
  "message": "Application status updated",
  "data": {
    "application": {
      "_id": "507f1f77bcf86cd799439013",
      "status": "shortlisted",
      "statusUpdatedAt": "2024-01-21T14:00:00Z",
      "notes": "Great candidate, ready for interview"
    }
  }
}
```

### Message Endpoints

#### Send Message
```
POST /api/v1/messages
Content-Type: application/json or multipart/form-data

Headers:
Authorization: Bearer <accessToken>

Body (JSON):
{
  "receiverId": "507f1f77bcf86cd799439021",
  "text": "Hello, I am interested in your job posting"
}

OR (with attachment)
FormData:
- receiverId: 507f1f77bcf86cd799439021
- text: Hello!
- attachment: <File>

Response (201):
{
  "success": true,
  "data": {
    "message": {
      "_id": "507f1f77bcf86cd799439030",
      "sender": "507f1f77bcf86cd799439020",
      "receiver": "507f1f77bcf86cd799439021",
      "text": "Hello, I am interested in your job posting",
      "attachment": null,
      "isRead": false,
      "createdAt": "2024-01-20T15:30:00Z"
    }
  }
}
```

#### Get Messages
```
GET /api/v1/messages/:conversationId?page=1&limit=20

Headers:
Authorization: Bearer <accessToken>

Response (200):
{
  "success": true,
  "data": {
    "messages": [
      {
        "_id": "507f1f77bcf86cd799439030",
        "sender": {
          "_id": "507f1f77bcf86cd799439020",
          "firstName": "Jane",
          "lastName": "Smith"
        },
        "receiver": {
          "_id": "507f1f77bcf86cd799439021",
          "firstName": "John",
          "lastName": "Doe"
        },
        "text": "Hello, I am interested in your job posting",
        "isRead": true,
        "createdAt": "2024-01-20T15:30:00Z"
      }
      // ... more messages
    ],
    "hasMore": true
  }
}
```

#### Get Conversations
```
GET /api/v1/conversations?limit=20

Headers:
Authorization: Bearer <accessToken>

Response (200):
{
  "success": true,
  "data": {
    "conversations": [
      {
        "_id": "507f1f77bcf86cd799439040",
        "participant": {
          "_id": "507f1f77bcf86cd799439021",
          "firstName": "John",
          "lastName": "Doe",
          "avatar": "https://res.cloudinary.com/..."
        },
        "lastMessage": {
          "text": "When can you start?",
          "createdAt": "2024-01-20T16:45:00Z"
        },
        "unreadCount": 2
      }
      // ... more conversations
    ]
  }
}
```

### User Endpoints

#### Get Profile
```
GET /api/v1/users/:userId

Headers:
Authorization: Bearer <accessToken>

Response (200):
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439020",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@example.com",
      "role": "student",
      "avatar": "https://res.cloudinary.com/...",
      "bio": "Passionate about software development",
      "skills": ["JavaScript", "React", "Node.js"],
      "university": "Addis Ababa University",
      "graduationYear": 2025,
      "cv": "https://res.cloudinary.com/...",
      "externalLinks": [
        { "title": "GitHub", "url": "https://github.com/janesmith" },
        { "title": "Portfolio", "url": "https://janesmith.com" }
      ]
    }
  }
}
```

#### Update Profile
```
PUT /api/v1/users/:userId
Content-Type: application/json

Headers:
Authorization: Bearer <accessToken>

Body:
{
  "firstName": "Jane",
  "lastName": "Smith",
  "bio": "Passionate about software development",
  "skills": ["JavaScript", "React", "TypeScript"],
  "university": "Addis Ababa University",
  "graduationYear": 2025,
  "externalLinks": [
    { "title": "GitHub", "url": "https://github.com/janesmith" }
  ]
}

Response (200):
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": { /* updated user object */ }
  }
}
```

#### Upload Avatar
```
POST /api/v1/users/:userId/avatar
Content-Type: multipart/form-data

Headers:
Authorization: Bearer <accessToken>

Body:
FormData:
- avatar: <Image File>

Response (200):
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "avatarUrl": "https://res.cloudinary.com/..."
  }
}
```

#### Upload CV
```
POST /api/v1/users/:userId/cv
Content-Type: multipart/form-data

Headers:
Authorization: Bearer <accessToken>

Body:
FormData:
- cv: <PDF/Document File>

Response (200):
{
  "success": true,
  "message": "CV uploaded successfully",
  "data": {
    "cvUrl": "https://res.cloudinary.com/..."
  }
}
```

---

## Features & Functionality

### 1. User Authentication & Authorization

#### Registration
- **Two-factor registration** (credentials-based)
- **Email verification** before account activation
- **Role-based setup** (Student vs Employer)
- **Additional onboarding** for employers (company details)

#### Login & Session Management
- **JWT-based authentication** (Access + Refresh tokens)
- **Automatic token refresh** when expired
- **Secure password storage** (bcryptjs hashing)
- **Session persistence** on device
- **Logout with token invalidation**

#### Role-Based Access Control
- **Student permissions:** View jobs, apply, track applications, message employers
- **Employer permissions:** Post jobs, review applications, manage postings, message applicants

### 2. Job Discovery & Management

#### Search & Discovery
- **Full-text search** across job title and description
- **Advanced filtering:**
  - Job type (internship, part-time, full-time, contract)
  - Location (remote, on-site, hybrid)
  - Experience level (entry, mid, senior)
  - Salary range
  - Required skills
  - Company name
- **Sorting options:**
  - Newest first (default)
  - Most applicants
  - Salary (high to low)
  - Deadline approaching

#### Job Posting (Employer)
- **Rich text job description** with formatting
- **Requirement & responsibility** lists
- **Skills tagging** with autocomplete
- **Deadline setting** for applications
- **Draft save** functionality
- **Preview before publishing**
- **Job status management** (active, closed, draft)

#### Saved Jobs
- **Save for later** feature
- **View saved jobs** in separate section
- **Remove from saved**
- **Quick apply** from saved list

### 3. Application Tracking System

#### Student Side
- **Kanban-style dashboard** showing application status
- **Real-time status updates** from employers
- **View detailed job** from application card
- **Withdraw application** option
- **Application history** with timestamps
- **Application statistics** (total, accepted, rejected)

#### Employer Side
- **Incoming applications** dashboard
- **Organize by status** columns
- **Drag-and-drop** to update status
- **Bulk actions** (shortlist multiple, reject multiple)
- **Applicant details** with CV download
- **Leave notes** on applications
- **Export applicant list**
- **Application timeline** view

### 4. Messaging & Communication

#### Real-Time Chat
- **Instant message delivery** via Socket.io
- **Message history** with pagination
- **Typing indicators** to show when user is typing
- **Delivery status** indicators
- **File/Document sharing**
- **Timestamp** on every message
- **Read receipts** (optional)

#### Conversations
- **List of all conversations**
- **Unread message counter**
- **Search conversations** by participant name
- **Archive/Unarchive** conversations (optional)
- **Sort** by recent activity

### 5. User Profiles

#### Student Profile
- **Profile information:**
  - Name, email, bio
  - University & graduation year
  - Skills with proficiency levels
  - Work experience
  - Education history
- **Media uploads:**
  - Profile avatar
  - CV/Resume (PDF)
- **External links:**
  - Portfolio website
  - GitHub profile
  - LinkedIn profile
- **Privacy settings:** Control profile visibility

#### Employer Profile
- **Company information:**
  - Company name & logo
  - Industry & company size
  - Company description
  - Contact information
  - Website & social links
- **Recruiter details:**
  - Name & title
  - Contact email
  - Profile picture
- **Company statistics:**
  - Jobs posted count
  - Active jobs
  - Total applications received

### 6. Notifications

#### Types of Notifications
- **Application received** (employer)
- **Application status update** (student)
- **New message** (both)
- **Job posted** (for followed companies)
- **Deadline approaching** (student)
- **Profile view** (employer)

#### Notification Delivery
- **In-app notifications** (badge count)
- **Push notifications** (if enabled)
- **Email notifications** (digest or real-time)

### 7. Data Export & Reports

#### Student Reports
- **Applications summary** (PDF export)
- **Application timeline** visual
- **Skills progress** chart

#### Employer Reports
- **Applicant list** (CSV export)
- **Application statistics** dashboard
- **Job performance** metrics
- **Hiring analytics** (time to hire, etc.)

---

## Development Guidelines

### Code Style & Standards

#### JavaScript/React Native Standards
```javascript
// File naming
- Components: PascalCase (JobCard.js)
- Utils: camelCase (jobUtils.js)
- Constants: UPPER_CASE (COLORS.js)

// Function naming
- React components: PascalCase
- Functions: camelCase
- Constants: UPPER_CASE
- Private methods: _leadingUnderscore()

// Imports organization
1. External libraries
2. Internal components
3. Utils & helpers
4. Types/Constants

import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { jobService } from '../services/jobService';
import { Colors } from '../constants/colors';
```

#### Express/Node.js Standards
```javascript
// Route organization
router.get('/path', middleware1, middleware2, controller);

// Error handling
try {
  // code
} catch (error) {
  console.error(error);
  return res.status(500).json({ error: error.message });
}

// Async/await preferred over callbacks
const getUser = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    throw error;
  }
};
```

### Git Workflow

#### Branch Naming Convention
```
feature/description          - New features
bugfix/description           - Bug fixes
hotfix/description           - Critical fixes
refactor/description         - Code refactoring
docs/description             - Documentation
chore/description            - Maintenance tasks
```

#### Commit Message Format
```
<type>: <subject>

<body>

Fixes #<issue-number>

Types: feat, fix, docs, style, refactor, test, chore
Subject: 50 chars or less
Body: Wrap at 72 chars
```

Example:
```
feat: Add job search with filters

- Implement search endpoint
- Add filter UI components
- Add integration tests

Fixes #123
```

### Testing Guidelines

#### Unit Tests (Backend)
```javascript
// Use Jest + Supertest
describe('Job Controller', () => {
  describe('getJobs', () => {
    it('should return list of jobs', async () => {
      const response = await request(app)
        .get('/api/v1/jobs')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.data.jobs).toBeInstanceOf(Array);
    });
  });
});
```

#### Component Tests (Frontend)
```javascript
// Use React Native Testing Library
import { render, screen } from '@testing-library/react-native';
import JobCard from '../JobCard';

describe('JobCard', () => {
  it('should display job title', () => {
    const job = { title: 'Developer', company: 'Tech Corp' };
    render(<JobCard job={job} />);
    
    expect(screen.getByText('Developer')).toBeTruthy();
  });
});
```

### Performance Optimization

#### Frontend
- **Image optimization:** Use appropriate dimensions, lazy load
- **List virtualization:** FlatList with optimization props
- **Code splitting:** Separate navigation stacks
- **State management:** Minimize re-renders with useMemo
- **API caching:** Cache responses in context
- **Bundle size:** Monitor with React Native bundle analyzer

#### Backend
- **Database indexing:** Index frequently queried fields
- **Query optimization:** Select only needed fields
- **Pagination:** Limit returned records
- **Caching:** Redis for frequent queries (future)
- **Compression:** Enable gzip response compression
- **Rate limiting:** Prevent abuse with express-rate-limit

### Security Best Practices

#### Authentication & Authorization
- ✅ Always validate JWT tokens
- ✅ Hash passwords with bcryptjs (minimum 10 rounds)
- ✅ Use HTTPS in production
- ✅ Implement CORS properly (specify allowed origins)
- ✅ Rotate refresh tokens regularly

#### Input Validation
- ✅ Validate all user inputs on backend
- ✅ Use express-validator for API inputs
- ✅ Trim and sanitize strings
- ✅ Validate email format
- ✅ Enforce password strength (minimum 8 chars, mixed case, numbers)

#### Data Protection
- ✅ Use environment variables for secrets
- ✅ Don't log sensitive information
- ✅ Implement rate limiting on sensitive endpoints
- ✅ Use Helmet.js for HTTP headers
- ✅ Enable CORS only for trusted origins

#### File Uploads
- ✅ Validate file type and size
- ✅ Use Cloudinary for file storage (no local storage)
- ✅ Scan uploads for malware (optional)
- ✅ Generate unique file names

---

## Troubleshooting

### Common Issues & Solutions

#### Backend Issues

##### Issue: MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
1. Check MongoDB Atlas connection string in .env
2. Verify network access in MongoDB Atlas (add your IP)
3. Ensure MongoDB is running (if local)
4. Check firewall settings
```bash
# Test connection
mongosh "mongodb+srv://username:password@cluster.mongodb.net/nileworks"
```

##### Issue: JWT Token Expired
```
Error: TokenExpiredError: jwt expired
```
**Solution:**
1. Implement automatic token refresh on client
2. Redirect to login on 401 unauthorized
3. Check JWT_ACCESS_EXPIRY in .env (should be short, e.g., 15m)
4. Check JWT_REFRESH_EXPIRY (should be long, e.g., 7d)

##### Issue: CORS Error
```
Error: Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
1. Check FRONTEND_URL in backend .env
2. Verify CORS middleware is configured:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```
3. Ensure credentials are included in fetch requests:
```javascript
axios.create({
  withCredentials: true
});
```

##### Issue: Cloudinary Upload Fails
```
Error: Unable to upload file
```
**Solution:**
1. Verify Cloudinary credentials in .env
2. Check file size (Cloudinary free has 100MB limit)
3. Verify file type is allowed
4. Check Cloudinary folder exists
```bash
# Test Cloudinary
curl -X POST https://api.cloudinary.com/v1_1/{cloud_name}/image/upload
```

#### Frontend Issues

##### Issue: Blank Screen on App Launch
**Solution:**
1. Check console for errors: `npx expo start`
2. Clear Expo cache: `npx expo start -c`
3. Verify API endpoint in `constants/endpoints.js`
4. Check network connectivity
5. Restart Expo Go app

##### Issue: API Requests Fail (Network Error)
```
Network Error: Unable to reach server
```
**Solution:**
1. Verify backend is running: `curl http://localhost:5000`
2. Check IPv4 address in endpoints.js matches your machine
3. Ensure mobile device and computer are on same Wi-Fi
4. Disable VPN if enabled
5. Check firewall isn't blocking port 5000

##### Issue: Images Not Loading
**Solution:**
1. Verify Cloudinary URLs are correct
2. Check Cloudinary account is active
3. Verify image transformation URLs are valid
4. Check network connectivity
5. Enable image caching in app

##### Issue: Socket.io Connection Fails
```
Socket connection error: Connection failed
```
**Solution:**
1. Verify Socket.io is initialized on backend
2. Check socket connection URL in frontend
3. Ensure CORS is configured for Socket.io:
```javascript
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"]
  }
});
```
4. Check firewall allows WebSocket connections

### Performance Issues

#### Slow API Responses
```
// Check response time in browser/mobile
Time-taken: 3000ms (should be < 1000ms)
```

**Solution:**
1. Check MongoDB query performance
   - Verify indexes are created
   - Avoid N+1 queries (use populate efficiently)
2. Add pagination to list endpoints
3. Cache frequently accessed data
4. Enable gzip compression
5. Use CDN for static assets

#### High Memory Usage
**Solution:**
1. Check for memory leaks in Socket.io listeners
2. Limit concurrent connections
3. Implement proper cleanup in useEffect hooks
4. Monitor with process manager (PM2)

### Debugging Tips

#### Enable Debug Mode
```bash
# Backend
DEBUG=* npm run dev

# Frontend
EXPO_DEBUG=true npx expo start
```

#### Check Logs
```javascript
// Backend
console.error('Detailed error:', error.stack);
console.log('User:', req.user);

// Frontend
console.log('State:', state);
console.error('Error:', error);
```

#### Use Developer Tools
- **Backend:** Postman or Insomnia for API testing
- **Frontend:** React Native Debugger or Expo DevTools
- **Database:** MongoDB Compass for data inspection
- **Network:** Charles Proxy or Fiddler for monitoring

---

## Contributing

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** following code standards
4. **Write/update tests** for your changes
5. **Commit with meaningful message** (`git commit -m 'feat: Add amazing feature'`)
6. **Push to branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request** with detailed description

### Pull Request Checklist
- [ ] Code follows project style guidelines
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Commit messages are clear and descriptive

### Development Setup for Contributors

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/Nileworks-group-project.git

# 2. Add upstream remote
git remote add upstream https://github.com/yonas-woldeyohanis/Nileworks-group-project.git

# 3. Create feature branch
git checkout -b feature/your-feature

# 4. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 5. Start development
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npx expo start

# 6. Make changes and test

# 7. Commit and push
git add .
git commit -m 'feat: Your feature description'
git push origin feature/your-feature
```

### Need Help?

- **Issues:** Check existing issues or create a new one
- **Discussions:** Use GitHub Discussions for questions
- **Documentation:** Refer to this document
- **Chat:** Reach out to team members

---

## License

This project is licensed under the MIT License - see LICENSE file for details.

---

## Project Information

- **Project Name:** NileWorks
- **Repository:** https://github.com/yonas-woldeyohanis/Nileworks-group-project
- **Type:** Capstone Project
- **Target Users:** Ethiopian University Students & Employers
- **Status:** Active Development
- **Last Updated:** January 2024

---

**For more information or questions, please open an issue on GitHub or contact the development team.**
