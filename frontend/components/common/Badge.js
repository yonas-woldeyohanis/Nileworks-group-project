import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { BORDER_RADIUS } from '../../constants/layout';

const Badge = ({
  label,
  bg = '#F3F4F6',
  color = '#374151',
  size = 'sm',
  dot = false,
  style,
}) => {
  const sizes = {
    xs: { px: 6, py: 2, fontSize: FONT_SIZES.xs - 1 },
    sm: { px: 10, py: 4, fontSize: FONT_SIZES.xs },
    md: { px: 12, py: 6, fontSize: FONT_SIZES.sm },
  };
  const s = sizes[size] || sizes.sm;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          paddingHorizontal: s.px,
          paddingVertical: s.py,
        },
        style,
      ]}
    >
      {dot && (
        <View style={[styles.dot, { backgroundColor: color }]} />
      )}
      <Text style={[styles.label, { color, fontSize: s.fontSize }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: BORDER_RADIUS.full,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  label: {
    fontFamily: FONTS.semiBold,
    letterSpacing: 0.2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
});

export default Badge;
