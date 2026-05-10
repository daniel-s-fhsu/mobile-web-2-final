import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from '../context/authContext';

export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const validationError = validateForm({
      email,
      password,
      confirmPassword,
      isSignUp,
    });

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      setErrorMessage('No internet connection. Please reconnect and try again.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      if (isSignUp) {
        await register(email.trim(), password, name.trim());
      } else {
        await login(email.trim(), password);
      }

      router.replace('/my-listings');
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSignUp ? 'Sign Up' : 'Login'}</Text>

      <View style={styles.toggleRow}>
        <Pressable
          style={[styles.toggleButton, !isSignUp && styles.activeToggle]}
          onPress={() => {
            setIsSignUp(false);
            setErrorMessage('');
          }}>
          <Text style={[styles.toggleText, !isSignUp && styles.activeToggleText]}>Login</Text>
        </Pressable>
        <Pressable
          style={[styles.toggleButton, isSignUp && styles.activeToggle]}
          onPress={() => {
            setIsSignUp(true);
            setErrorMessage('');
          }}>
          <Text style={[styles.toggleText, isSignUp && styles.activeToggleText]}>Sign Up</Text>
        </Pressable>
      </View>

      <View style={styles.form}>
        {isSignUp && (
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#777"
            value={name}
            onChangeText={setName}
          />
        )}
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#777"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          secureTextEntry
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#777"
          value={password}
          onChangeText={setPassword}
        />
        {isSignUp && (
          <TextInput
            secureTextEntry
            style={styles.input}
            placeholder="Confirm password"
            placeholderTextColor="#777"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        )}

        {isSignUp && (
          <Text style={styles.helpText}>
            Password must be at least 8 characters and include uppercase, lowercase, and a number.
          </Text>
        )}

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <Pressable
          style={[styles.submitButton, loading && styles.disabledButton]}
          disabled={loading}
          onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Login'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function validateForm({ email, password, confirmPassword, isSignUp }) {
  const trimmedEmail = email.trim();

  if (!isValidEmail(trimmedEmail)) {
    return 'Enter a valid email address.';
  }

  if (!password) {
    return 'Enter your password.';
  }

  if (isSignUp && !isStrongPassword(password)) {
    return 'Password must be at least 8 characters and include uppercase, lowercase, and a number.';
  }

  if (isSignUp && password !== confirmPassword) {
    return 'Passwords do not match.';
  }

  return '';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password) {
  return password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);
}

function getAuthErrorMessage(code) {
  switch (code) {
    case 'auth/network-request-failed':
      return 'No internet connection. Please reconnect and try again.';
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password.';
    case 'auth/email-already-in-use':
      return 'An account already exists for this email.';
    case 'auth/weak-password':
      return 'Password must be at least 8 characters and include uppercase, lowercase, and a number.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a bit and try again.';
    case 'auth/operation-not-allowed':
      return 'Email and password sign-in is not enabled for this Firebase project.';
    default:
      return 'Something went wrong. Please try again.';
  }
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
  helpText: {
    color: '#555',
    fontSize: 12,
  },
  errorText: {
    color: '#b00020',
    fontWeight: '600',
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 6,
    marginTop: 4,
    padding: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
