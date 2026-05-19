import { formatDistanceToNow, format, isPast, differenceInDays } from 'date-fns';

// ─── Date Formatting ──────────────────────────────────────────────────────────
export const formatRelativeDate = (date) => {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return 'Unknown date';
  }
};

export const formatDate = (date, pattern = 'MMM dd, yyyy') => {
  try {
    return format(new Date(date), pattern);
  } catch {
    return '';
  }
};

export const getDeadlineStatus = (deadline) => {
  const date = new Date(deadline);
  if (isPast(date)) return { label: 'Expired', color: '#E53935', urgent: false };
  const days = differenceInDays(date, new Date());
  if (days <= 3) return { label: `${days}d left`, color: '#F57C00', urgent: true };
  if (days <= 7) return { label: `${days}d left`, color: '#F5A623', urgent: false };
  return { label: formatDate(deadline, 'MMM dd'), color: '#2E7D32', urgent: false };
};

// ─── Form Validation ──────────────────────────────────────────────────────────
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Must contain at least one uppercase letter';
  if (!/[0-9]/.test(password)) return 'Must contain at least one number';
  return null;
};

export const validateRequired = (value, fieldName) => {
  if (!value || value.toString().trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};

// ─── String Helpers ───────────────────────────────────────────────────────────
export const truncateText = (text, maxLength = 120) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '…';
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// ─── Job Type Badge Color ─────────────────────────────────────────────────────
export const getJobTypeBadge = (type) => {
  const map = {
    internship: { bg: '#EDE9FE', text: '#7C3AED', label: 'Internship' },
    'part-time': { bg: '#DBEAFE', text: '#1D4ED8', label: 'Part-time' },
    'full-time': { bg: '#D1FAE5', text: '#065F46', label: 'Full-time' },
    remote: { bg: '#FEF3C7', text: '#92400E', label: 'Remote' },
  };
  return map[type] || { bg: '#F3F4F6', text: '#374151', label: type };
};

// ─── Application Status ───────────────────────────────────────────────────────
export const getStatusConfig = (status) => {
  const map = {
    applied: { label: 'Applied', color: '#3B82F6', bg: '#EFF6FF' },
    viewed: { label: 'Viewed', color: '#8B5CF6', bg: '#F5F3FF' },
    shortlisted: { label: 'Shortlisted', color: '#F59E0B', bg: '#FFFBEB' },
    interview: { label: 'Interview', color: '#F59E0B', bg: '#FFFBEB' },
    offered: { label: 'Offered', color: '#10B981', bg: '#ECFDF5' },
    rejected: { label: 'Rejected', color: '#EF4444', bg: '#FEF2F2' },
  };
  return map[status] || { label: status, color: '#6B7280', bg: '#F9FAFB' };
};

// ─── Profile Completeness ─────────────────────────────────────────────────────
export const calculateProfileCompleteness = (profile) => {
  if (!profile) return 0;
  const fields = [
    !!profile.avatar,
    !!profile.bio,
    profile.skills?.length > 0,
    !!profile.university,
    !!profile.department,
    !!profile.yearOfStudy,
    !!profile.cv,
    !!profile.linkedIn || !!profile.portfolio,
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
};

// ─── File size formatter ──────────────────────────────────────────────────────
export const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
