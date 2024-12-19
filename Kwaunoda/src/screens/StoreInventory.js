import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { API_URL_STORE } from "./config";

const DEFAULT_IMAGE =
  "https://images.pexels.com/photos/682933/pexels-photo-682933.jpeg?auto=compress&cs=tinysrgb&w=600";

  const DEFAULT_IMAGE2 =
  "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600";

  const DEFAULT_IMAGE3 =
  "https://images.pexels.com/photos/119550/pexels-photo-119550.jpeg?auto=compress&cs=tinysrgb&w=600";

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
  const [allProducts, setAllProducts] = useState([]);
  const [mainImage, setMainImage] = useState("");


        useEffect(() => {
          const fetchData = async () => {
            try {
              const resp = await fetch(`${API_URL_STORE}/productdefinition/full_products_definations`);
              const result = await resp.json();
      
              // Structure categories based on product_type
              const categoryMap = result.reduce((acc, product) => {
                const category = product.category || "Other"; // Use "Other" for undefined types
                if (!acc[category]) {
                  acc[category] = { id: category, name: category, items: [] };
                }
                acc[category].items.push({
                  id: product.product_id,
                  name: product.product_brand,
                  image: DEFAULT_IMAGE,
                  price: product.unit_cost,
                  notes: product.description_notes,
                  item_count: product.qty_balance,
                  category: product.category,
                  sub_category: product.sub_category,
                });
                return acc;
              }, {});
      
              const categoriesArray = Object.values(categoryMap);
              setCategories(categoriesArray);
              setAllProducts(categoriesArray); // Store all products for display
              setSelectedCategoryId(categoriesArray[0]?.id || null);
            } catch (error) {
              console.log("Error fetching data:", error);
            }
          };
      
          fetchData();
        }, []);
      
        const handleCategoryChange = (itemValue) => {
          setSelectedCategoryId(itemValue);
        };
  

  useEffect(() => {
    const category = categories.find((cat) => cat.id === selectedCategoryId);
    setSelectedCategory(category);
  }, [selectedCategoryId, categories]);


    // Initially set the main image to the selected item's image when the modal opens
    const handleCardPress = (item) => {
      setSelectedItem(item);
      setMainImage(item.image); // Set the main image to the selected item's image
      setItemModalVisible(true);
    };

  const handleAddToCart = () => {
    if (selectedItem) {
      setCartItems((prevItems) => {
        const existingItem = prevItems.find(
          (cartItem) => cartItem.id === selectedItem.id
        );
  
        // Check if adding this item would exceed the available stock
        const totalQuantity = existingItem ? existingItem.quantity + quantity : quantity;
        if (totalQuantity > selectedItem.item_count) { // Assuming item_count holds the available stock
          alert("Cannot add more than available stock.");
          return prevItems; // Do not update the cart if it exceeds stock
        }
  
        if (existingItem) {
          return prevItems.map((item) =>
            item.id === selectedItem.id
              ? { ...item, quantity: totalQuantity }
              : item
          );
        } else {
          return [...prevItems, { ...selectedItem, quantity }];
        }
      });
      setItemModalVisible(false);
    }
  };
  
  const handleQuantityChange = (itemId, change) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.id === itemId) {
            const newQuantity = item.quantity + change;
  
            // Ensure we do not go below 1 or exceed available stock
            if (newQuantity < 1) {
              return null; // Remove item if quantity is zero or less
            }
            if (newQuantity > item.item_count) { // Check against available stock
              alert("Cannot exceed available stock.");
              return item; // Do not update if it exceeds stock
            }
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item !== null); // Filter out null items
    });
  };

  const handleRemoveFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const handleCheckout = () => {
    // Placeholder for checkout functionality
    console.log("Checkout function called. Cart items:", cartItems);
    alert("Proceeding to checkout!");
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

    // Sort categories and move selected category to the top
    const sortedCategories = () => {
      if (!selectedCategoryId) return allProducts;
  
      const selectedCategory = allProducts.find(cat => cat.id === selectedCategoryId);
      const otherCategories = allProducts.filter(cat => cat.id !== selectedCategoryId);
      return [selectedCategory, ...otherCategories];
    };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Store Inventory</Text>
        <TouchableOpacity
          onPress={() => setCartVisible(true)}
          style={styles.cartButton}
        >
          <MaterialIcons name="shopping-cart" size={24} color="#000" />
        </TouchableOpacity>
      </View>


      <Picker
        selectedValue={selectedCategoryId}
        style={styles.picker}
        onValueChange={handleCategoryChange}
      >
        {allProducts.map((category) => (
          <Picker.Item key={category.id} label={category.name} value={category.id} />
        ))}
      </Picker>

      <ScrollView style={styles.inventoryContainer}>
        {sortedCategories().map((category) => (
          <View key={category.id} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category.name}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.itemsScroll}>
              {category.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.itemCard}
                  onPress={() => handleCardPress(item)}
                >
                  <Image source={{ uri: item.image }} style={styles.itemImage} />
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>Price: ${item.price.toFixed(2)}</Text>
                  <Text style={styles.itemDescription}>Best Quality {item.sub_category}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>

      {/* Item Quantity Modal */}
      <Modal visible={itemModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedItem && (
              <>
                <Image
                  source={{ uri: mainImage }} // Use the mainImage state
                  style={styles.modalImage}
                />
                <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                <Text style={styles.modalPrice}>
                  Price: ${selectedItem.price.toFixed(2)}
                </Text>
                <Text style={styles.modalDescription}>
                  {selectedItem.notes}
                </Text>
                <Text style={styles.modalDescription}>
                  Items Left: {selectedItem.item_count}
                </Text>

                {/* Quantity Controls */}
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <MaterialIcons name="remove" size={24} color="black" />
                  </TouchableOpacity>
                  <View style={styles.quantityDisplay}>
                    <Text style={styles.cartItemQuantity}>{quantity}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => setQuantity(quantity + 1)}
                  >
                    <MaterialIcons name="add" size={24} color="black" />
                  </TouchableOpacity>
                </View>

                {/* Scrollable Additional Images */}
                <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.scrollContainer}>
                  <TouchableOpacity onPress={() => setMainImage(DEFAULT_IMAGE)}>
                    <Image source={{ uri: DEFAULT_IMAGE }} style={styles.additionalImage} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setMainImage(DEFAULT_IMAGE2)}>
                    <Image source={{ uri: DEFAULT_IMAGE2 }} style={styles.additionalImage} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setMainImage(DEFAULT_IMAGE3)}>
                    <Image source={{ uri: DEFAULT_IMAGE3 }} style={styles.additionalImage} />
                  </TouchableOpacity>
                </ScrollView>

                {/* Modal Actions */}
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setItemModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddToCart}
                  >
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
    <View style={styles.modalContainerCart}>
      <Text style={styles.modalTitle}>Shopping Cart</Text>
      <ScrollView>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <Image
              source={{ uri: item.image }}
              style={styles.cartItemImage}
            />
            <Text style={styles.cartItemName}>{item.name}</Text>
            <Text style={styles.cartItemPrice}>
              ${item.price.toFixed(2)} x {item.quantity}
            </Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                onPress={() => handleQuantityChange(item.id, -1)}
                style={styles.quantityButton}
              >
                <MaterialIcons name="remove" size={24} color="black" />
              </TouchableOpacity>
              <View style={styles.quantityDisplay}>
                <Text style={styles.cartItemQuantity}>
                  {item.quantity}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleQuantityChange(item.id, 1)}
                style={styles.quantityButton}
              >
                <MaterialIcons name="add" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => handleRemoveFromCart(item.id)}
              style={styles.removeButton}
            >
              <MaterialIcons name="close" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: ${calculateTotal()}</Text>
      </View>
      <View style={styles.modalActions}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setCartVisible(false)}
        >
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
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
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "green",
    paddingVertical: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    paddingLeft: 20,
  },
  headerText: {
    fontSize: 20,
    color: "#000",
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  inventoryContainer: {
    flex: 1,
    padding: 7,
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
    // borderColor: "black",
    // borderWidth: 0.5,
    
    padding: 4,
    paddingHorizontal: 5,
    paddingBottom: 12,
    margin: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: 250,
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
  cartButton: {
    paddingRight: 20,
  },
  picker: {
    height: 50,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
  pickerItem: {
    height: 44,
    color: "#000",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay for background
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainerCart: {
    width: "90%", // Width of the modal
    maxHeight: "60%", // Max height of the modal
    backgroundColor: "white", // White background for the modal
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
    padding: 18,
    paddingHorizontal: 15,
    paddingBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  additionalImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 5,
  },
  scrollContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  modalContainer: {
    width: "90%", // Width of the modal
    maxHeight: "100%", // Max height of the modal
    backgroundColor: "white", // White background for the modal
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
    padding: 7,
    paddingHorizontal: 12,
    paddingBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  modalTitle: {
    position: "absolute", // Position it absolutely
    top: 20, // Adjust to place it where you want
    left: 20, // Adjust to center or position it
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white", // Make sure the text is visible over the image
  },
  modalImage: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalPrice: {
    fontSize: 18,
    color: "#2ecc71",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 15,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "center",
  },
  quantityButton: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f0f0f0",
    padding: 5,
    marginHorizontal: 5,
  },
  quantityDisplay: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f0f0f0",
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cartItemImage: {
    width: 50,
    height: 50,
    borderRadius: 9,
    marginRight: 10,
  },
  cartItemName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold'
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  cartItemQuantity: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  removeButton: {
    marginLeft: 10,
  },
  totalContainer: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    marginTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end", // Align buttons to the right
    marginTop: 20,
  },
  addButton: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 5,
  },
  closeButton: {
    backgroundColor: "#FF0000",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  checkoutButton: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default StoreInventory;
