import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Pressable,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Avatar from '../../components/common/Avatar';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { ENDPOINTS } from '../../constants/endpoints';
import { COLORS, SHADOWS } from '../../constants/colors';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING, BORDER_RADIUS } from '../../constants/layout';

const EmployerProfileScreen = ({ navigation }) => {
  const { user, updateUser, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    companyDescription: user?.companyDescription || '',
    website: user?.website || '',
    linkedIn: user?.linkedIn || '',
    headquarters: user?.headquarters || '',
  });

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handlePickLogo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed', 'Please allow photo library access.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      const formData = new FormData();
      formData.append('logo', { uri: result.assets[0].uri, name: 'logo.jpg', type: 'image/jpeg' });
      try {
        const res = await api.patch(ENDPOINTS.EMPLOYER.UPLOAD_LOGO, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        await updateUser({ logo: res.data.data.logo });
      } catch { Alert.alert('Upload failed', 'Could not upload logo.'); }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.patch(ENDPOINTS.EMPLOYER.UPDATE_PROFILE, form);
      await updateUser(res.data.data);
      setEditing(false);
    } catch { Alert.alert('Error', 'Could not save profile changes.'); }
    finally { setSaving(false); }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Company Profile"
        rightAction={
          !editing ? (
            <TouchableOpacity onPress={() => setEditing(true)} style={styles.editBtn}>
              <Ionicons name="create-outline" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          ) : null
        }
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Hero */}
        <LinearGradient colors={COLORS.gradientHero} style={styles.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <TouchableOpacity onPress={handlePickLogo} style={styles.logoWrapper}>
            <Avatar uri={user?.logo} name={user?.companyName} size={80} borderRadius={20} showBorder borderColor="rgba(255,255,255,0.4)" />
            <View style={styles.cameraOverlay}>
              <Ionicons name="camera" size={14} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.companyName}>{user?.companyName}</Text>
          <Text style={styles.companyIndustry}>{user?.industry}</Text>
          <View style={styles.heroMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={13} color="rgba(255,255,255,0.6)" />
              <Text style={styles.metaText}>{user?.companySize} employees</Text>
            </View>
          </View>
        </LinearGradient>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the Company</Text>
          {editing ? (
            <Input label="Company Description" value={form.companyDescription} onChangeText={t => update('companyDescription', t)} multiline numberOfLines={5} style={{ marginBottom: 0 }} />
          ) : (
            <Text style={styles.descText}>{user?.companyDescription || 'No description yet. Add one to attract top talent.'}</Text>
          )}
        </View>

        {/* Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Links & Contact</Text>
          {editing ? (
            <>
              <Input label="Website" value={form.website} onChangeText={t => update('website', t)} icon="globe-outline" keyboardType="url" autoCapitalize="none" />
              <Input label="LinkedIn Company Page" value={form.linkedIn} onChangeText={t => update('linkedIn', t)} icon="logo-linkedin" keyboardType="url" autoCapitalize="none" style={{ marginBottom: 0 }} />
            </>
          ) : (
            <View style={styles.linksRow}>
              {user?.website && (
                <View style={styles.linkChip}>
                  <Ionicons name="globe-outline" size={15} color={COLORS.primary} />
                  <Text style={styles.linkText}>{user.website}</Text>
                </View>
              )}
              {user?.linkedIn && (
                <View style={styles.linkChip}>
                  <Ionicons name="logo-linkedin" size={15} color="#0A66C2" />
                  <Text style={styles.linkText}>LinkedIn</Text>
                </View>
              )}
              {!user?.website && !user?.linkedIn && (
                <Text style={styles.emptyText}>No links added.</Text>
              )}
            </View>
          )}
        </View>

        {editing && (
          <View style={styles.editActions}>
            <Button variant="outline" title="Cancel" onPress={() => setEditing(false)} fullWidth={false} style={{ flex: 1, marginRight: 8 }} />
            <Button title="Save Changes" onPress={handleSave} loading={saving} fullWidth={false} style={{ flex: 2 }} />
          </View>
        )}

        {/* Settings */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate('ChangePassword')}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.settingText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate('NotificationSettings')}>
            <Ionicons name="notifications-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.settingText}>Notification Preferences</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.settingRow, { borderBottomWidth: 0 }]} onPress={() => Alert.alert('Logout', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: logout },
          ])}>
            <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
            <Text style={[styles.settingText, { color: COLORS.error }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  editBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary + '12', justifyContent: 'center', alignItems: 'center' },
  content: { paddingBottom: 60 },
  hero: { alignItems: 'center', paddingVertical: SPACING['2xl'], paddingHorizontal: SPACING.base },
  logoWrapper: { position: 'relative', marginBottom: 14 },
  cameraOverlay: { position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: 13, backgroundColor: COLORS.accent, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  companyName: { fontFamily: FONTS.displayBold, fontSize: FONT_SIZES.xl, color: '#fff', marginBottom: 4 },
  companyIndustry: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.65)', marginBottom: 10 },
  heroMeta: { flexDirection: 'row', gap: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.xs, color: 'rgba(255,255,255,0.6)' },
  section: { backgroundColor: COLORS.surface, margin: SPACING.base, marginBottom: SPACING.sm, borderRadius: 20, padding: SPACING.base, ...SHADOWS.sm, borderWidth: 1, borderColor: COLORS.border + '40' },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: FONT_SIZES.base, color: COLORS.textPrimary, marginBottom: SPACING.sm },
  descText: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.base, color: COLORS.textSecondary, lineHeight: 22 },
  linksRow: { gap: 10 },
  linkChip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  linkText: { fontFamily: FONTS.medium, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  emptyText: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.sm, color: COLORS.textMuted },
  editActions: { flexDirection: 'row', marginHorizontal: SPACING.base, marginBottom: SPACING.base },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: SPACING.sm },
  settingText: { flex: 1, fontFamily: FONTS.medium, fontSize: FONT_SIZES.base },
});

export default EmployerProfileScreen;
