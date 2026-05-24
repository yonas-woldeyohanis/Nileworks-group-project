# NileWorks

NileWorks is a comprehensive mobile application designed to bridge the gap between Ethiopian university students and local employers. The platform streamlines the process of finding internships, part-time work, and full-time early-career opportunities by offering a dedicated, localized job board with real-time communication tools.

## System Architecture

The project follows a modern client-server architecture:
- **Client Application:** Built with React Native and Expo, providing a cross-platform mobile experience for both students and employers.
- **RESTful API:** A robust Node.js and Express backend handling business logic, authentication, and data processing.
- **Database:** MongoDB configured with Mongoose for flexible data storage.
- **Real-time Engine:** Socket.io integration to support live messaging and notifications.
- **Media Storage:** Cloudinary integration for handling user avatars, company logos, and CV uploads.

## Local Development Setup

To run this project locally, you will need Node.js (v18+) and the Expo Go app installed on your mobile device.

### 1. Backend Configuration
Navigate to the `backend` directory and install the required dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the backend root and configure your environment variables:
```env
MONGO_URI=<Your MongoDB Atlas connection string>
CLOUDINARY_CLOUD_NAME=<Your Cloudinary cloud name>
CLOUDINARY_API_KEY=<Your API key>
CLOUDINARY_API_SECRET=<Your API secret>
JWT_ACCESS_SECRET=<Secure random string>
JWT_REFRESH_SECRET=<Secure random string>
EMAIL_USER=<Your SMTP/Gmail user>
EMAIL_PASS=<Your SMTP/Gmail App Password>
```

Start the development server:
```bash
npm run dev
```
The backend API will run on `https://nileworks-backend.onrender.com`.

### 2. Frontend Configuration
Open a new terminal, navigate to the `frontend` directory, and install dependencies:
```bash
cd frontend
npm install
```

Update the API URL to point to your local machine. Open `frontend/constants/endpoints.js` and update `BASE_URL`:
```javascript
// Replace with your machine's IPv4 address
export const BASE_URL = 'http://192.168.x.x:5000/api/v1';
```
*Note: Your mobile device and development machine must be connected to the same Wi-Fi network for local testing.*

Start the Expo bundler:
```bash
npx expo start
```
Use the Expo Go app on your physical device to scan the provided QR code and launch the application.

## Core Capabilities

### For Students
- **Opportunity Discovery:** Filtered search for remote, part-time, full-time, or internship roles.
- **Application Tracking:** A kanban-style dashboard to monitor the status of submitted applications.
- **Profile Management:** Dynamic profiles including CV uploads, skill tagging, and external links.
- **Direct Messaging:** Real-time chat functionality to communicate with recruiters.

### For Employers
- **Job Management:** Create, pause, and manage job listings with specific requirements and deadlines.
- **Applicant Review:** Review incoming applications, download CVs, and update candidate statuses.
- **Dashboard Analytics:** High-level metrics on active jobs and applicant engagement.
- **Candidate Outreach:** Initiate direct conversations with promising applicants.

## Technologies Used
- **Frontend:** React Native, Expo, React Navigation
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas, Mongoose
- **Authentication:** JWT dual-token system (Access & Refresh)
- **File Management:** Multer, Cloudinary API

---
*Developed as a capstone project focusing on practical employment solutions for Ethiopian university students.*
