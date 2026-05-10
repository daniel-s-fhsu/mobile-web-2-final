import { Redirect } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import ListingCard from '../components/listing-card/listing-card';
import { useAuth } from '../context/authContext';
import testData from '../data/test_data.json';

export default function MyListingsPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Checking login...</Text>
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/auth" />;
  }

  const myListings = testData.listings.filter((listing) => listing.sellerEmail === user.email);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Listings</Text>
      <FlatList
        data={myListings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ListingCard listing={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text>You do not have any listings yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  list: {
    gap: 12,
  },
});
