import RNFS from 'react-native-fs';

// Function to save an image
const saveImage = async (uri) => {
  const filePath = `${RNFS.DocumentDirectoryPath}/image.jpg`;

  try {
    await RNFS.downloadFile({ fromUrl: uri, toFile: filePath }).promise;
    console.log('Image saved to:', filePath);
    // Store the filePath in AsyncStorage if needed
  } catch (error) {
    console.error('Error saving image:', error);
  }
};
/////////////////////////////////////////////////////////////////////

      {/* Item Quantity Modal */}
      <Modal visible={itemModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedItem && (
              <>
                <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                <Image source={{ uri: selectedItem.image }} style={styles.modalImage} />
                <Text style={styles.modalPrice}>Price: ${selectedItem.price.toFixed(2)}</Text>
                <Text style={styles.modalDescription}>
                  This product is known for its quality and durability. Perfect for all your needs!
                </Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                    <MaterialIcons name="remove" size={24} color="black" />
                  </TouchableOpacity>
                  <View style={styles.quantityDisplay}>
                    <Text style={styles.cartItemQuantity}>{quantity}</Text>
                  </View>
                  <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity(quantity + 1)}>
                    <MaterialIcons name="add" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.closeButton} onPress={() => setItemModalVisible(false)}>
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
                    <Text style={styles.buttonText}>Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>




///thecard
<ScrollView style={styles.inventoryContainer}>
{selectedCategory && (
  <View key={selectedCategory.id} style={styles.categorySection}>
    <Text style={styles.categoryTitle}>{selectedCategory.name}</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.itemsScroll}>
      {selectedCategory.items.map(item => (
        <TouchableOpacity key={item.id} style={styles.itemCard} onPress={() => handleCardPress(item)}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
          <Text style={styles.itemDescription}>
            A quality product that meets all your needs!
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
)}
</ScrollView>


////////////////////////////////////
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { API_URL_STORE } from './config';

const DEFAULT_IMAGE = 'https://images.pexels.com/photos/682933/pexels-photo-682933.jpeg?auto=compress&cs=tinysrgb&w=600';

const StoreInventory = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedStoreId } = route.params;
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cartVisible, setCartVisible] = useState(false);
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch(`${API_URL_STORE}/productdefinition/`);
        const text = await resp.text();
        console.log('Response:', text);
        
        const result = JSON.parse(text);
        const categoryMap = result.reduce((acc, product) => {
          const category = product.product_type || "Other";
          if (!acc[category]) {
            acc[category] = { id: category, name: category, items: [] };
          }
          acc[category].items.push({
            id: product.product_id,
            name: product.product_name,
            image: DEFAULT_IMAGE,
            price: product.unit_size,
          });
          return acc;
        }, {});

        setCategories(Object.values(categoryMap));
        setSelectedCategoryId(Object.values(categoryMap)[0]?.id || null);
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const category = categories.find(cat => cat.id === selectedCategoryId);
    setSelectedCategory(category);
  }, [selectedCategoryId, categories]);

  const handleCardPress = (item) => {
    setSelectedItem(item);
    setQuantity(1);
    setItemModalVisible(true);
  };

  const handleAddToCart = () => {
    if (selectedItem) {
      setCartItems(prevItems => {
        const existingItem = prevItems.find(cartItem => cartItem.id === selectedItem.id);
        if (existingItem) {
          return prevItems.map(item => 
            item.id === selectedItem.id ? { ...item, quantity: item.quantity + quantity } : item
          );
        } else {
          return [...prevItems, { ...selectedItem, quantity }];
        }
      });
      setItemModalVisible(false);
    }
  };

  const handleCheckout = () => {
    console.log('Checkout function called. Cart items:', cartItems);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Store Inventory</Text>
        <TouchableOpacity onPress={() => setCartVisible(true)} style={styles.cartButton}>
          <MaterialIcons name="shopping-cart" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <Picker
        selectedValue={selectedCategoryId}
        style={styles.picker}
        itemStyle={styles.pickerItem}
        onValueChange={(itemValue) => setSelectedCategoryId(itemValue)}
      >
        {categories.map(category => (
          <Picker.Item key={category.id} label={category.name} value={category.id} />
        ))}
      </Picker>

      <ScrollView style={styles.inventoryContainer}>
        {selectedCategory && (
          <View key={selectedCategory.id} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{selectedCategory.name}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.itemsScroll}>
              {selectedCategory.items.map(item => (
                <TouchableOpacity key={item.id} style={styles.itemCard} onPress={() => handleCardPress(item)}>
                  <Image source={{ uri: item.image }} style={styles.itemImage} />
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                  <Text style={styles.itemDescription}>
                    A quality product that meets all your needs!
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Item Quantity Modal */}
      <Modal visible={itemModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedItem && (
              <>
                <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                <Image source={{ uri: selectedItem.image }} style={styles.modalImage} />
                <Text style={styles.modalPrice}>Price: ${selectedItem.price.toFixed(2)}</Text>
                <Text style={styles.modalDescription}>
                  This product is known for its quality and durability. Perfect for all your needs!
                </Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                    <MaterialIcons name="remove" size={24} color="black" />
                  </TouchableOpacity>
                  <View style={styles.quantityDisplay}>
                    <Text style={styles.cartItemQuantity}>{quantity}</Text>
                  </View>
                  <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity(quantity + 1)}>
                    <MaterialIcons name="add" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.closeButton} onPress={() => setItemModalVisible(false)}>
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
                    <Text style={styles.buttonText}>Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Cart Modal */}
      <Modal visible={cartVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Shopping Cart</Text>
            <ScrollView>
              {cartItems.map(item => (
                <View key={item.id} style={styles.cartItem}>
                  <Image source={{ uri: item.image }} style={styles.cartItemImage} />
                  <Text style={styles.cartItemName}>{item.name}</Text>
                  <Text style={styles.cartItemPrice}>${item.price.toFixed(2)} x {item.quantity}</Text>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity onPress={() => handleQuantityChange(item.id, -1)} style={styles.quantityButton}>
                      <MaterialIcons name="remove" size={24} color="black" />
                    </TouchableOpacity>
                    <View style={styles.quantityDisplay}>
                      <Text style={styles.cartItemQuantity}>{item.quantity}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleQuantityChange(item.id, 1)} style={styles.quantityButton}>
                      <MaterialIcons name="add" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={() => handleRemoveFromCart(item.id)} style={styles.removeButton}>
                    <MaterialIcons name="close" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total: ${calculateTotal()}</Text>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setCartVisible(false)}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                <Text style={styles.buttonText}>Checkout</Text>
              </TouchableOpacity>
            </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  cartButton: {
    marginLeft: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  inventoryContainer: {
    flex: 1,
    padding: 10,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemsScroll: {
    flexDirection: 'row',
  },
  itemCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: 150,
  },
  itemImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 5,
  },
  itemPrice: {
    fontSize: 14,
    color: '#e74c3c',
  },
  itemDescription: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalPrice: {
    fontSize: 18,
    color: '#2ecc71',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 15,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  quantityButton: {
    backgroundColor: '#e7e7e7',
    borderRadius: 5,
    padding: 10,
  },
  quantityDisplay: {
    marginHorizontal: 10,
  },
  cartItemQuantity: {
    fontSize: 18,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  closeButton: {
    backgroundColor: '#e7e7e7',
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginRight: 5,
  },
  addButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginLeft: 5,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cartItemImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  cartItemName: {
    flex: 1,
    fontSize: 16,
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  totalContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#3498db',
    borderRadius: 5,
    padding: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default StoreInventory;
