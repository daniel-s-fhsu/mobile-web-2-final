import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function TopNav() {
  return (
    <View style={styles.nav}>
      <Link href="/" asChild>
        <Pressable style={styles.link}>
          <Text style={styles.linkText}>Marketplace</Text>
        </Pressable>
      </Link>
      <Link href="/my-listings" asChild>
        <Pressable style={styles.link}>
          <Text style={styles.linkText}>My Listings</Text>
        </Pressable>
      </Link>
      <Link href="/auth" asChild>
        <Pressable style={styles.authLink}>
          <Text style={styles.authLinkText}>Login / Sign Up</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
  },
  link: {
    borderColor: '#ccc',
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  linkText: {
    color: '#222',
    fontWeight: '600',
  },
  authLink: {
    backgroundColor: '#222',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  authLinkText: {
    color: '#fff',
    fontWeight: '600',
  },
});
