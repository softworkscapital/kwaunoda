import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

// Sample categories data
const categoriesData = {
  1: [
    { id: 1, name: "Electronics", image: "https://via.placeholder.com/100" },
    { id: 2, name: "Clothing", image: "https://via.placeholder.com/100" },
  ],
  2: [
    { id: 3, name: "Groceries", image: "https://via.placeholder.com/100" },
    { id: 4, name: "Home Goods", image: "https://via.placeholder.com/100" },
  ],
};

const StoreCategories = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedStoreId } = route.params; 
  const categories = categoriesData[selectedStoreId] || []; 

  const [cartVisible, setCartVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (category) => {
    setCartItems([...cartItems, category]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Store Categories</Text>
        <TouchableOpacity onPress={() => setCartVisible(true)} style={styles.cartButton}>
          <MaterialIcons name="shopping-cart" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.categoryContainer}>
        {categories.map(category => (
          <TouchableOpacity 
            key={category.id} 
            onPress={() => {
              addToCart(category);
              navigation.navigate('StoreInventory', { selectedStoreId, selectedCategoryId: category.id });
            }}
          >
            <View style={styles.card}>
              <Image source={{ uri: category.image }} style={styles.image} />
              <Text style={styles.categoryName}>{category.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Cart Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={cartVisible}
        onRequestClose={() => setCartVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cart Items</Text>
            {
              cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <Text key={index} style={styles.modalItem}>{item.name}</Text>
                ))
              ) : (
                <Text style={styles.modalItem}>No items in cart</Text>
              )
            }
            <Button title="Close" onPress={() => setCartVisible(false)} />
          </View>
        </View>
      </Modal>
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
  categoryContainer: {
    flex: 1,
    margin: 20
  },
  card: {
    borderRadius: 10,
    backgroundColor: '#e0ffe0',
    padding: 4,
    marginVertical: 10,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cartButton: {
    paddingRight: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalItem: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default StoreCategories;