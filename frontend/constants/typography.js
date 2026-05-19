export const FONTS = {
  // DM Sans — clean, modern, professional body
  regular: 'DMSans_400Regular',
  medium: 'DMSans_500Medium',
  semiBold: 'DMSans_600SemiBold',
  bold: 'DMSans_700Bold',

  // Playfair Display — editorial, premium for headings
  displayRegular: 'PlayfairDisplay_400Regular',
  displayBold: 'PlayfairDisplay_700Bold',
  displayItalic: 'PlayfairDisplay_400Regular_Italic',
};

export const FONT_SIZES = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 34,
  '5xl': 42,
};

export const LINE_HEIGHTS = {
  tight: 1.2,
  snug: 1.35,
  normal: 1.5,
  relaxed: 1.65,
};

export const TYPOGRAPHY = {
  hero: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: FONT_SIZES['4xl'],
    lineHeight: FONT_SIZES['4xl'] * LINE_HEIGHTS.tight,
    color: '#0D1B2A',
  },
  h1: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: FONT_SIZES['3xl'],
    lineHeight: FONT_SIZES['3xl'] * LINE_HEIGHTS.snug,
    color: '#0D1B2A',
  },
  h2: {
    fontFamily: 'DMSans_700Bold',
    fontSize: FONT_SIZES['2xl'],
    lineHeight: FONT_SIZES['2xl'] * LINE_HEIGHTS.snug,
    color: '#0D1B2A',
  },
  h3: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: FONT_SIZES.xl,
    lineHeight: FONT_SIZES.xl * LINE_HEIGHTS.normal,
    color: '#0D1B2A',
  },
  h4: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: FONT_SIZES.lg,
    lineHeight: FONT_SIZES.lg * LINE_HEIGHTS.normal,
    color: '#0D1B2A',
  },
  body: {
    fontFamily: 'DMSans_400Regular',
    fontSize: FONT_SIZES.base,
    lineHeight: FONT_SIZES.base * LINE_HEIGHTS.relaxed,
    color: '#4A5568',
  },
  bodyMedium: {
    fontFamily: 'DMSans_500Medium',
    fontSize: FONT_SIZES.base,
    lineHeight: FONT_SIZES.base * LINE_HEIGHTS.normal,
    color: '#4A5568',
  },
  label: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: FONT_SIZES.sm,
    lineHeight: FONT_SIZES.sm * LINE_HEIGHTS.normal,
    letterSpacing: 0.5,
    color: '#0D1B2A',
  },
  caption: {
    fontFamily: 'DMSans_400Regular',
    fontSize: FONT_SIZES.xs,
    lineHeight: FONT_SIZES.xs * LINE_HEIGHTS.normal,
    color: '#9BA3AF',
  },
  button: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: FONT_SIZES.base,
    letterSpacing: 0.3,
  },
};
