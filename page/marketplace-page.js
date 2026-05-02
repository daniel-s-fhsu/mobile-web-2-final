import { FlatList, StyleSheet, Text, View } from 'react-native';

import ListingCard from '../components/listing-card/listing-card';
import testData from '../data/test_data.json';

export default function MarketplacePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Marketplace</Text>
      <FlatList
        data={testData.listings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ListingCard listing={item} />}
        contentContainerStyle={styles.list}
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
