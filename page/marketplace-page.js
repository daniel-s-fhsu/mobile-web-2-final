import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import ListingCard from '../components/listing-card/listing-card';
import { getListings } from '../services/listings';

export default function MarketplacePage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadListings() {
      setLoading(true);
      setErrorMessage('');

      try {
        const savedListings = await getListings();

        if (isMounted) {
          setListings(savedListings);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message || 'Could not load marketplace listings.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadListings();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Marketplace</Text>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ListingCard listing={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={errorMessage ? styles.errorText : styles.emptyText}>
            {loading ? 'Loading listings...' : errorMessage || 'No listings yet.'}
          </Text>
        }
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
  emptyText: {
    color: '#555',
  },
  errorText: {
    color: '#b00020',
    fontWeight: '600',
  },
});
