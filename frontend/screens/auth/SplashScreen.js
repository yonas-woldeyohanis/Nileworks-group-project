import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZES } from '../../constants/typography';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  const { colors: COLORS } = useTheme();
  const styles = React.useMemo(() => makeStyles(COLORS), [COLORS]);

  const logoScale = React.useRef(new Animated.Value(0.3)).current;
  const logoOpacity = React.useRef(new Animated.Value(0)).current;
  const taglineOpacity = React.useRef(new Animated.Value(0)).current;
  const taglineY = React.useRef(new Animated.Value(20)).current;
  const circleScale = React.useRef(new Animated.Value(0)).current;
  const wave1X = React.useRef(new Animated.Value(-width)).current;
  const wave2X = React.useRef(new Animated.Value(-width)).current;
  const floatY = React.useRef(new Animated.Value(0)).current;

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

    // Floating logo animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, { toValue: -8, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(floatY, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
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

    // Finish after 4.0s
    const timer = setTimeout(() => {
      onFinish?.();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const logoStyle = {
    opacity: logoOpacity,
    transform: [{ scale: logoScale }, { translateY: floatY }],
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
        <View style={[styles.letterMark, { backgroundColor: COLORS.accent }]}>
          <Ionicons name="water" size={44} color="#fff" />
          <View style={[styles.accentDot, { borderColor: COLORS.accent }]} />
        </View>
        <Text style={styles.wordmark}>NileWorks</Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.View style={[styles.taglineContainer, taglineStyle]}>
        <Text style={styles.tagline}>Flow into your career.</Text>
      </Animated.View>

      {/* Bottom wave decoration */}
      <View style={styles.waveContainer}>
        <View style={styles.waveLine1} />
        <View style={styles.waveLine2} />
      </View>
    </LinearGradient>
  );
};

const makeStyles = (COLORS) => StyleSheet.create({
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
    width: 96,
    height: 96,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 25,
    elevation: 15,
  },
  accentDot: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: COLORS.primary,
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
