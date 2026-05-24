import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZES } from '../../constants/typography';

const Header = ({
  title,
  subtitle,
  onBack,
  rightAction,
  transparent = false,
  light = false, // light text (for dark backgrounds)
}) => {
  const { colors: COLORS, SHADOWS } = useTheme();
  const styles = React.useMemo(() => makeStyles(COLORS, SHADOWS), [COLORS, SHADOWS]);
  
  const insets = useSafeAreaInsets();
  const textColor = light ? '#fff' : COLORS.textPrimary;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 8 },
        !transparent && { backgroundColor: COLORS.surface, ...SHADOWS.sm },
      ]}
    >
      <StatusBar
        barStyle={light ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.inner}>
        {/* Back button */}
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons
              name="chevron-back"
              size={24}
              color={light ? '#fff' : COLORS.primary}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: light ? 'rgba(255,255,255,0.7)' : COLORS.textMuted }]}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {/* Right action */}
        {rightAction ? (
          <View style={styles.rightAction}>{rightAction}</View>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
};

const makeStyles = (COLORS, SHADOWS) => StyleSheet.create({
  container: {
    paddingBottom: 12,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(27,58,107,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: { flex: 1, alignItems: 'center' },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.lg,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    marginTop: 1,
  },
  placeholder: { width: 36 },
  rightAction: { alignItems: 'flex-end' },
});

export default Header;
