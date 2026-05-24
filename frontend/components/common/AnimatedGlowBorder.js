import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedGlowBorder = ({ 
  children, 
  colors = ['#F5A623', '#06B6D4', '#F5A623'], 
  borderRadius = 30, 
  borderWidth = 3, 
  style 
}) => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotation]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { borderRadius }, style]}>
      <View style={[styles.gradientWrapper, { borderRadius }]}>
        <Animated.View style={[styles.animatedBox, { transform: [{ rotate }] }]}>
          <LinearGradient
            colors={colors}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>
      </View>
      
      <View style={[styles.innerContent, { borderRadius, padding: borderWidth }]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  gradientWrapper: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  animatedBox: {
    width: '250%',
    aspectRatio: 1,
    position: 'absolute',
  },
  gradient: {
    flex: 1,
  },
  innerContent: {
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AnimatedGlowBorder;
