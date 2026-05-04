import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import testData from '../data/test_data.json';

export default function ListingDetailPage({ listingId }) {
  const listing = testData.listings.find((item) => item.id === listingId);

  if (!listing) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Listing not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: listing.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{listing.itemName}</Text>
      <Text style={styles.price}>${listing.price}</Text>

      <View style={styles.details}>
        <DetailRow label="ID" value={listing.id} />
        <DetailRow label="Description" value={listing.description} />
        <DetailRow label="Category" value={listing.category} />
        <DetailRow label="Condition" value={listing.condition} />
        <DetailRow label="Location" value={listing.location} />
        <DetailRow label="Seller Email" value={listing.sellerEmail} />
        <DetailRow label="Created At" value={listing.createdAt} />
      </View>
    </ScrollView>
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
});
