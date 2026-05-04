import { Slot } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import TopNav from '../components/top-nav/top-nav';

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <TopNav />
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
});
