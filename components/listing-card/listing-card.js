import { Link } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function ListingCard({ listing }) {
  return (
    <Link href={`/listing/${listing.id}`} asChild>
      <Pressable style={styles.card}>
        <Image source={{ uri: listing.imageUrl }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.itemName}>{listing.itemName}</Text>
          <Text style={styles.price}>${listing.price}</Text>
          <Text style={styles.detail}>{listing.category}</Text>
          <Text style={styles.detail}>{listing.location}</Text>
          <Text style={styles.description}>{listing.description}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: '#ddd',
  },
  content: {
    padding: 12,
    gap: 4,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
  detail: {
    color: '#555',
  },
  description: {
    marginTop: 4,
  },
});
