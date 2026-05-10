import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import testData from '../data/test_data.json';
import { getSellerListings } from '../services/listings';

export default function SellerProfilePage({ sellerId, sellerEmail }) {
  const localListings = useMemo(
    () => testData.listings.filter((listing) => listing.sellerId === sellerId),
    [sellerId]
  );
  const [remoteListings, setRemoteListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadSellerListings() {
      setLoading(true);
      setErrorMessage('');

      try {
        const listings = await getSellerListings(sellerId);

        if (isMounted) {
          setRemoteListings(listings);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message || 'Could not load seller information.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadSellerListings();

    return () => {
      isMounted = false;
    };
  }, [sellerId]);

  const email = sellerEmail || remoteListings[0]?.sellerEmail || localListings[0]?.sellerEmail || '';
  const listingCount = remoteListings.length + localListings.length;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Seller Information</Text>

      <View style={styles.details}>
        <DetailRow label="Email" value={email || 'Unknown'} />
        <DetailRow
          label="Number of Listings"
          value={loading ? 'Loading...' : String(listingCount)}
        />
      </View>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </View>
  );
}

function DetailRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
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
  details: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderRadius: 8,
    borderWidth: 1,
  },
  row: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    padding: 12,
  },
  label: {
    color: '#555',
    fontWeight: '700',
    marginBottom: 4,
  },
  value: {
    color: '#222',
  },
  errorText: {
    color: '#b00020',
    fontWeight: '600',
    marginTop: 12,
  },
});
