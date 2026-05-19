import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { FONTS, FONT_SIZES } from '../../constants/typography';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  const logoScale = React.useRef(new Animated.Value(0.3)).current;
  const logoOpacity = React.useRef(new Animated.Value(0)).current;
  const taglineOpacity = React.useRef(new Animated.Value(0)).current;
  const taglineY = React.useRef(new Animated.Value(20)).current;
  const circleScale = React.useRef(new Animated.Value(0)).current;
  const wave1X = React.useRef(new Animated.Value(-width)).current;
  const wave2X = React.useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    // Background circles
    Animated.spring(circleScale, { toValue: 1, friction: 6, tension: 60, useNativeDriver: true }).start();

    // Wave animations
    Animated.loop(
      Animated.timing(wave1X, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(wave2X, { toValue: 0, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(wave2X, { toValue: -width * 0.1, duration: 2200, useNativeDriver: true }),
      ])
    ).start();

    // Logo entrance
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, friction: 5, tension: 120, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 400, useNativeDriver: true })
      ])
    ]).start();

    // Tagline
    Animated.sequence([
      Animated.delay(600),
      Animated.parallel([
        Animated.timing(taglineOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(taglineY, { toValue: 0, friction: 6, useNativeDriver: true })
      ])
    ]).start();

    // Finish after 2.6s
    const timer = setTimeout(() => {
      onFinish?.();
    }, 2600);
    return () => clearTimeout(timer);
  }, []);

  const logoStyle = {
    opacity: logoOpacity,
    transform: [{ scale: logoScale }],
  };

  const taglineStyle = {
    opacity: taglineOpacity,
    transform: [{ translateY: taglineY }],
  };

  const circleStyle = {
    transform: [{ scale: circleScale }],
  };

  return (
    <LinearGradient colors={COLORS.gradientHero} style={styles.container}>
      <StatusBar style="light" />

      {/* Decorative ripple circles (Nile water theme) */}
      <Animated.View style={[styles.circle1, circleStyle]} />
      <Animated.View style={[styles.circle2, circleStyle]} />
      <Animated.View style={[styles.circle3, circleStyle]} />

      {/* Logo area */}
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        {/* N Water Drop Mark */}
        <View style={styles.letterMark}>
          <Ionicons name="water" size={38} color="#fff" />
          <View style={styles.accentDot} />
        </View>
        <Text style={styles.wordmark}>NileWorks</Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.View style={[styles.taglineContainer, taglineStyle]}>
        <Text style={styles.tagline}>Flow into your career.</Text>
        <Text style={styles.taglineSub}>Built for Ethiopian students.</Text>
      </Animated.View>

      {/* Bottom wave decoration */}
      <View style={styles.waveContainer}>
        <View style={styles.waveLine1} />
        <View style={styles.waveLine2} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle1: {
    position: 'absolute',
    width: width * 1.4,
    height: width * 1.4,
    borderRadius: width * 0.7,
    borderWidth: 1,
    borderColor: 'rgba(245,166,35,0.06)',
    top: -width * 0.5,
    right: -width * 0.5,
  },
  circle2: {
    position: 'absolute',
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    borderWidth: 1.5,
    borderColor: 'rgba(42,82,152,0.25)',
    bottom: -width * 0.15,
    left: -width * 0.3,
  },
  circle3: {
    position: 'absolute',
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: 'rgba(42,82,152,0.1)',
    bottom: height * 0.15,
    right: -width * 0.15,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  letterMark: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    position: 'relative',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 12,
  },
  accentDot: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: '#fff',
  },
  wordmark: {
    fontFamily: FONTS.displayBold,
    fontSize: FONT_SIZES['3xl'],
    color: '#fff',
    letterSpacing: 1.5,
  },
  taglineContainer: {
    alignItems: 'center',
  },
  tagline: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.lg,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  taglineSub: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.accent,
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  waveContainer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
    gap: 6,
  },
  waveLine1: {
    width: 60,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(245,166,35,0.4)',
  },
  waveLine2: {
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(245,166,35,0.2)',
  },
});

export default SplashScreen;
