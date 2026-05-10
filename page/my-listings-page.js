import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import CreateListingForm from '../components/create-listing-form/create-listing-form';
import EditListingForm from '../components/edit-listing-form/edit-listing-form';
import ListingCard from '../components/listing-card/listing-card';
import ListingSearch from '../components/listing-search/listing-search';
import { useAuth } from '../context/authContext';
import testData from '../data/test_data.json';
import { createListing, deleteListing, getUserListings, updateListing } from '../services/listings';

const initialFormValues = {
  itemName: '',
  price: '',
  category: '',
  condition: '',
  location: '',
  imageUrl: '',
  description: '',
};

export default function MyListingsPage() {
  const { user, loading } = useAuth();
  const [savedListings, setSavedListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [listLoading, setListLoading] = useState(false);
  const [listErrorMessage, setListErrorMessage] = useState('');
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [formSuccessMessage, setFormSuccessMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [editingListingId, setEditingListingId] = useState(null);
  const [editFormValues, setEditFormValues] = useState(initialFormValues);
  const [editErrorMessage, setEditErrorMessage] = useState('');
  const [updating, setUpdating] = useState(false);
  const [deletingListingId, setDeletingListingId] = useState(null);

  useEffect(() => {
    if (!user) {
      setSavedListings([]);
      return;
    }

    let isMounted = true;

    async function loadListings() {
      setListLoading(true);
      setListErrorMessage('');

      try {
        const listings = await getUserListings(user);

        if (isMounted) {
          setSavedListings(listings);
        }
      } catch {
        if (isMounted) {
          setListErrorMessage('Could not load saved listings.');
        }
      } finally {
        if (isMounted) {
          setListLoading(false);
        }
      }
    }

    loadListings();

    return () => {
      isMounted = false;
    };
  }, [user]);

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

  const seedListings = testData.listings.filter((listing) => listing.sellerEmail === user.email);
  const myListings = [...savedListings, ...seedListings];
  const filteredListings = filterListingsByItemName(myListings, searchQuery);

  const updateFormValue = (fieldName, value) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [fieldName]: value,
    }));
    setFormErrorMessage('');
    setFormSuccessMessage('');
  };

  const handleCreateListing = async () => {
    const validationError = validateListingForm(formValues);

    if (validationError) {
      setFormErrorMessage(validationError);
      setFormSuccessMessage('');
      return;
    }

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      setFormErrorMessage('No internet connection. Please reconnect and try again.');
      setFormSuccessMessage('');
      return;
    }

    setSaving(true);
    setFormErrorMessage('');
    setFormSuccessMessage('');

    try {
      const listing = await createListing(formValues, user);
      setSavedListings((currentListings) => [listing, ...currentListings]);
      setFormValues(initialFormValues);
      setFormSuccessMessage('Listing created.');
      setIsCreateFormOpen(false);
      cancelEdit();
    } catch (error) {
      setFormErrorMessage(getListingErrorMessage(error, 'Could not create the listing.'));
    } finally {
      setSaving(false);
    }
  };

  const openCreateForm = () => {
    setIsCreateFormOpen(true);
    setFormErrorMessage('');
    setFormSuccessMessage('');
    cancelEdit();
  };

  const closeCreateForm = () => {
    setIsCreateFormOpen(false);
    setFormValues(initialFormValues);
    setFormErrorMessage('');
  };

  const startEdit = (listing) => {
    setEditingListingId(listing.id);
    setEditFormValues(getFormValuesFromListing(listing));
    setEditErrorMessage('');
    setFormSuccessMessage('');
  };

  const cancelEdit = () => {
    setEditingListingId(null);
    setEditFormValues(initialFormValues);
    setEditErrorMessage('');
    setUpdating(false);
  };

  const updateEditFormValue = (fieldName, value) => {
    setEditFormValues((currentValues) => ({
      ...currentValues,
      [fieldName]: value,
    }));
    setEditErrorMessage('');
  };

  const handleUpdateListing = async () => {
    const validationError = validateListingForm(editFormValues);

    if (validationError) {
      setEditErrorMessage(validationError);
      return;
    }

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      setEditErrorMessage('No internet connection. Please reconnect and try again.');
      return;
    }

    setUpdating(true);
    setEditErrorMessage('');

    try {
      const updatedListing = await updateListing(editingListingId, editFormValues, user);
      setSavedListings((currentListings) =>
        currentListings.map((listing) =>
          listing.id === updatedListing.id ? updatedListing : listing
        )
      );
      cancelEdit();
    } catch (error) {
      setEditErrorMessage(getListingErrorMessage(error, 'Could not update the listing.'));
    } finally {
      setUpdating(false);
    }
  };

  const confirmDelete = (listing) => {
    if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
      if (window.confirm(`Delete "${listing.itemName}"? This cannot be undone.`)) {
        handleDeleteListing(listing.id);
      }

      return;
    }

    Alert.alert('Delete listing?', `Delete "${listing.itemName}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => handleDeleteListing(listing.id),
      },
    ]);
  };

  const handleDeleteListing = async (listingId) => {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      setListErrorMessage('No internet connection. Please reconnect and try again.');
      return;
    }

    setDeletingListingId(listingId);
    setListErrorMessage('');

    try {
      await deleteListing(listingId, user);
      setSavedListings((currentListings) =>
        currentListings.filter((listing) => listing.id !== listingId)
      );

      if (editingListingId === listingId) {
        cancelEdit();
      }
    } catch (error) {
      setListErrorMessage(getListingErrorMessage(error, 'Could not delete the listing.'));
    } finally {
      setDeletingListingId(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Listings</Text>
      <FlatList
        data={filteredListings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MyListingRow
            listing={item}
            canManage={item.sellerId === user.uid}
            deleting={deletingListingId === item.id}
            editing={editingListingId === item.id}
            editFormValues={editFormValues}
            editErrorMessage={editErrorMessage}
            updating={updating}
            onCancelEdit={cancelEdit}
            onConfirmDelete={confirmDelete}
            onEdit={startEdit}
            onEditChange={updateEditFormValue}
            onUpdate={handleUpdateListing}
          />
        )}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <ListingSearch value={searchQuery} onChange={setSearchQuery} />
            <CreateListingHeader
              isOpen={isCreateFormOpen}
              formValues={formValues}
              errorMessage={formErrorMessage}
              successMessage={formSuccessMessage}
              saving={saving}
              onCancel={closeCreateForm}
              onChange={updateFormValue}
              onOpen={openCreateForm}
              onSubmit={handleCreateListing}
            />
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {getMyListingsEmptyMessage({ listLoading, myListings, searchQuery })}
          </Text>
        }
        ListFooterComponent={
          listErrorMessage ? <Text style={styles.errorText}>{listErrorMessage}</Text> : null
        }
      />
    </View>
  );
}

function filterListingsByItemName(listings, searchQuery) {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  if (!normalizedQuery) {
    return listings;
  }

  return listings.filter((listing) =>
    (listing.itemName ?? '').toLowerCase().includes(normalizedQuery)
  );
}

function getMyListingsEmptyMessage({ listLoading, myListings, searchQuery }) {
  if (listLoading) {
    return 'Loading listings...';
  }

  if (searchQuery.trim() && myListings.length > 0) {
    return 'No listings match your search.';
  }

  return 'You do not have any listings yet.';
}

function CreateListingHeader({
  isOpen,
  formValues,
  errorMessage,
  successMessage,
  saving,
  onCancel,
  onChange,
  onOpen,
  onSubmit,
}) {
  if (isOpen) {
    return (
      <CreateListingForm
        formValues={formValues}
        errorMessage={errorMessage}
        successMessage={successMessage}
        saving={saving}
        onCancel={onCancel}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    );
  }

  return (
    <View style={styles.createPrompt}>
      <Pressable style={styles.createButton} onPress={onOpen}>
        <Text style={styles.createButtonText}>Create Listing</Text>
      </Pressable>
      {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
    </View>
  );
}

function MyListingRow({
  listing,
  canManage,
  deleting,
  editing,
  editFormValues,
  editErrorMessage,
  updating,
  onCancelEdit,
  onConfirmDelete,
  onEdit,
  onEditChange,
  onUpdate,
}) {
  if (editing) {
    return (
      <EditListingForm
        formValues={editFormValues}
        errorMessage={editErrorMessage}
        saving={updating}
        onCancel={onCancelEdit}
        onChange={onEditChange}
        onSubmit={onUpdate}
      />
    );
  }

  return (
    <View style={styles.listingRow}>
      <ListingCard listing={listing} />
      {canManage ? (
        <View style={styles.rowActions}>
          <Pressable style={styles.secondaryButton} onPress={() => onEdit(listing)}>
            <Text style={styles.secondaryButtonText}>Edit</Text>
          </Pressable>
          <Pressable
            style={[styles.deleteButton, deleting && styles.disabledButton]}
            disabled={deleting}
            onPress={() => onConfirmDelete(listing)}>
            <Text style={styles.deleteButtonText}>{deleting ? 'Deleting...' : 'Delete'}</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function getFormValuesFromListing(listing) {
  return {
    itemName: listing.itemName ?? '',
    price: listing.price === undefined || listing.price === null ? '' : String(listing.price),
    category: listing.category ?? '',
    condition: listing.condition ?? '',
    location: listing.location ?? '',
    imageUrl: listing.imageUrl ?? '',
    description: listing.description ?? '',
  };
}

function validateListingForm(formValues) {
  if (!formValues.itemName.trim()) {
    return 'Enter an item name.';
  }

  if (!Number.isFinite(Number(formValues.price)) || Number(formValues.price) <= 0) {
    return 'Enter a valid price.';
  }

  if (!formValues.condition.trim()) {
    return 'Enter the item condition.';
  }

  if (!formValues.category.trim()) {
    return 'Enter a category.';
  }

  if (!formValues.location.trim()) {
    return 'Enter a location.';
  }

  if (!isValidUrl(formValues.imageUrl.trim())) {
    return 'Enter a valid image URL.';
  }

  if (!formValues.description.trim()) {
    return 'Enter a description.';
  }

  return '';
}

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function getListingErrorMessage(error, fallbackMessage) {
  if (error?.code === 'permission-denied') {
    return `${fallbackMessage} Firestore rules denied this request.`;
  }

  if (error?.code === 'unauthenticated') {
    return `${fallbackMessage} Please log in again.`;
  }

  if (error?.message) {
    return error.message;
  }

  return `${fallbackMessage} Please try again.`;
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
  listContent: {
    gap: 12,
    paddingBottom: 24,
  },
  listHeader: {
    gap: 12,
  },
  createPrompt: {
    alignItems: 'flex-start',
    gap: 8,
  },
  createButton: {
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  listingRow: {
    gap: 8,
  },
  rowActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-end',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: '#222',
    fontWeight: '700',
  },
  deleteButton: {
    alignItems: 'center',
    backgroundColor: '#b00020',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.6,
  },
  errorText: {
    color: '#b00020',
    fontWeight: '600',
  },
  emptyText: {
    color: '#555',
  },
  successText: {
    color: '#146c2e',
    fontWeight: '600',
  },
});
