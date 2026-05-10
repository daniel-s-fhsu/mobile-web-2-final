import { useLocalSearchParams } from 'expo-router';

import SellerProfilePage from '../../page/seller-profile-page';

export default function SellerProfileRoute() {
  const { email, sellerId } = useLocalSearchParams();

  return <SellerProfilePage sellerId={sellerId} sellerEmail={email} />;
}
