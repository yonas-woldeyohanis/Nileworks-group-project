import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { getInitials } from '../../utils/helpers';

const Avatar = ({
  uri,
  name,
  size = 44,
  borderRadius,
  showBorder = false,
  borderColor,
}) => {
  const { colors: COLORS } = useTheme();
  const radius = borderRadius ?? size / 2;
  const fontSize = size * 0.38;
  const finalBorderColor = borderColor || COLORS.primary;

  if (uri) {
    return (
      <View
        style={[
          { width: size, height: size, borderRadius: radius },
          showBorder && { borderWidth: 2, borderColor: finalBorderColor },
        ]}
      >
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius: radius }}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={COLORS.gradientPrimary}
      style={[
        styles.fallback,
        { width: size, height: size, borderRadius: radius },
        showBorder && { borderWidth: 2, borderColor: finalBorderColor },
      ]}
    >
      <Text style={[styles.initials, { fontSize }]}>
        {getInitials(name)}
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontFamily: FONTS.bold,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});

export default Avatar;
