import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

const stores = [
];

const OnlineStore = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');

  // Filter stores based on search input
  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Online Store</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.cartButton}>
          <MaterialIcons name="shopping-cart" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search Stores"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <ScrollView style={styles.storeContainer}>
        {filteredStores.length > 0 ? (
          filteredStores.map(store => (
            <TouchableOpacity key={store.id} onPress={() => navigation.navigate('StoreCategories', { selectedStoreId: store.id })}>
              <View style={styles.storeDetails}>
                <Text style={styles.storeName}>{store.name}</Text>
                <Text style={styles.storeDescription}>
                  Description of {store.name}.
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noResults}>Comming Soon.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: 'green',
    paddingVertical: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    paddingLeft: 20,
  },
  headerText: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  searchContainer: {
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#b2d600',
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
  },
  storeContainer: {
    flex: 1,
    padding: 10,
  },
  storeDetails: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#e0ffe0',
    marginTop: 10,
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  storeDescription: {
    fontSize: 14,
    color: '#555',
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default OnlineStore;