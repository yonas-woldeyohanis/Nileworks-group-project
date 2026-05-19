import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import api from '../../services/api';
import { ENDPOINTS } from '../../constants/endpoints';
import { COLORS } from '../../constants/colors';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING, BORDER_RADIUS } from '../../constants/layout';

const JOB_TYPES = ['internship', 'part-time', 'full-time', 'remote'];
const CITIES = ['Addis Ababa', 'Dire Dawa', 'Hawassa', 'Bahir Dar', 'Mekelle', 'Adama', 'Jimma', 'Remote'];

const Chip = ({ label, active, onPress }) => (
  <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
    <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
  </Pressable>
);

const PostJobScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    jobType: '',
    salary: '',
    openings: '1',
    deadline: '',
    skills: [],
    isPaid: true,
    isFeatured: false,
  });
  const [errors, setErrors] = useState({});

  const update = (key, val) => { setForm(f => ({ ...f, [key]: val })); setErrors(e => ({ ...e, [key]: null })); };

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s || form.skills.includes(s)) return;
    update('skills', [...form.skills, s]);
    setSkillInput('');
  };

  const removeSkill = (skill) => update('skills', form.skills.filter(s => s !== skill));

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Job title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (form.description.trim().length < 50) errs.description = 'Description must be at least 50 characters';
    if (!form.jobType) errs.jobType = 'Select a job type';
    if (!form.location) errs.location = 'Select a location';
    if (!form.deadline.trim()) errs.deadline = 'Deadline is required (YYYY-MM-DD)';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePost = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post(ENDPOINTS.JOBS.CREATE, {
        ...form,
        openings: parseInt(form.openings) || 1,
      });
      Alert.alert('Job Posted!', 'Your listing is now live and students can apply.', [
        { text: 'View Dashboard', onPress: () => navigation.navigate('EmployerHome') },
      ]);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Could not post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <Header title="Post a Job" onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        <Input label="Job Title" value={form.title} onChangeText={t => update('title', t)} icon="briefcase-outline" error={errors.title} autoCapitalize="words" />

        <Input
          label="Job Description"
          value={form.description}
          onChangeText={t => update('description', t)}
          multiline
          numberOfLines={6}
          error={errors.description}
          style={{ marginBottom: 20 }}
        />

        {/* Job Type */}
        <Text style={styles.label}>Job Type *</Text>
        <View style={styles.chipRow}>
          {JOB_TYPES.map(type => (
            <Chip key={type} label={type.replace('-', ' ')} active={form.jobType === type} onPress={() => update('jobType', type)} />
          ))}
        </View>
        {errors.jobType && <Text style={styles.error}>{errors.jobType}</Text>}

        {/* Location */}
        <Text style={[styles.label, { marginTop: SPACING.lg }]}>Location *</Text>
        <View style={styles.chipRow}>
          {CITIES.map(city => (
            <Chip key={city} label={city} active={form.location === city} onPress={() => update('location', city)} />
          ))}
        </View>
        {errors.location && <Text style={styles.error}>{errors.location}</Text>}

        <Input label="Salary / Stipend (e.g. 5,000 ETB/month)" value={form.salary} onChangeText={t => update('salary', t)} icon="cash-outline" style={{ marginTop: SPACING.lg }} />
        <Input label="Number of Openings" value={form.openings} onChangeText={t => update('openings', t)} keyboardType="number-pad" icon="people-outline" />
        <Input label="Application Deadline (YYYY-MM-DD)" value={form.deadline} onChangeText={t => update('deadline', t)} icon="calendar-outline" error={errors.deadline} placeholder="2025-12-31" />

        {/* Skills */}
        <Text style={styles.label}>Required Skills</Text>
        <View style={styles.skillsWrap}>
          {form.skills.map((s, i) => (
            <Pressable key={i} style={styles.skillChip} onPress={() => removeSkill(s)}>
              <Text style={styles.skillText}>{s}</Text>
              <Ionicons name="close" size={12} color={COLORS.primary} style={{ marginLeft: 4 }} />
            </Pressable>
          ))}
        </View>
        <View style={styles.skillInputRow}>
          <Input label="Add a skill" value={skillInput} onChangeText={setSkillInput} style={{ flex: 1, marginBottom: 0 }} returnKeyType="done" onSubmitEditing={addSkill} />
          <Pressable style={styles.addBtn} onPress={addSkill}>
            <Ionicons name="add" size={20} color="#fff" />
          </Pressable>
        </View>

        {/* Toggles */}
        <View style={styles.toggleRow}>
          <View>
            <Text style={styles.toggleLabel}>Paid position</Text>
            <Text style={styles.toggleSub}>Compensation is provided for this role</Text>
          </View>
          <Pressable onPress={() => update('isPaid', !form.isPaid)} style={[styles.toggle, form.isPaid && styles.toggleOn]}>
            <View style={[styles.thumb, form.isPaid && styles.thumbOn]} />
          </Pressable>
        </View>

        <Button title="Post Job Listing" onPress={handlePost} loading={loading} style={{ marginTop: SPACING.xl }} icon={<Ionicons name="checkmark-circle-outline" size={18} color="#fff" />} iconPosition="right" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.base, paddingBottom: 48 },
  label: { fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginBottom: 10, letterSpacing: 0.3 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: BORDER_RADIUS.full, backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontFamily: FONTS.medium, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  chipTextActive: { color: '#fff' },
  error: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.xs, color: COLORS.error, marginTop: 4, marginLeft: 4 },
  skillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  skillChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: BORDER_RADIUS.full, backgroundColor: COLORS.primary + '12', borderWidth: 1, borderColor: COLORS.primary + '30' },
  skillText: { fontFamily: FONTS.medium, fontSize: FONT_SIZES.sm, color: COLORS.primary },
  skillInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  addBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.base, borderTopWidth: 1, borderTopColor: COLORS.border, marginTop: SPACING.base },
  toggleLabel: { fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.base, color: COLORS.textPrimary },
  toggleSub: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.xs, color: COLORS.textMuted, marginTop: 2 },
  toggle: { width: 48, height: 28, borderRadius: 14, backgroundColor: COLORS.border, justifyContent: 'center', paddingHorizontal: 2 },
  toggleOn: { backgroundColor: COLORS.primary },
  thumb: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff' },
  thumbOn: { alignSelf: 'flex-end' },
});

export default PostJobScreen;
