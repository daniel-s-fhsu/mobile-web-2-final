import { StyleSheet, TextInput } from 'react-native';

export default function ListingSearch({ value, onChange }) {
  return (
    <TextInput
      autoCapitalize="none"
      clearButtonMode="while-editing"
      placeholder="Search by item name"
      placeholderTextColor="#777"
      style={styles.input}
      value={value}
      onChangeText={onChange}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderRadius: 6,
    borderWidth: 1,
    padding: 12,
  },
});
