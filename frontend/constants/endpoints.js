// Replace with your actual backend URL when deploying
// For local development use your machine's LAN IP e.g. http://192.168.x.x:5000
export const BASE_URL = 'http://10.244.68.139:5000/api/v1';

export const ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER_STUDENT: '/auth/register/student',
    REGISTER_EMPLOYER: '/auth/register/employer',
    LOGIN: '/auth/login',
    REFRESH_TOKEN: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    VERIFY_OTP: '/auth/verify-otp',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
    LOGOUT: '/auth/logout',
  },

  // Student
  STUDENT: {
    PROFILE: '/students/profile',
    UPDATE_PROFILE: '/students/profile',
    UPLOAD_AVATAR: '/students/profile/avatar',
    UPLOAD_CV: '/students/profile/cv',
    SKILLS: '/students/skills',
  },

  // Employer
  EMPLOYER: {
    PROFILE: '/employers/profile',
    UPDATE_PROFILE: '/employers/profile',
    UPLOAD_LOGO: '/employers/profile/logo',
    ANALYTICS: '/employers/analytics',
  },

  // Jobs
  JOBS: {
    LIST: '/jobs',
    DETAIL: (id) => `/jobs/${id}`,
    FEATURED: '/jobs/featured',
    SEARCH: '/jobs/search',
    SAVE: (id) => `/jobs/${id}/save`,
    UNSAVE: (id) => `/jobs/${id}/unsave`,
    SAVED: '/jobs/saved',
    MY_LISTINGS: '/jobs/my-listings',
    CREATE: '/jobs',
    UPDATE: (id) => `/jobs/${id}`,
    DELETE: (id) => `/jobs/${id}`,
    TOGGLE_STATUS: (id) => `/jobs/${id}/toggle-status`,
  },

  // Applications
  APPLICATIONS: {
    APPLY: (jobId) => `/jobs/${jobId}/apply`,
    MY_APPLICATIONS: '/applications/my',
    EMPLOYER_APPLICANTS: '/applications/employer',
    JOB_APPLICANTS: (jobId) => `/jobs/${jobId}/applicants`,
    DETAIL: (id) => `/applications/${id}`,
    UPDATE_STATUS: (id) => `/applications/${id}/status`,
  },

  // Messages
  MESSAGES: {
    CONVERSATIONS: '/messages/conversations',
    CONVERSATION: (id) => `/messages/conversations/${id}`,
    SEND: (conversationId) => `/messages/conversations/${conversationId}/send`,
    START: '/messages/start',
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    REGISTER_TOKEN: '/notifications/register-token',
  },
};
