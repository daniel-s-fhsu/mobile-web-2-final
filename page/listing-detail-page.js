import { Link } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import testData from '../data/test_data.json';
import { getListingById } from '../services/listings';

export default function ListingDetailPage({ listingId }) {
  const localListing = useMemo(
    () => testData.listings.find((item) => item.id === listingId),
    [listingId]
  );
  const [remoteListing, setRemoteListing] = useState(null);
  const [loading, setLoading] = useState(!localListing);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (localListing || !listingId) {
      setRemoteListing(null);
      setLoading(false);
      setErrorMessage('');
      return;
    }

    let isMounted = true;

    async function loadListing() {
      setLoading(true);
      setErrorMessage('');

      try {
        const listing = await getListingById(listingId);

        if (isMounted) {
          setRemoteListing(listing);
        }
      } catch {
        if (isMounted) {
          setErrorMessage('Could not load this listing.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadListing();

    return () => {
      isMounted = false;
    };
  }, [listingId, localListing]);

  const listing = localListing ?? remoteListing;

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading listing...</Text>
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Listing not found</Text>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: listing.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{listing.itemName}</Text>
      <Text style={styles.price}>${listing.price}</Text>

      <View style={styles.details}>
        <DetailRow label="Description" value={listing.description} />
        <DetailRow label="Category" value={listing.category} />
        <DetailRow label="Condition" value={listing.condition} />
        <DetailRow label="Location" value={listing.location} />
        <DetailRow label="Seller Email" value={listing.sellerEmail} />
        {listing.sellerId ? <SellerInformationLink listing={listing} /> : null}
        <DetailRow label="Created At" value={listing.createdAt} />
      </View>
    </ScrollView>
  );
}

function SellerInformationLink({ listing }) {
  const href = `/seller/${encodeURIComponent(listing.sellerId)}?email=${encodeURIComponent(
    listing.sellerEmail ?? ''
  )}`;

  return (
    <Link href={href} asChild>
      <Pressable style={styles.linkRow}>
        <Text style={styles.linkText}>Seller information</Text>
      </Pressable>
    </Link>
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
  content: {
    paddingBottom: 24,
  },
  image: {
    width: '100%',
    height: 220,
    backgroundColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
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
  linkRow: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    padding: 12,
  },
  linkText: {
    color: '#1f5fbf',
    fontWeight: '700',
  },
  errorText: {
    color: '#b00020',
    fontWeight: '600',
  },
});
