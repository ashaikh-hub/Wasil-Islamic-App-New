import React, { useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, StatusBar, Image, ActivityIndicator } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WasilNewUploadBSvg, WasilNewUploadWSvg } from '../../assets/icons';
import { useTheme, Fonts, TypeScale, Spacing, Radius } from '../../theme';
import RemembranceHeader from './RemembranceHeader';
import { submitRemembrance } from './remembranceApi';

const MAX_DESCRIPTION_LENGTH = 200;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const PHOTO_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const EMPTY = { fullName: '', email: '', phone: '', relationship: '', lovedOneName: '', gender: '', description: '', photo: null };

const validate = (f) => {
  const e = {};
  if (!f.fullName.trim()) e.fullName = 'Please enter your full name.';
  if (!f.email.trim()) e.email = 'Please enter your email address.';
  else if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = 'Please enter a valid email address.';
  if (!f.phone.trim()) e.phone = 'Please enter your phone number.';
  if (!f.relationship.trim()) e.relationship = 'Please tell us your relationship.';
  if (!f.lovedOneName.trim()) e.lovedOneName = "Please enter your loved one's name.";
  if (!f.gender) e.gender = 'Please choose one.';
  if (!f.description.trim()) e.description = 'Please write a few words about them.';
  if (!f.photo?.uri) e.photo = 'Please add a photo.';
  return e;
};

const Field = ({ label, error, styles, children }) => (
  <View style={styles.field}>
    <Text style={styles.label}>
      {label} <Text style={styles.required}>*</Text>
    </Text>
    {children}
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>
);

