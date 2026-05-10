import { Slot } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import TopNav from '../components/top-nav/top-nav';
import { AuthProvider } from '../context/authContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <View style={styles.container}>
        <TopNav />
        <Slot />
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
});
