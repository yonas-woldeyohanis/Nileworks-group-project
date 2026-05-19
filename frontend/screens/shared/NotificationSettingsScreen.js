import React, { useState } from 'react';
import { View, StyleSheet, Text, Switch, ScrollView } from 'react-native';
import Header from '../../components/common/Header';
import { COLORS } from '../../constants/colors';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING, BORDER_RADIUS } from '../../constants/layout';

const NotificationSettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    jobAlerts: true,
    messages: true,
    applicationUpdates: true,
  });

  const toggleSwitch = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderSettingRow = (title, description, key) => (
    <View style={styles.settingRow}>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      <Switch
        trackColor={{ false: COLORS.border, true: COLORS.primary }}
        thumbColor="#fff"
        ios_backgroundColor={COLORS.border}
        onValueChange={() => toggleSwitch(key)}
        value={settings[key]}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Notification Preferences" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        
        <Text style={styles.sectionTitle}>Global Settings</Text>
        <View style={styles.sectionContainer}>
          {renderSettingRow('Push Notifications', 'Receive notifications on your device', 'pushNotifications')}
          {renderSettingRow('Email Notifications', 'Receive updates via email', 'emailNotifications')}
        </View>

        <Text style={styles.sectionTitle}>Notification Types</Text>
        <View style={styles.sectionContainer}>
          {renderSettingRow('Job Alerts', 'Get notified about new jobs matching your skills', 'jobAlerts')}
          {renderSettingRow('Messages', 'Get notified when employers send you messages', 'messages')}
          {renderSettingRow('Application Updates', 'Updates when your application status changes', 'applicationUpdates')}
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.base,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.base,
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  sectionContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: SPACING.base,
  },
  settingTitle: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.base,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  settingDescription: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
});

export default NotificationSettingsScreen;
