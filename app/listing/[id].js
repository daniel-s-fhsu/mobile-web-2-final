import { useLocalSearchParams } from 'expo-router';

import ListingDetailPage from '../../page/listing-detail-page';

export default function ListingRoute() {
  const { id } = useLocalSearchParams();

  return <ListingDetailPage listingId={id} />;
}
