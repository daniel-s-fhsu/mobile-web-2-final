import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSignUp ? 'Sign Up' : 'Login'}</Text>

      <View style={styles.toggleRow}>
        <Pressable
          style={[styles.toggleButton, !isSignUp && styles.activeToggle]}
          onPress={() => setIsSignUp(false)}>
          <Text style={[styles.toggleText, !isSignUp && styles.activeToggleText]}>Login</Text>
        </Pressable>
        <Pressable
          style={[styles.toggleButton, isSignUp && styles.activeToggle]}
          onPress={() => setIsSignUp(true)}>
          <Text style={[styles.toggleText, isSignUp && styles.activeToggleText]}>Sign Up</Text>
        </Pressable>
      </View>

      <View style={styles.form}>
        {isSignUp && (
          <TextInput style={styles.input} placeholder="Name" placeholderTextColor="#777" />
        )}
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#777"
        />
        <TextInput
          secureTextEntry
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#777"
        />
        {isSignUp && (
          <TextInput
            secureTextEntry
            style={styles.input}
            placeholder="Confirm password"
            placeholderTextColor="#777"
          />
        )}

        <Pressable style={styles.submitButton}>
          <Text style={styles.submitButtonText}>{isSignUp ? 'Create Account' : 'Login'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  toggleButton: {
    borderColor: '#ccc',
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  activeToggle: {
    backgroundColor: '#222',
    borderColor: '#222',
  },
  toggleText: {
    color: '#333',
    fontWeight: '600',
  },
  activeToggleText: {
    color: '#fff',
  },
  form: {
    gap: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderRadius: 6,
    borderWidth: 1,
    padding: 12,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 6,
    marginTop: 4,
    padding: 12,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
