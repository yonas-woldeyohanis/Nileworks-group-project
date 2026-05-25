# Nileworks Group Project

NileWorks is a mobile platform built to connect Ethiopian university students with internship, part-time, and entry-level job opportunities. The application provides a centralized space where students can discover opportunities, manage applications, and communicate directly with employers in real time.

The project was developed with a focus on accessibility, local relevance, and practical career support for students entering the workforce.

---

# Features

## Student Features
- Browse internship, remote, part-time, and full-time opportunities
- Search and filter jobs by category, type, and requirements
- Track application progress through a visual dashboard
- Build and manage professional profiles
- Upload CVs and showcase skills
- Chat directly with recruiters in real time

## Employer Features
- Create and manage job postings
- Review applications and candidate profiles
- Download submitted CVs
- Update applicant statuses
- Communicate with applicants instantly
- Monitor recruitment activity through dashboard insights

---

# System Architecture

NileWorks follows a modern client-server architecture designed for scalability and real-time interaction.

## Frontend
- React Native
- Expo
- React Navigation

## Backend
- Node.js
- Express.js

## Database
- MongoDB Atlas
- Mongoose ODM

## Real-Time Communication
- Socket.io

## Media & File Storage
- Cloudinary
- Multer

## Authentication
- JWT Access & Refresh Token System

---

# Project Structure

```bash
NileWorks/
│
├── backend/        # Express API and server-side logic
├── frontend/       # React Native mobile application
└── README.md
```

---

# Local Development Setup

## Prerequisites

Make sure the following tools are installed:

- Node.js (v18 or later)
- npm
- Expo Go mobile app
- MongoDB Atlas account
- Cloudinary account

---

# Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the backend directory and configure the following variables:

```env
MONGO_URI=your_mongodb_connection_string

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

Start the backend server:

```bash
npm run dev
```

The API will run on:

```bash
http://localhost:5000
```

---

# Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Update the API base URL in:

```bash
frontend/constants/endpoints.js
```

Example:

```javascript
export const BASE_URL = 'http://192.168.x.x:5000/api/v1';
```

> Replace `192.168.x.x` with your machine’s local IPv4 address.

Start the Expo development server:

```bash
npx expo start
```

Scan the QR code using the Expo Go app to launch the application on your mobile device.

> Ensure your phone and development machine are connected to the same Wi-Fi network.

---

# Core Functionalities

## Job Discovery
Students can explore opportunities tailored to their interests, skills, and availability.

## Real-Time Messaging
Integrated chat functionality enables direct communication between students and employers.

## Application Management
Students can track application progress, while employers can manage candidate workflows efficiently.

## Profile & CV Management
Users can upload CVs, update professional information, and maintain a complete profile.

---

# API & Backend Highlights

- RESTful API architecture
- Secure JWT authentication
- Token refresh mechanism
- Cloud-based media storage
- Real-time event handling with Socket.io
- Modular and scalable backend structure

---

# Future Improvements

- Push notifications
- AI-powered job recommendations
- In-app interview scheduling
- Admin moderation dashboard
- Company verification system
- Multi-language support

---

# Development Goal

NileWorks was created as a capstone project focused on solving real employment accessibility challenges for university students in Ethiopia by providing a modern and localized recruitment platform.

---
