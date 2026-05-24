export const lightColors = {
  primary: '#1B3A6B',
  primaryText: '#1B3A6B',
  primaryLight: '#2A5298',
  primaryDark: '#102347',
  accent: '#F5A623',
  accentLight: '#FFB84D',
  accentDark: '#D4891A',
  accentAlt: '#0D9488', // Vibrant Teal
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  error: '#E53935',
  errorLight: '#FFEBEE',
  success: '#2E7D32',
  successLight: '#E8F5E9',
  warning: '#F57C00',
  warningLight: '#FFF3E0',
  info: '#0277BD',
  infoLight: '#E1F5FE',

  // Text
  textPrimary: '#0D1B2A',
  textSecondary: '#4A5568',
  textMuted: '#9BA3AF',
  textInverse: '#FFFFFF',

  // Borders & Dividers
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  divider: '#EDF2F7',

  // Status colors for Kanban
  statusApplied: '#3B82F6',
  statusViewed: '#8B5CF6',
  statusInterview: '#F59E0B',
  statusOffer: '#10B981',
  statusRejected: '#EF4444',

  // Overlays
  overlay: 'rgba(13, 27, 42, 0.5)',
  overlayLight: 'rgba(13, 27, 42, 0.2)',

  // Skeleton
  skeletonBase: '#E2E8F0',
  skeletonHighlight: '#F8FAFC',

  // Gradients (as arrays for LinearGradient)
  gradientPrimary: ['#1A365D', '#2B6CB0'], // Richer royal blue
  gradientAccent: ['#F5A623', '#FFB84D'],
  gradientTeal: ['#0F766E', '#14B8A6'],
  gradientPurple: ['#6B21A8', '#9333EA'],
  gradientCard: ['#FFFFFF', '#F8F9FA'],
  gradientHero: ['#071220', '#1A365D', '#2B6CB0'], // More vibrant hero
};

export const SHADOWS = {
  sm: {
    shadowColor: '#1B3A6B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#1B3A6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 5,
  },
  lg: {
    shadowColor: '#1B3A6B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  card: {
    shadowColor: '#1B3A6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
};

export const darkColors = {
  primary: '#1B3A6B',
  primaryText: '#60A5FA',
  primaryLight: '#2A5298',
  primaryDark: '#102347',
  accent: '#F5A623',
  accentLight: '#FFB84D',
  accentDark: '#D4891A',
  accentAlt: '#06B6D4', // Vibrant Cyan for Dark Mode
  
  // Backgrounds & Surfaces
  background: '#0B1120',
  surface: '#111827',
  surfaceElevated: '#1F2937',
  
  // States
  error: '#EF4444',
  errorLight: 'rgba(239, 68, 68, 0.1)',
  success: '#10B981',
  successLight: 'rgba(16, 185, 129, 0.1)',
  warning: '#F59E0B',
  warningLight: 'rgba(245, 158, 11, 0.1)',
  info: '#3B82F6',
  infoLight: 'rgba(59, 130, 246, 0.1)',

  // Text
  textPrimary: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textMuted: '#9CA3AF',
  textInverse: '#0B1120',

  // Borders & Dividers
  border: '#374151',
  borderLight: '#1F2937',
  divider: '#374151',

  // Status colors for Kanban
  statusApplied: '#3B82F6',
  statusViewed: '#8B5CF6',
  statusInterview: '#F59E0B',
  statusOffer: '#10B981',
  statusRejected: '#EF4444',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.4)',

  // Skeleton
  skeletonBase: '#1F2937',
  skeletonHighlight: '#374151',

  // Gradients
  gradientPrimary: ['#1E3A8A', '#3B82F6'], // Brighter blue for dark mode
  gradientAccent: ['#F5A623', '#FBBF24'],
  gradientTeal: ['#0D9488', '#2DD4BF'],
  gradientPurple: ['#7E22CE', '#A855F7'],
  gradientCard: ['#111827', '#1F2937'],
  gradientHero: ['#04080F', '#1E3A8A', '#3B82F6'], // Lighter dark hero
};

export const COLORS = lightColors;
