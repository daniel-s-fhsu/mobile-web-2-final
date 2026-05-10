import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function EditListingForm({
  formValues,
  errorMessage,
  saving,
  onCancel,
  onChange,
  onSubmit,
}) {
  return (
    <View style={styles.formPanel}>
      <Text style={styles.formTitle}>Edit Listing</Text>

      <TextInput
        style={styles.input}
        placeholder="Item name"
        placeholderTextColor="#777"
        value={formValues.itemName}
        onChangeText={(value) => onChange('itemName', value)}
      />

      <View style={styles.inlineFields}>
        <TextInput
          keyboardType="numeric"
          style={[styles.input, styles.inlineInput]}
          placeholder="Price"
          placeholderTextColor="#777"
          value={formValues.price}
          onChangeText={(value) => onChange('price', value)}
        />
        <TextInput
          style={[styles.input, styles.inlineInput]}
          placeholder="Condition"
          placeholderTextColor="#777"
          value={formValues.condition}
          onChangeText={(value) => onChange('condition', value)}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Category"
        placeholderTextColor="#777"
        value={formValues.category}
        onChangeText={(value) => onChange('category', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        placeholderTextColor="#777"
        value={formValues.location}
        onChangeText={(value) => onChange('location', value)}
      />
      <TextInput
        autoCapitalize="none"
        style={styles.input}
        placeholder="Image URL"
        placeholderTextColor="#777"
        value={formValues.imageUrl}
        onChangeText={(value) => onChange('imageUrl', value)}
      />
      <TextInput
        multiline
        style={[styles.input, styles.descriptionInput]}
        placeholder="Description"
        placeholderTextColor="#777"
        textAlignVertical="top"
        value={formValues.description}
        onChangeText={(value) => onChange('description', value)}
      />

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <View style={styles.actions}>
        <Pressable
          style={[styles.secondaryButton, saving && styles.disabledButton]}
          disabled={saving}
          onPress={onCancel}>
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </Pressable>
        <Pressable
          style={[styles.submitButton, saving && styles.disabledButton]}
          disabled={saving}
          onPress={onSubmit}>
          <Text style={styles.submitButtonText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formPanel: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 12,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  inlineFields: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  inlineInput: {
    flex: 1,
    minWidth: 140,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderRadius: 6,
    borderWidth: 1,
    padding: 12,
  },
  descriptionInput: {
    minHeight: 92,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-end',
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: '#ccc',
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: '#222',
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.6,
  },
  errorText: {
    color: '#b00020',
    fontWeight: '600',
  },
});
