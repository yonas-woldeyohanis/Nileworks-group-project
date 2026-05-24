import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { BORDER_RADIUS, LAYOUT } from '../../constants/layout';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  multiline = false,
  numberOfLines = 1,
  icon,
  editable = true,
  style,
  inputStyle,
  onBlur,
  onFocus: onFocusProp,
  returnKeyType,
  onSubmitEditing,
  autoComplete,
}) => {
  const { colors: COLORS, SHADOWS } = useTheme();
  const styles = React.useMemo(() => makeStyles(COLORS), [COLORS]);

  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const inputRef = useRef(null);

  const handleFocus = () => {
    setIsFocused(true);
    onFocusProp?.();
    Animated.spring(labelAnim, {
      toValue: 1,
      useNativeDriver: false,
      damping: 20,
      stiffness: 200,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
    if (!value) {
      Animated.spring(labelAnim, {
        toValue: 0,
        useNativeDriver: false,
        damping: 20,
        stiffness: 200,
      }).start();
    }
  };

  const labelTop = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [multiline ? 16 : 16, -9],
  });
  const labelFontSize = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [FONT_SIZES.base, FONT_SIZES.xs],
  });
  const labelColor = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.textMuted, isFocused ? COLORS.primary : COLORS.textSecondary],
  });

  const borderColor = error
    ? COLORS.error
    : isFocused
    ? COLORS.primary
    : COLORS.border;

  return (
    <View style={[styles.wrapper, style]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => inputRef.current?.focus()}
        style={[
          styles.container,
          multiline && { height: numberOfLines * 24 + 32, alignItems: 'flex-start' },
          { borderColor },
          isFocused && SHADOWS.sm,
        ]}
      >
        {/* Floating Label */}
        <Animated.Text
          style={[
            styles.label,
            { top: labelTop, fontSize: labelFontSize, color: labelColor },
            icon && { left: 44 },
          ]}
        >
          {label}
        </Animated.Text>

        {/* Left Icon */}
        {icon && (
          <View style={styles.iconLeft}>
            <Ionicons
              name={icon}
              size={18}
              color={isFocused ? COLORS.primary : COLORS.textMuted}
            />
          </View>
        )}

        {/* Input Field */}
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder=""
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          autoComplete={autoComplete}
          style={[
            styles.input,
            icon && { paddingLeft: 36 },
            multiline && { paddingTop: 8, textAlignVertical: 'top' },
            inputStyle,
          ]}
          placeholderTextColor={COLORS.textMuted}
        />

        {/* Password Toggle */}
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.iconRight}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={COLORS.textMuted}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {/* Error Message */}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const makeStyles = (COLORS) => StyleSheet.create({
  wrapper: { marginBottom: 20 },
  container: {
    height: LAYOUT.inputHeight,
    borderWidth: 1.5,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    position: 'relative',
  },
  label: {
    position: 'absolute',
    left: 16,
    fontFamily: FONTS.regular,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 4,
    zIndex: 1,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.base,
    color: COLORS.textPrimary,
    paddingTop: 10,
    paddingBottom: 0,
  },
  iconLeft: { marginRight: 10, marginTop: 2 },
  iconRight: { padding: 4 },
  error: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: COLORS.error,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default Input;
