import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { TYPOGRAPHY, FONTS } from '../../constants/typography';
import { BORDER_RADIUS, LAYOUT } from '../../constants/layout';

const Button = ({
  title,
  onPress,
  variant = 'primary', // primary | secondary | outline | ghost | danger
  size = 'md',         // sm | md | lg
  loading = false,
  disabled = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = true,
  style,
  textStyle,
}) => {
  const { colors: COLORS, SHADOWS } = useTheme();
  
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;
    Animated.spring(scaleAnim, { toValue: 0.95, friction: 5, tension: 100, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    if (disabled || loading) return;
    Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 100, useNativeDriver: true }).start();
  };

  const sizes = {
    sm: { height: 42, paddingHorizontal: 18, fontSize: 13, borderRadius: 14 },
    md: { height: LAYOUT.buttonHeight, paddingHorizontal: 24, fontSize: 15, borderRadius: 18 },
    lg: { height: 58, paddingHorizontal: 32, fontSize: 16, borderRadius: 20 },
  };

  const sizeStyle = sizes[size];
  const isDisabled = disabled || loading;

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return { useGradient: true, textColor: COLORS.textInverse };
      case 'secondary':
        return {
          useGradient: false,
          bg: COLORS.accent,
          textColor: COLORS.textInverse,
        };
      case 'outline':
        return {
          useGradient: false,
          bg: 'transparent',
          textColor: COLORS.primary,
          border: true,
        };
      case 'ghost':
        return {
          useGradient: false,
          bg: 'transparent',
          textColor: COLORS.primary,
        };
      case 'danger':
        return {
          useGradient: false,
          bg: COLORS.error,
          textColor: COLORS.textInverse,
        };
      default:
        return { useGradient: true, textColor: COLORS.textInverse };
    }
  };

  const variantStyle = getVariantStyles();

  const content = (
    <View style={styles.innerContent}>
      {loading ? (
        <ActivityIndicator
          color={variantStyle.textColor}
          size="small"
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          <Text
            style={[
              styles.label,
              { color: variantStyle.textColor, fontSize: sizeStyle.fontSize },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </>
      )}
    </View>
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      activeOpacity={0.75}
      style={[
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {variantStyle.useGradient ? (
        <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%', alignItems: 'center' }}>
          <LinearGradient
            colors={isDisabled ? [COLORS.textMuted, COLORS.textMuted] : COLORS.gradientPrimary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.base,
              { width: fullWidth ? '100%' : 'auto', height: sizeStyle.height, paddingHorizontal: sizeStyle.paddingHorizontal, borderRadius: sizeStyle.borderRadius },
              !isDisabled && SHADOWS.md,
            ]}
          >
            {content}
          </LinearGradient>
        </Animated.View>
      ) : (
        <Animated.View
          style={[
            styles.base,
            {
              transform: [{ scale: scaleAnim }],
              width: fullWidth ? '100%' : 'auto',
              height: sizeStyle.height,
              paddingHorizontal: sizeStyle.paddingHorizontal,
              borderRadius: sizeStyle.borderRadius,
              backgroundColor: isDisabled ? COLORS.border : variantStyle.bg,
              borderWidth: variantStyle.border ? 1.5 : 0,
              borderColor: COLORS.primary,
            },
            !isDisabled && variant !== 'ghost' && variant !== 'outline' && SHADOWS.sm,
          ]}
        >
          {content}
        </Animated.View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fullWidth: { width: '100%' },
  base: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: FONTS.bold,
    letterSpacing: 0.3,
  },
  iconLeft: { marginRight: 8 },
  iconRight: { marginLeft: 8 },
});

export default Button;
