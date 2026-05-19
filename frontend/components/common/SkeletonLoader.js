import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { BORDER_RADIUS } from '../../constants/layout';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Single shimmer block
export const SkeletonBlock = ({ width = '100%', height = 16, borderRadius = BORDER_RADIUS.md, style }) => {
  const translateX = useRef(new Animated.Value(-SCREEN_WIDTH)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: SCREEN_WIDTH,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [translateX]);

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: COLORS.skeletonBase,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}>
        <LinearGradient
          colors={[
            'transparent',
            'rgba(255,255,255,0.5)',
            'transparent',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

// Job Card Skeleton
export const JobCardSkeleton = () => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <SkeletonBlock width={48} height={48} borderRadius={12} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <SkeletonBlock height={16} width="70%" style={{ marginBottom: 8 }} />
        <SkeletonBlock height={12} width="45%" />
      </View>
    </View>
    <SkeletonBlock height={12} width="90%" style={{ marginTop: 16, marginBottom: 8 }} />
    <SkeletonBlock height={12} width="60%" />
    <View style={styles.cardFooter}>
      <SkeletonBlock height={24} width={80} borderRadius={BORDER_RADIUS.full} />
      <SkeletonBlock height={24} width={80} borderRadius={BORDER_RADIUS.full} />
    </View>
  </View>
);

// Profile Header Skeleton
export const ProfileSkeleton = () => (
  <View style={styles.profileContainer}>
    <SkeletonBlock width={90} height={90} borderRadius={45} style={{ alignSelf: 'center' }} />
    <SkeletonBlock height={20} width="50%" style={{ alignSelf: 'center', marginTop: 16 }} />
    <SkeletonBlock height={14} width="35%" style={{ alignSelf: 'center', marginTop: 8 }} />
    <View style={{ marginTop: 24 }}>
      {[1, 2, 3].map((i) => (
        <SkeletonBlock key={i} height={52} borderRadius={14} style={{ marginBottom: 16 }} />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  profileContainer: {
    padding: 20,
  },
});

export default SkeletonBlock;
