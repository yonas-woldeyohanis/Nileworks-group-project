import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Pressable,
  Animated,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
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
import { calculateProfileCompleteness } from '../../utils/helpers';

const SKILL_SUGGESTIONS = [
  'Python', 'JavaScript', 'React', 'Node.js', 'Data Analysis',
  'Machine Learning', 'Communication', 'Leadership', 'Excel',
  'SQL', 'UI/UX Design', 'Marketing', 'Accounting', 'Java', 'C++',
];

const StudentProfileScreen = ({ navigation }) => {
  const { user, updateUser, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const [form, setForm] = useState({
    bio: user?.bio || '',
    skills: user?.skills || [],
    linkedIn: user?.linkedIn || '',
    portfolio: user?.portfolio || '',
    gpaRange: user?.gpaRange || '',
  });

  const completeness = calculateProfileCompleteness({ ...user, ...form });
  const progressWidth = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressWidth, {
      toValue: completeness,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [completeness]);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const addSkill = (skill) => {
    const s = skill.trim();
    if (!s || form.skills.includes(s)) return;
    update('skills', [...form.skills, s]);
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    update('skills', form.skills.filter((s) => s !== skill));
  };

  const handlePickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow photo library access.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      const formData = new FormData();
      formData.append('avatar', {
        uri: result.assets[0].uri,
        name: 'avatar.jpg',
        type: 'image/jpeg',
      });
      try {
        const res = await api.patch(ENDPOINTS.STUDENT.UPLOAD_AVATAR, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        await updateUser({ avatar: res.data.data.avatar });
      } catch (err) {
        Alert.alert('Upload failed', 'Could not upload photo.');
      }
    }
  };

  const handlePickCV = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (!result.canceled) {
      const formData = new FormData();
      formData.append('cv', {
        uri: result.assets[0].uri,
        name: result.assets[0].name,
        type: 'application/pdf',
      });
      try {
        const res = await api.patch(ENDPOINTS.STUDENT.UPLOAD_CV, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        await updateUser({ cv: res.data.data.cv });
        Alert.alert('Success', 'CV uploaded successfully!');
      } catch (err) {
        Alert.alert('Upload failed', 'Could not upload CV.');
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.patch(ENDPOINTS.STUDENT.UPDATE_PROFILE, form);
      await updateUser(res.data.data);
      setEditing(false);
    } catch (err) {
      Alert.alert('Error', 'Could not save profile changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="My Profile"
        rightAction={
          !editing ? (
            <TouchableOpacity onPress={() => setEditing(true)} style={styles.editBtn}>
              <Ionicons name="create-outline" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          ) : null
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Profile hero */}
        <LinearGradient colors={COLORS.gradientHero} style={styles.profileHero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <TouchableOpacity onPress={handlePickAvatar} style={styles.avatarWrapper}>
            <Avatar uri={user?.avatar} name={user?.fullName} size={80} showBorder borderColor="rgba(255,255,255,0.5)" />
            <View style={styles.cameraOverlay}>
              <Ionicons name="camera" size={14} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.heroName}>{user?.fullName}</Text>
          <Text style={styles.heroSub}>{user?.university}</Text>
          <Text style={styles.heroDept}>{user?.department} · {user?.yearOfStudy}</Text>
        </LinearGradient>

        {/* Profile completeness */}
        <View style={[styles.completenessCard, SHADOWS.sm]}>
          <View style={styles.completenessHeader}>
            <Text style={styles.completenessTitle}>Profile Completeness</Text>
            <Text style={[styles.completenessPercent, completeness === 100 && { color: COLORS.success }]}>
              {completeness}%
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                { width: progressWidth.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) },
                { backgroundColor: completeness === 100 ? COLORS.success : COLORS.accent },
              ]}
            />
          </View>
          {completeness < 100 && (
            <Text style={styles.completenessTip}>
              {!user?.avatar && '📷 Add a profile photo · '}
              {!user?.bio && '✍️ Add a bio · '}
              {!user?.cv && '📄 Upload your CV'}
            </Text>
          )}
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          {editing ? (
            <Input
              label="Bio"
              value={form.bio}
              onChangeText={(t) => update('bio', t)}
              multiline
              numberOfLines={4}
              style={{ marginBottom: 0 }}
            />
          ) : (
            <Text style={styles.bioText}>
              {user?.bio || 'No bio added yet. Tap Edit to add one.'}
            </Text>
          )}
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsWrap}>
            {form.skills.map((skill, i) => (
              <View key={i} style={styles.skillChip}>
                <Text style={styles.skillText}>{skill}</Text>
                {editing && (
                  <TouchableOpacity onPress={() => removeSkill(skill)} style={{ marginLeft: 4 }}>
                    <Ionicons name="close" size={12} color={COLORS.primary} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          {editing && (
            <>
              <View style={styles.skillInputRow}>
                <Input
                  label="Add a skill"
                  value={skillInput}
                  onChangeText={setSkillInput}
                  style={{ flex: 1, marginBottom: 0 }}
                  returnKeyType="done"
                  onSubmitEditing={() => addSkill(skillInput)}
                />
                <TouchableOpacity style={styles.addSkillBtn} onPress={() => addSkill(skillInput)}>
                  <Ionicons name="add" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
                {SKILL_SUGGESTIONS.filter((s) => !form.skills.includes(s)).map((s, i) => (
                  <TouchableOpacity key={i} style={styles.suggestionChip} onPress={() => addSkill(s)}>
                    <Text style={styles.suggestionText}>+ {s}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}
        </View>

        {/* Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Links</Text>
          {editing ? (
            <>
              <Input
                label="LinkedIn URL"
                value={form.linkedIn}
                onChangeText={(t) => update('linkedIn', t)}
                icon="logo-linkedin"
                keyboardType="url"
                autoCapitalize="none"
              />
              <Input
                label="Portfolio / GitHub URL"
                value={form.portfolio}
                onChangeText={(t) => update('portfolio', t)}
                icon="globe-outline"
                keyboardType="url"
                autoCapitalize="none"
                style={{ marginBottom: 0 }}
              />
            </>
          ) : (
            <View style={styles.linksRow}>
              {user?.linkedIn ? (
                <TouchableOpacity style={styles.linkItem}>
                  <Ionicons name="logo-linkedin" size={18} color="#0A66C2" />
                  <Text style={styles.linkText}>LinkedIn</Text>
                </TouchableOpacity>
              ) : null}
              {user?.portfolio ? (
                <TouchableOpacity style={styles.linkItem}>
                  <Ionicons name="globe-outline" size={18} color={COLORS.primary} />
                  <Text style={styles.linkText}>Portfolio</Text>
                </TouchableOpacity>
              ) : null}
              {!user?.linkedIn && !user?.portfolio && (
                <Text style={styles.noLinks}>No links added yet.</Text>
              )}
            </View>
          )}
        </View>

        {/* CV */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CV / Resume</Text>
          <TouchableOpacity style={[styles.cvCard, SHADOWS.sm]} onPress={handlePickCV}>
            <Ionicons
              name={user?.cv ? 'document-text' : 'cloud-upload-outline'}
              size={22}
              color={user?.cv ? COLORS.success : COLORS.primary}
            />
            <Text style={styles.cvText}>
              {user?.cv ? 'CV Uploaded — Tap to replace' : 'Upload your CV (PDF)'}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Save / Cancel */}
        {editing && (
          <View style={styles.editActions}>
            <Button
              variant="outline"
              title="Cancel"
              onPress={() => setEditing(false)}
              fullWidth={false}
              style={{ flex: 1, marginRight: 8 }}
            />
            <Button
              title="Save Changes"
              onPress={handleSave}
              loading={saving}
              fullWidth={false}
              style={{ flex: 2 }}
            />
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
          <TouchableOpacity
            style={[styles.settingRow, { borderBottomWidth: 0 }]}
            onPress={() => Alert.alert('Logout', 'Are you sure you want to sign out?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign Out', style: 'destructive', onPress: logout },
            ])}
          >
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
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary + '12',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { paddingBottom: 60 },
  profileHero: {
    alignItems: 'center',
    paddingVertical: SPACING['2xl'],
    paddingHorizontal: SPACING.base,
  },
  avatarWrapper: { position: 'relative', marginBottom: 12 },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  heroName: { fontFamily: FONTS.displayBold, fontSize: FONT_SIZES.xl, color: '#fff', marginBottom: 2 },
  heroSub: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.7)' },
  heroDept: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.xs, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  completenessCard: {
    backgroundColor: COLORS.surface,
    margin: SPACING.base,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.base,
  },
  completenessHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  completenessTitle: { fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.sm, color: COLORS.textPrimary },
  completenessPercent: { fontFamily: FONTS.bold, fontSize: FONT_SIZES.base, color: COLORS.accent },
  progressTrack: {
    height: 8,
    backgroundColor: COLORS.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: { height: '100%', borderRadius: 4 },
  completenessTip: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.xs, color: COLORS.textMuted },
  section: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.sm,
    borderRadius: 20,
    padding: SPACING.base,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: COLORS.border + '40',
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.base,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  bioText: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.base, color: COLORS.textSecondary, lineHeight: 22 },
  skillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary + '12',
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  skillText: { fontFamily: FONTS.medium, fontSize: FONT_SIZES.sm, color: COLORS.primary },
  skillInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  addSkillBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.borderLight,
    marginRight: 6,
  },
  suggestionText: { fontFamily: FONTS.medium, fontSize: FONT_SIZES.xs, color: COLORS.textMuted },
  linksRow: { flexDirection: 'row', gap: 12 },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.borderLight,
    gap: 6,
  },
  linkText: { fontFamily: FONTS.medium, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  noLinks: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.sm, color: COLORS.textMuted },
  cvCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.borderLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.base,
    gap: 10,
  },
  cvText: { flex: 1, fontFamily: FONTS.medium, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  editActions: {
    flexDirection: 'row',
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.base,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    gap: 12,
  },
  settingText: {
    flex: 1,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.base,
    color: COLORS.textSecondary,
  },
});

export default StudentProfileScreen;
