import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from './firebase';

const LISTINGS_COLLECTION = 'listings';
const FIRESTORE_TIMEOUT_MS = 15000;

export async function createListing(formValues, user) {
  if (!user) {
    throw new Error('A signed-in user is required to create a listing.');
  }

  const listing = {
    itemName: formValues.itemName.trim(),
    description: formValues.description.trim(),
    price: Number(formValues.price),
    category: formValues.category.trim(),
    condition: formValues.condition.trim(),
    location: formValues.location.trim(),
    imageUrl: formValues.imageUrl.trim(),
    sellerId: user.uid,
    sellerEmail: user.email,
    createdAt: new Date().toISOString(),
  };

  const docRef = await withFirestoreTimeout(
    addDoc(collection(db, LISTINGS_COLLECTION), listing),
    'Create listing timed out. Check your Firestore rules and network connection.'
  );

  return {
    id: docRef.id,
    ...listing,
  };
}

export async function getUserListings(user) {
  if (!user) {
    return [];
  }

  const listingsQuery = query(
    collection(db, LISTINGS_COLLECTION),
    where('sellerId', '==', user.uid)
  );
  const snapshot = await withFirestoreTimeout(
    getDocs(listingsQuery),
    'Loading listings timed out. Check your Firestore rules and network connection.'
  );

  return snapshot.docs.map(mapListingDocument).sort(sortByCreatedAtDesc);
}

export async function getListings() {
  const snapshot = await withFirestoreTimeout(
    getDocs(collection(db, LISTINGS_COLLECTION)),
    'Loading marketplace listings timed out. Check your Firestore rules and network connection.'
  );

  return snapshot.docs.map(mapListingDocument).sort(sortByCreatedAtDesc);
}

export async function getSellerListings(sellerId) {
  if (!sellerId) {
    return [];
  }

  const listingsQuery = query(
    collection(db, LISTINGS_COLLECTION),
    where('sellerId', '==', sellerId)
  );
  const snapshot = await withFirestoreTimeout(
    getDocs(listingsQuery),
    'Loading seller listings timed out. Check your Firestore rules and network connection.'
  );

  return snapshot.docs.map(mapListingDocument).sort(sortByCreatedAtDesc);
}

export async function getListingById(listingId) {
  const listingRef = doc(db, LISTINGS_COLLECTION, listingId);
  const snapshot = await withFirestoreTimeout(
    getDoc(listingRef),
    'Loading listing details timed out. Check your Firestore rules and network connection.'
  );

  if (!snapshot.exists()) {
    return null;
  }

  return mapListingDocument(snapshot);
}

export async function updateListing(listingId, formValues, user) {
  const snapshot = await getOwnedListingSnapshot(listingId, user);
  const listingRef = doc(db, LISTINGS_COLLECTION, listingId);
  const updates = {
    itemName: formValues.itemName.trim(),
    description: formValues.description.trim(),
    price: Number(formValues.price),
    category: formValues.category.trim(),
    condition: formValues.condition.trim(),
    location: formValues.location.trim(),
    imageUrl: formValues.imageUrl.trim(),
    updatedAt: new Date().toISOString(),
  };

  await withFirestoreTimeout(
    updateDoc(listingRef, updates),
    'Update listing timed out. Check your Firestore rules and network connection.'
  );

  return {
    ...mapListingDocument(snapshot),
    ...updates,
  };
}

export async function deleteListing(listingId, user) {
  await getOwnedListingSnapshot(listingId, user);
  await withFirestoreTimeout(
    deleteDoc(doc(db, LISTINGS_COLLECTION, listingId)),
    'Delete listing timed out. Check your Firestore rules and network connection.'
  );
}

async function getOwnedListingSnapshot(listingId, user) {
  if (!user) {
    throw new Error('A signed-in user is required to change a listing.');
  }

  const listingRef = doc(db, LISTINGS_COLLECTION, listingId);
  const snapshot = await withFirestoreTimeout(
    getDoc(listingRef),
    'Checking listing ownership timed out. Check your Firestore rules and network connection.'
  );

  if (!snapshot.exists() || snapshot.data().sellerId !== user.uid) {
    throw new Error('You can only change your own listings.');
  }

  return snapshot;
}

function mapListingDocument(snapshot) {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    itemName: data.itemName ?? '',
    description: data.description ?? '',
    price: Number(data.price) || 0,
    category: data.category ?? '',
    condition: data.condition ?? '',
    location: data.location ?? '',
    imageUrl: data.imageUrl ?? '',
    sellerId: data.sellerId ?? '',
    sellerEmail: data.sellerEmail ?? '',
    createdAt: normalizeCreatedAt(data.createdAt),
  };
}

function normalizeCreatedAt(createdAt) {
  if (!createdAt) {
    return '';
  }

  if (typeof createdAt === 'string') {
    return createdAt;
  }

  if (typeof createdAt.toDate === 'function') {
    return createdAt.toDate().toISOString();
  }

  return String(createdAt);
}

function sortByCreatedAtDesc(a, b) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

function withFirestoreTimeout(operation, message) {
  return Promise.race([
    operation,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(message)), FIRESTORE_TIMEOUT_MS);
    }),
  ]);
}