const RemembranceForm = ({ navigation }) => {
  const { Colors, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const s = useMemo(() => makeStyles(Colors), [Colors]);
  const UploadIcon = theme === 'white' ? WasilNewUploadWSvg : WasilNewUploadBSvg;

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const refs = { email: useRef(), phone: useRef(), relationship: useRef(), lovedOneName: useRef(), description: useRef() };

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const pickPhoto = async () => {
    try {
      const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, includeBase64: false });
      if (result.didCancel) return;
      if (result.errorCode) {
        Alert.alert('Unable to select photo', result.errorMessage || 'Something went wrong.');
        return;
      }
      const asset = result.assets?.[0];
      if (!asset) return;
      if (asset.type && !PHOTO_TYPES.includes(asset.type.toLowerCase())) {
        setErrors((e) => ({ ...e, photo: 'Please choose a JPG or PNG image.' }));
        return;
      }
      if (asset.fileSize && asset.fileSize > MAX_PHOTO_BYTES) {
        setErrors((e) => ({ ...e, photo: 'Please choose an image smaller than 5 MB.' }));
        return;
      }
      update('photo', { uri: asset.uri, type: asset.type, fileName: asset.fileName });
    } catch (e) {
      Alert.alert('Error', 'Unable to open the photo gallery.');
    }
  };

  const submit = async () => {
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    setSubmitting(true);
    try {
      const data = new FormData();
      ['fullName', 'email', 'phone', 'relationship', 'lovedOneName', 'gender', 'description'].forEach((k) => data.append(k, form[k].trim()));
      data.append('photo', { uri: form.photo.uri, type: form.photo.type || 'image/jpeg', name: form.photo.fileName || 'remembrance-photo.jpg' });
      await submitRemembrance(data);
      setSubmitted(true);
      setForm(EMPTY);
    } catch (e) {
      Alert.alert('Submission failed', e.message || 'Unable to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <View style={[s.container, s.done]}>
        <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
        <Text style={s.doneArabic}>إِنَّا لِلَّٰهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ</Text>
        <Text style={s.doneTitle}>Thank you</Text>
        <Text style={s.doneText}>Your remembrance has been submitted. It will appear on the wall once it has been reviewed.</Text>
        <TouchableOpacity style={s.submit} onPress={() => navigation.navigate('Wallofremember')} accessibilityRole="button">
          <Text style={s.submitText}>View the wall</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSubmitted(false)} style={s.link} accessibilityRole="button">
          <Text style={s.linkText}>Add another</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const input = (field, props) => (
    <TextInput
      ref={refs[field]}
      value={form[field]}
      onChangeText={(v) => update(field, v)}
      placeholderTextColor={Colors.name === 'white' ? '#9C97A8' : 'rgba(255,255,255,0.5)'}
      style={[s.input, errors[field] && s.inputError]}
      {...props}
    />
  );

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xxl }}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      showsVerticalScrollIndicator={false}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      <RemembranceHeader
        title="Add a Beloved Soul"
        subtitle="Share the memory of your loved one and keep their legacy alive on our Wall of Remembrance."
      />

      <View style={s.section}>
        <Text style={s.sectionTitle}>Your information</Text>
        <Field label="Full name" error={errors.fullName} styles={s}>
          {input('fullName', { placeholder: 'Your full name', returnKeyType: 'next', autoComplete: 'name', onSubmitEditing: () => refs.email.current?.focus() })}
        </Field>
        <Field label="Email" error={errors.email} styles={s}>
          {input('email', {
            placeholder: 'you@example.com',
            keyboardType: 'email-address',
            autoCapitalize: 'none',
            autoComplete: 'email',
            returnKeyType: 'next',
            onSubmitEditing: () => refs.phone.current?.focus(),
          })}
        </Field>
        <Field label="Phone" error={errors.phone} styles={s}>
          {input('phone', { placeholder: 'Phone number', keyboardType: 'phone-pad', autoComplete: 'tel', returnKeyType: 'next', onSubmitEditing: () => refs.relationship.current?.focus() })}
        </Field>
        <Field label="Your relationship" error={errors.relationship} styles={s}>
          {input('relationship', { placeholder: 'e.g. Son, Daughter, Friend', returnKeyType: 'next', onSubmitEditing: () => refs.lovedOneName.current?.focus() })}
        </Field>
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>Your loved one</Text>
        <Field label="Name" error={errors.lovedOneName} styles={s}>
          {input('lovedOneName', { placeholder: "Loved one's full name", returnKeyType: 'next' })}
        </Field>
        <Field label="Gender" error={errors.gender} styles={s}>
          <View style={s.segment} accessibilityRole="radiogroup">
            {['Male', 'Female'].map((g) => {
              const active = form.gender === g;
              return (
                <TouchableOpacity
                  key={g}
                  style={[s.segmentItem, active && s.segmentItemActive]}
                  onPress={() => update('gender', g)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: active }}>
                  <Text style={[s.segmentText, active && s.segmentTextActive]}>{g}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Field>
        <Field label="A few words about them" error={errors.description} styles={s}>
          {input('description', {
            placeholder: 'Share a memory, their qualities, or a dua…',
            multiline: true,
            maxLength: MAX_DESCRIPTION_LENGTH,
            textAlignVertical: 'top',
            style: [s.input, s.textArea, errors.description && s.inputError],
          })}
          <Text style={s.counter}>
            {form.description.length}/{MAX_DESCRIPTION_LENGTH}
          </Text>
        </Field>
        <Field label="Photo" error={errors.photo} styles={s}>
          <TouchableOpacity style={[s.upload, errors.photo && s.inputError]} onPress={pickPhoto} accessibilityRole="button">
            {form.photo ? (
              <>
                <Image source={{ uri: form.photo.uri }} style={s.preview} />
                <Text style={s.uploadText}>Tap to change photo</Text>
              </>
            ) : (
              <>
                <UploadIcon />
                <Text style={s.uploadText}>Tap to upload a photo</Text>
                <Text style={s.uploadHint}>JPG or PNG, up to 5 MB</Text>
              </>
            )}
          </TouchableOpacity>
        </Field>
      </View>

      <TouchableOpacity style={[s.submit, submitting && { opacity: 0.8 }]} onPress={submit} disabled={submitting} accessibilityRole="button">
        {submitting ? <ActivityIndicator color={Colors.onButton} /> : <Text style={s.submitText}>Submit</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RemembranceForm;

const makeStyles = (Colors) => {
  const isLight = Colors.name === 'white';
  const tile = isLight ? Colors.surfaceAlt : Colors.surface;
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    section: { marginHorizontal: Spacing.lg, marginTop: Spacing.lg, padding: Spacing.lg, borderRadius: Radius.lg, backgroundColor: tile, gap: Spacing.md },
    sectionTitle: { fontSize: TypeScale.subtitle + 1, color: Colors.heading, fontFamily: Fonts.heading },
    field: { gap: Spacing.xs },
    label: { fontSize: TypeScale.small + 1, color: Colors.textPrimary, fontFamily: Fonts.bodySemiBold },
    required: { color: Colors.gold },
    input: {
      minHeight: 48,
      paddingHorizontal: Spacing.md,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: isLight ? '#D9D3E6' : 'rgba(255,255,255,0.18)',
      backgroundColor: isLight ? Colors.white : 'rgba(255,255,255,0.06)',
      fontSize: TypeScale.body + 1,
      color: Colors.textPrimary,
      fontFamily: Fonts.body,
    },
    inputError: { borderColor: '#E5484D' },
    textArea: { minHeight: 110, paddingTop: Spacing.md },
    counter: { alignSelf: 'flex-end', fontSize: TypeScale.caption, color: Colors.textSecondary, fontFamily: Fonts.body },
    error: { fontSize: TypeScale.small, color: '#FF8A8D', fontFamily: Fonts.body },
    segment: { flexDirection: 'row', padding: 3, borderRadius: Radius.md, backgroundColor: isLight ? Colors.white : 'rgba(255,255,255,0.06)' },
    segmentItem: { flex: 1, minHeight: 42, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
    segmentItemActive: { backgroundColor: Colors.button },
    segmentText: { fontSize: TypeScale.body, color: Colors.textSecondary, fontFamily: Fonts.bodySemiBold },
    segmentTextActive: { color: Colors.onButton },
    upload: {
      minHeight: 140,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: isLight ? '#BDB4D1' : 'rgba(255,255,255,0.35)',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.sm,
      padding: Spacing.md,
    },
    preview: { width: 110, height: 110, borderRadius: 55 },
    uploadText: { fontSize: TypeScale.body, color: Colors.textPrimary, fontFamily: Fonts.bodySemiBold },
    uploadHint: { fontSize: TypeScale.small, color: Colors.textSecondary, fontFamily: Fonts.body },
    submit: {
      marginHorizontal: Spacing.lg,
      marginTop: Spacing.xl,
      minHeight: 52,
      borderRadius: Radius.pill,
      backgroundColor: Colors.button,
      alignItems: 'center',
      justifyContent: 'center',
    },
    submitText: { fontSize: TypeScale.subtitle, color: Colors.onButton, fontFamily: Fonts.bodyBold },
    done: { justifyContent: 'center', paddingHorizontal: Spacing.xl, gap: Spacing.md },
    doneArabic: { textAlign: 'center', fontSize: 24, lineHeight: 40, color: Colors.textPrimary, fontFamily: Fonts.arabic },
    doneTitle: { textAlign: 'center', fontSize: TypeScale.headline, color: Colors.heading, fontFamily: Fonts.heading },
    doneText: { textAlign: 'center', fontSize: TypeScale.body + 1, lineHeight: 22, color: Colors.textSecondary, fontFamily: Fonts.body },
    link: { alignSelf: 'center', padding: Spacing.md },
    linkText: { fontSize: TypeScale.body, color: Colors.textPrimary, fontFamily: Fonts.bodySemiBold },
  });
};
