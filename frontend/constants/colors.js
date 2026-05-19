export const COLORS = {
  primary: '#1B3A6B',
  primaryLight: '#2A5298',
  primaryDark: '#102347',
  accent: '#F5A623',
  accentLight: '#FFB84D',
  accentDark: '#D4891A',
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
  gradientPrimary: ['#1B3A6B', '#2A5298'],
  gradientAccent: ['#F5A623', '#FFB84D'],
  gradientCard: ['#FFFFFF', '#F8F9FA'],
  gradientHero: ['#071220', '#0D1B2A', '#1B3A6B'],
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
